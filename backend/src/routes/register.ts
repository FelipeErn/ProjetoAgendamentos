import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../db";
import { body, validationResult } from "express-validator";
import { sendConfirmationEmail } from "../services/emailService";

export const registerRoutes = express.Router()

registerRoutes.post(
    "/",
    [
        body("email").isEmail().withMessage("E-mail inválido"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("A senha deve ter pelo menos 6 caracteres"),
        body("name").notEmpty().withMessage("O nome é obrigatório"),
    ],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password, name } = req.body;

        try {
            // Verificar se o e-mail já está cadastrado
            const userExists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
            if (userExists.rows.length > 0) {
                res.status(400).json({ message: "E-mail já cadastrado" });
                return;
            }

            // Criptografar a senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // Criar o usuário no banco de dados
            const newUser = await pool.query(
                "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
                [name, email, hashedPassword]
            );

            const userId = newUser.rows[0].id;

            // Gerar o token de confirmação
            const confirmationToken = jwt.sign({ userId }, process.env.CONFIRMATION_SECRET as string, { expiresIn: "24h" });

            // Salvar o token no banco de dados
            try {
                const result = await pool.query(
                    "UPDATE users SET confirmation_token = $1 WHERE id = $2",
                    [confirmationToken, userId]
                );
                console.log('Query executada com sucesso:', result);
            } catch (err) {
                console.error('Erro ao executar a query:', err);
            }

            res.status(201).json({ message: "Conta criada com sucesso! Verifique seu e-mail para confirmar sua conta." });
            
            // Enviar o e-mail de confirmação
            sendConfirmationEmail(email, confirmationToken);
        } catch (err) {
            console.error("Erro ao criar conta:", err);
            res.status(500).json({ message: "Erro ao criar conta" });
        }
    }
);

registerRoutes.get(
    "/confirm-email/:token",
    async (req: Request, res: Response): Promise<void> => {
        const { token } = req.params;

        try {
            // Validar o token
            const decoded = jwt.verify(token, process.env.CONFIRMATION_SECRET as string) as { userId: string };

            // Verificar se a conta já está ativa
            const userResult = await pool.query(
                "SELECT is_active FROM users WHERE id = $1",
                [decoded.userId]
            );

            if (userResult.rows.length === 0) {
                res.status(400).json({ message: "Token inválido ou expirado" });
                return;
            }

            const isActive = userResult.rows[0].is_active;
            if (isActive) {
                res.status(200).json({
                    message: "Conta confirmada com sucesso!",
                    redirectUrl: `http://localhost:3001/email-confirmed`, // URL da tela de confirmação de conta
                });
                return;
            }

            // Verificar o token no banco de dados
            const tokenResult = await pool.query(
                "SELECT id FROM users WHERE id = $1 AND confirmation_token = $2",
                [decoded.userId, token]
            );

            if (tokenResult.rows.length === 0) {
                res.status(400).json({ message: "Token inválido ou expirado" });
                return;
            }

            // Atualizar o banco de dados para ativar a conta e limpar o token
            const updateResult = await pool.query(
                "UPDATE users SET is_active = true, confirmation_token = NULL WHERE id = $1",
                [decoded.userId]
            );

            if (updateResult.rowCount === 0) {
                res.status(400).json({ message: "Erro ao confirmar a conta." });
                return;
            }

            res.status(200).json({
                message: "Conta confirmada com sucesso!",
                redirectUrl: `http://localhost:3001/email-confirmed`,
            });
        } catch (err) {
            console.error("Erro ao confirmar e-mail:", err);
            res.status(400).json({ message: "Token inválido ou expirado" });
        }
    }
);

registerRoutes.post("/resend-confirmation-email", async (req: Request, res: Response): Promise<void> => {
    console.log('testeeee')
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ message: "O e-mail é obrigatório." });
        return;
    }

    try {
        // Verificar se o usuário existe
        const userQuery = await pool.query("SELECT id, is_active FROM users WHERE email = $1", [email]);
        const user = userQuery.rows[0];

        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado." });
            return;
        }

        // Verificar se o e-mail já foi ativado
        if (user.is_active) {
            res.status(400).json({ message: "O e-mail já foi confirmado." });
            return;
        }

        // Gerar um novo token de confirmação
        const confirmationToken = jwt.sign(
            { userId: user.id },
            process.env.CONFIRMATION_SECRET as string,
            { expiresIn: "24h" }
        );

        // Salvar o novo token no banco de dados (igual ao processo de registro)
        await pool.query("UPDATE users SET confirmation_token = $1 WHERE id = $2", [confirmationToken, user.id]);

        // Enviar o e-mail de confirmação
        await sendConfirmationEmail(email, confirmationToken);

        res.status(200).json({ message: "E-mail de confirmação reenviado com sucesso!" });
    } catch (err) {
        console.error("Erro ao reenviar e-mail de confirmação:", err);
        res.status(500).json({ message: "Erro ao reenviar o e-mail de confirmação." });
    }
});