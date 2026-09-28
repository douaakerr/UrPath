import { useMemo, useState } from "react";
import { Check, ExternalLink, FolderKanban, Plus, Trash2, X } from "lucide-react";
import "../../style/projects.css";

const STORAGE_KEY = "urpath-projects";

function loadProjects() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function Projects() {
  const [projects, setProjects] = useState(loadProjects);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", status: "planned", link: "" });

  const persist = (next) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addProject = (event) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    persist([
      { id: crypto.randomUUID(), ...form, title: form.title.trim(), createdAt: new Date().toISOString() },
      ...projects,
    ]);
    setForm({ title: "", description: "", status: "planned", link: "" });
    setOpen(false);
  };

  const toggleDone = (id) => {
    persist(projects.map((project) =>
      project.id === id ? { ...project, status: project.status === "completed" ? "planned" : "completed" } : project,
    ));
  };

  const remove = (id) => persist(projects.filter((project) => project.id !== id));

  const visible = useMemo(
    () => filter === "all" ? projects : projects.filter((project) => project.status === filter),
    [filter, projects],
  );

  return (
    <main className="projects-page">
      <header className="projects-header">
        <div>
          <span className="projects-eyebrow">BUILD AS YOU LEARN</span>
          <h1>Projects</h1>
          <p>Turn roadmap knowledge into things you can show, test and improve.</p>
        </div>
        <button className="projects-add" onClick={() => setOpen(true)}><Plus size={18} /> New project</button>
      </header>

      <div className="projects-toolbar">
        {["all", "planned", "completed"].map((value) => (
          <button key={value} className={filter === value ? "is-active" : ""} onClick={() => setFilter(value)}>
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
        <span>{projects.length} project{projects.length === 1 ? "" : "s"}</span>
      </div>

      {visible.length === 0 ? (
        <section className="projects-empty">
          <div className="projects-empty__icon"><FolderKanban size={28} /></div>
          <h2>{projects.length ? "Nothing in this view" : "Start building something"}</h2>
          <p>Create a small project after each meaningful milestone. Your work becomes part of the path.</p>
          <button onClick={() => setOpen(true)}><Plus size={17} /> Create project</button>
        </section>
      ) : (
        <section className="projects-grid">
          {visible.map((project) => (
            <article className={`project-card ${project.status === "completed" ? "project-card--done" : ""}`} key={project.id}>
              <div className="project-card__top">
                <span className={`project-status project-status--${project.status}`}>{project.status}</span>
                <button className="project-icon-button" onClick={() => remove(project.id)} aria-label="Delete project"><Trash2 size={16} /></button>
              </div>
              <h2>{project.title}</h2>
              <p>{project.description || "A practical project connected to your learning path."}</p>
              <div className="project-card__actions">
                <button onClick={() => toggleDone(project.id)}>
                  {project.status === "completed" ? <><Check size={16} /> Completed</> : "Mark complete"}
                </button>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Open</a>
                )}
              </div>
            </article>
          ))}
        </section>
      )}

      {open && (
        <div className="project-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-title">
            <button className="project-modal__close" onClick={() => setOpen(false)} aria-label="Close"><X size={19} /></button>
            <span className="projects-eyebrow">NEW PROJECT</span>
            <h2 id="project-title">What are you building?</h2>
            <form onSubmit={addProject}>
              <label>Project name<input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Personal portfolio" /></label>
              <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will you build or practice?" rows="4" /></label>
              <div className="project-form-grid">
                <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="planned">Planned</option><option value="completed">Completed</option></select></label>
                <label>Project link<input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></label>
              </div>
              <button className="project-modal__submit" type="submit">Add project</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

export default Projects;
