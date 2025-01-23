import nodemailer from "nodemailer";

export const sendRecoveryEmail = async (email: string, token: string) => {
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

export const sendConfirmationEmail = async (email: string, token: string) => {
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
    subject: "Confirmação de Cadastro",
    text: `Obrigado por se registrar! Confirme seu e-mail clicando no link: http://localhost:3001/register/confirm-email/${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-mail de confirmação enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar e-mail de confirmação:", error);
    throw new Error("Erro ao enviar e-mail de confirmação");
  }
};