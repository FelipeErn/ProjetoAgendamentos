import dotenv from "dotenv";
dotenv.config();  // Carrega as variáveis do .env

import express from "express";
import { Pool } from "pg";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: "http://localhost:3001",  // Permite o frontend rodando em 3001
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"], // Adiciona os headers permitidos
};

// Aplica o CORS globalmente antes das rotas
app.use(cors(corsOptions));

// Configuração de parsing de corpo JSON
app.use(express.json()); // Para lidar com dados JSON no corpo da requisição

app.use("/api/users", userRoutes);

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "projeto",
  password: "123",
  port: 5432,
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(result.rows);
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
