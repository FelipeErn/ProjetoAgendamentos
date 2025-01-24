import dotenv from "dotenv";
dotenv.config();  // Carrega as variáveis do .env

import express from "express";

import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(3000, () => console.log("Running on http://localhost:3000"));
