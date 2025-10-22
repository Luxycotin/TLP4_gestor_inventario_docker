import { Router } from "express";
import { TaskModel } from "../db/index.js";
import { z } from "zod";

const router = Router();

const TaskDTO = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().optional().default(""),
  estado: z.enum(["pendiente", "completada"]).optional()
});
const TaskUpdateDTO = TaskDTO.partial();

router.get("/", async (_req, res) => {
  const tasks = await TaskModel.find().lean();
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const parsed = TaskDTO.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const created = await TaskModel.create(parsed.data);
  res.status(201).json(created);
});

router.put("/:id", async (req, res) => {
  const parsed = TaskUpdateDTO.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const updated = await TaskModel.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!updated) return res.status(404).json({ message: "No encontrada" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const deleted = await TaskModel.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "No encontrada" });
  res.status(204).send();
});

router.patch("/:id/toggle", async (req, res) => {
  const task = await TaskModel.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "No encontrada" });
  task.estado = task.estado === "pendiente" ? "completada" : "pendiente";
  await task.save();
  res.json(task);
});

export default router;
