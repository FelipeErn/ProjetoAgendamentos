import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

export const loginRoutes = express.Router()

// Configuração do cliente do Google
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Login via e-mail e senha
loginRoutes.post(
  "/",
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
      // Buscar o usuário pelo e-mail
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = result.rows[0];

      if (!user) {
        res.status(400).json({ message: "Usuário não encontrado" });
        return;
      }

      // Verificar se a conta está ativada
      if (!user.is_active) {
        res.status(403).json({ message: "A conta ainda não foi ativada. Verifique seu e-mail para confirmar sua conta." });
        return;
      }

      // Verificar a senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ message: "Senha incorreta" });
        return;
      }

      // Geração do token JWT
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "seu_segredo", // Usando variável de ambiente para segurança
        { expiresIn: "1h" } // Expiração do token (1 hora)
      );

      res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
);

// Login via Google
loginRoutes.post("/google", async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: "Token do Google é obrigatório" });
    return;
  }

  try {
    // Verificar o token com a API do Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Deve ser o mesmo client ID configurado no frontend
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).json({ message: "Token inválido" });
      return;
    }

    // Verificar se o usuário já existe
    let user = await pool.query("SELECT * FROM users WHERE email = $1", [payload.email]);

    if (user.rows.length === 0) {
      // Se o usuário não existe, criá-lo
      const newUser = await pool.query(
        "INSERT INTO users (email, name, is_active) VALUES ($1, $2, $3) RETURNING *",
        [payload.email, payload.name, true] // Considerando que o usuário será ativado automaticamente
      );
      user = newUser;
    }

    // Gerar o token JWT para o usuário
    const jwtToken = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET || "seu_segredo", // Usando variável de ambiente para maior segurança
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login com Google bem-sucedido", token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao autenticar com o Google" });
  }
});