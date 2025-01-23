import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../db";
import { body, validationResult } from "express-validator";
import { sendRecoveryEmail } from "../services/emailService";

export const resetPasswordRoutes = express.Router()

resetPasswordRoutes.get(
    "/:token",
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

resetPasswordRoutes.post(
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

resetPasswordRoutes.patch(
    "/",
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