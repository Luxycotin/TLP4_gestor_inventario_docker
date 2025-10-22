import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const { MONGO_URL = "mongodb://db:27017/tareasdb" } = process.env;

export async function connectDB() {
  await mongoose.connect(MONGO_URL);
  console.log("[DB] Conectada:", MONGO_URL);
}

export type TaskEstado = "pendiente" | "completada";

export interface ITask {
  titulo: string;
  descripcion: string;
  estado: TaskEstado;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new mongoose.Schema<ITask>(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, default: "" },
    estado: {
      type: String,
      enum: ["pendiente", "completada"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

export const TaskModel = mongoose.model<ITask>("Task", TaskSchema);
