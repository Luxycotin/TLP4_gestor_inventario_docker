import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local", override: true });
import express from "express";
import cors from "cors";
import { connectDB } from "./db/index.js";
import tasksRouter from "./routes/tasks.routes.js";
import { ZodError } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/tasks", tasksRouter);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json(err.flatten());
  }
  console.error("[ERROR]", err);
  return res.status(500).json({ message: "Error interno" });
});
