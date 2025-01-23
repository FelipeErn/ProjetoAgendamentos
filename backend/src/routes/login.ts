import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";
import jwt from "jsonwebtoken";

export const loginRoutes = express.Router()

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
        "seu_segredo", // Substitua por uma variável de ambiente para maior segurança
        { expiresIn: "1h" } // Expiração do token (1 hora)
      );

      res.status(200).json({ message: "Login bem-sucedido", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erro no servidor" });
    }
  }
);