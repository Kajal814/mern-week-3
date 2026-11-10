
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setError("");
      const response = await api.get("/tasks");

      setTasks(response.data.tasks || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please enter both title and description.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, {
          title,
          description,
        });
      } else {
        await api.post("/tasks", {
          title,
          description,
        });
      }

      setTitle("");
      setDescription("");
      setEditId(null);

      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save task."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);

      if (editId === id) {
        handleCancel();
      }

      await fetchTasks();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete task."
      );
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <div className="brand-icon">T</div>
          <span>TaskFlow</span>
        </div>

        <div className="sidebar-menu">
          <p className="menu-label">WORKSPACE</p>
          <div className="menu-item active">
            <span>▦</span> My Tasks
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="avatar">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.name || "User"}</strong>
              <small>{user?.email}</small>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / My Tasks</p>
            <h1>My Tasks</h1>
          </div>

          <div className="topbar-user">
            Welcome, {user?.name || "User"}
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <h2>Stay focused. Get things done.</h2>
            <p>Organize your work and keep track of your progress.</p>
          </div>
          <div className="welcome-icon">✓</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Tasks</span>
            <h2>{tasks.length}</h2>
            <p>All your tasks</p>
          </div>

          <div className="stat-card">
            <span>Active Tasks</span>
            <h2>{tasks.length}</h2>
            <p>Tasks in your workspace</p>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-panel">
            <div className="section-heading">
              <div>
                <h2>{editId ? "Edit Task" : "Create New Task"}</h2>
                <p>
                  {editId
                    ? "Update your task details."
                    : "Add something you want to accomplish."}
                </p>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label>Task Title</label>
              <input
                type="text"
                placeholder="e.g. Complete React assignment"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                placeholder="Write a short description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                required
              />

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editId
                    ? "Update Task"
                    : "+ Add Task"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="tasks-panel">
            <div className="section-heading tasks-heading">
              <div>
                <h2>All Tasks</h2>
                <p>{tasks.length} tasks in your workspace</p>
              </div>
              <span className="task-count">{tasks.length}</span>
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="Search your tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
              <p className="empty-state">Loading tasks...</p>
            ) : filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▤</div>
                <h3>No tasks found</h3>
                <p>
                  {search
                    ? "Try another search."
                    : "Create your first task to get started."}
                </p>
              </div>
            ) : (
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <article className="task-card" key={task._id}>
                    <div className="task-card-top">
                      <div className="task-dot"></div>
                      <span className="task-label">TASK</span>
                    </div>

                    <h3>{task.title}</h3>
                    <p>{task.description}</p>

                    <div className="task-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(task)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <footer className="dashboard-footer">
          TaskFlow · Organize your day, one task at a time.
        </footer>
      </main>
      <ImageUpload />
    </div>
  );
}

export default Dashboard;
