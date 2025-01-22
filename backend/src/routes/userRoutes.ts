import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";  // Importando jwt
import nodemailer from "nodemailer"; // Importando nodemailer para envio de email

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "projeto",
  password: "123",
  port: 5432,
});

const router = express.Router();

// Função para enviar e-mail
const sendRecoveryEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperação de Senha",
    text: `Você solicitou a recuperação de senha. Clique no link para redefinir sua senha: http://localhost:3001/reset-password/${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail de recuperação enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw new Error("Erro ao enviar e-mail de recuperação");
  }
};

// Gerar o token e armazenar no banco de dados
const generateResetToken = async (userId: number) => {
  const token = jwt.sign({ userId }, "seu_segredo", { expiresIn: "1h" });

  const resetTokenExpiry = new Date();
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Definir a expiração para 1 hora

  // Atualizar o banco de dados com o token e a expiração
  await pool.query(
    "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
    [token, resetTokenExpiry, userId]
  );

  return token;
};

// Validar o token de redefinição de senha
const validateResetToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, "seu_segredo") as { userId: string };

    // Verificar se o token no banco de dados corresponde
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND reset_token = $2 AND reset_token_expiry > NOW()",
      [decoded.userId, token]
    );

    if (result.rows.length === 0) {
      throw new Error("Token inválido ou expirado");
    }

    return decoded.userId;
  } catch (err) {
    throw new Error("Token inválido ou expirado");
  }
};

// Atualizar a senha
const updatePassword = async (userId: string, newPassword: string) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Atualizar a senha e remover o token
  await pool.query(
    "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
    [hashedPassword, userId]
  );
};

// Rota de login de usuário
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("E-mail inválido"),
    body("password").not().isEmpty().withMessage("Senha é obrigatória"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];

      if (!user) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ message: "Senha incorreta" });
        return;
      }

      // Geração do token JWT
      const token = jwt.sign(
        { userId: user.id },
        "seu_segredo",  // Segredo para assinar o token
        { expiresIn: "1h" }  // Expiração do token (1 hora)
      );

      res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
);

// Rota de recuperação de senha
router.post(
  "/recover",
  [
    body("email").isEmail().withMessage("E-mail inválido"),
  ],
  async (req: Request, res: Response): Promise<void> => { 
    const errors = validationResult(req);
    
    // Debug: Exibir os erros para análise
    console.log(errors.array());

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "O e-mail é obrigatório" });
      return;
    }

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];
    
      if (!user) {
        res.status(400).json({ message: "E-mail não encontrado" });
        return;
      }
    
      const token = jwt.sign(
        { userId: user.id },
        "seu_segredo", // Use uma variável de ambiente para segurança em produção
        { expiresIn: "1h" }
      );
    
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);
    
      // Atualizar o banco com o token e a expiração
      await pool.query(
        "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
        [token, resetTokenExpiry, user.id]
      );
    
      await sendRecoveryEmail(email, token);
    
      res.status(200).json({ message: "E-mail de recuperação enviado!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro ao enviar e-mail de recuperação" });
    }
  }
);

// Rota para renderizar o formulário de redefinição de senha
router.get(
  "/reset-password/:token",
  async (req: Request, res: Response): Promise<void> => {
    const { token } = req.params;

    try {
      // Validar o token
      const decoded = jwt.verify(token, "seu_segredo") as { userId: string };

      // Verificar no banco de dados
      const result = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND reset_token = $2 AND reset_token_expiry > NOW()",
        [decoded.userId, token]
      );

      if (result.rows.length === 0) {
        res.status(400).json({ message: "Token inválido ou expirado" });
        return;
      }

      // Se o token for válido, envia a URL para o front-end
      res.status(200).json({
        message: "Token válido",
        redirectUrl: `http://localhost:3001/reset-password/${token}`, // URL da tela de redefinição de senha
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Token inválido ou expirado" });
    }
  }
);

// Rota PATCH para redefinir a senha
router.patch(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Token é obrigatório"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres"),
    body("confirmPassword")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("As senhas não coincidem"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { token, password } = req.body;

    try {
      // Validar e decodificar o token
      const decoded = jwt.verify(token, "seu_segredo") as { userId: string };
      if (!decoded?.userId) {
        console.error("Token inválido: userId ausente");
        res.status(400).json({ message: "Token inválido" });
        return;
      }

      // Verificar se o token está no banco e é válido
      const result = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND reset_token = $2 AND reset_token_expiry > NOW()",
        [decoded.userId, token]
      );

      if (result.rows.length === 0) {
        console.error("Token inválido ou expirado");
        res.status(400).json({ message: "Token inválido ou expirado" });
        return;
      }

      // Atualizar a senha
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateResult = await pool.query(
        "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
        [hashedPassword, decoded.userId]
      );

      if (updateResult.rowCount === 0) {
        console.error("Falha ao atualizar a senha");
        res.status(400).json({ message: "Não foi possível atualizar a senha" });
        return;
      }

      res.status(200).json({ message: "Senha alterada com sucesso!" });
    } catch (err) {
      console.error("Erro ao redefinir a senha:", err);
      res.status(500).json({ message: "Erro ao redefinir a senha" });
    }
  }
);

// Rota de cadastro de usuário
router.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("E-mail inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha deve ter pelo menos 6 caracteres"),
  ],
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, password } = req.body;

    try {
      const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      if (existingUser.rows.length > 0) {
        res.status(400).json({ message: "E-mail já está em uso" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
        [name, email, hashedPassword]
      );

      res.status(201).json({ message: "Usuário cadastrado com sucesso!", userId: result.rows[0].id });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

export default router;
