import express from "express"
import { loginRoutes } from "./login";
import { registerRoutes } from "./register";
import { resetPasswordRoutes } from "./resetPassword";

const router = express.Router()

router.use('/login', loginRoutes);
router.use('/register', registerRoutes);
router.use('/reset-password', resetPasswordRoutes);

export default router