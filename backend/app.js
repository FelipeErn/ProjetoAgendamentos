require('dotenv').config();  // Carrega variáveis de ambiente
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

// Configura o middleware para processar o corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Simulação de um banco de dados de usuários
const users = [
  { email: 'user@example.com', password: '123456', name: 'John Doe' }
];

// Rota para iniciar o processo de recuperação de senha
app.post('/recover', async (req, res) => {
  const { email } = req.body;

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'E-mail não encontrado' });
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetUrl = `http://localhost:3000/reset/${resetToken}`;

  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000;  // Expira em 1 hora

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Recuperação de Senha',
    html: `<p>Olá, ${user.name}!</p><p>Para recuperar sua senha, clique no link abaixo:</p><a href="${resetUrl}">${resetUrl}</a>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'E-mail de recuperação enviado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar o e-mail', error: err.message });
  }
});

// Rota para redefinir a senha
app.post('/reset/:token', (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = users.find(
    (user) => user.resetToken === token && user.resetTokenExpiry > Date.now()
  );

  if (!user) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  user.password = newPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  res.status(200).json({ message: 'Senha alterada com sucesso!' });
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
