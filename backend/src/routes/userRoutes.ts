import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Pool } from "pg";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";  // Importando jwt

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "projeto",
  password: "123",
  port: 5432,
});

const router = express.Router();

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
