import { useEffect, useState } from "react";
import { api } from "./api";
import "./App.css";

type Task = { _id: string; titulo: string; descripcion: string; estado: "pendiente" | "completada" };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const load = async () => {
    const { data } = await api.get<Task[]>("/tasks");
    setTasks(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!titulo.trim()) return;
    await api.post("/tasks", { titulo, descripcion });
    setTitulo("");
    setDescripcion("");
    load();
  };

  const toggle = async (t: Task) => {
    await api.patch(`/tasks/${t._id}/toggle`);
    load();
  };

  const remove = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    load();
  };

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="title">Gestor de Tareas</h1>
      </header>

      <section className="card">
        <div className="task-form">
          <input className="input" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <input className="input" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <button className="btn btn--primary" onClick={add}>Agregar</button>
        </div>
      </section>

      <section className="card">
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t._id} className="task-item">
              <button className={`check ${t.estado === "completada" ? "checked" : ""}`} onClick={() => toggle(t)} aria-label="Alternar estado" />
              <div className="task-content">
                <div className="task-title">{t.titulo}</div>
                {t.descripcion && <div className="task-desc">{t.descripcion}</div>}
              </div>
              <span className={`badge ${t.estado}`}>{t.estado}</span>
              <button className="btn btn--danger" onClick={() => remove(t._id)} aria-label="Eliminar">Eliminar</button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

