import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const emptyForm = {
  title: '',
  description: '',
  priority: 'MEDIUM'
};

const profileImageUrl =
  'https://panel.inonu.edu.tr/servlet/image/AVATAR/1779/26-05-2025_080908445_225x300.png';

function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkBackend();
    loadTasks();
  }, []);

  async function checkBackend() {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({ service: 'backend', status: 'unreachable', port: 8082 });
    }
  }

  async function loadTasks() {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
      setMessage('');
    } catch (error) {
      setMessage('Gorevler alinamadi. Backend servisinin calistigini kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  async function addTask(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setMessage('Baslik alani bos birakilamaz.');
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          status: 'TODO'
        })
      });

      const createdTask = await response.json();
      setTasks((currentTasks) => [...currentTasks, createdTask]);
      setForm(emptyForm);
      setMessage('Yeni gorev eklendi.');
    } catch (error) {
      setMessage('Gorev eklenemedi.');
    }
  }

  async function updateTaskStatus(task) {
    const nextStatus = getNextStatus(task.status);

    try {
      const response = await fetch(`/api/tasks/${task.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });

      const updatedTask = await response.json();
      setTasks((currentTasks) =>
        currentTasks.map((item) => (item.id === updatedTask.id ? updatedTask : item))
      );
      setMessage(`${task.title} durumu ${nextStatus} olarak guncellendi.`);
    } catch (error) {
      setMessage('Durum guncellenemedi.');
    }
  }

  function getNextStatus(currentStatus) {
    if (currentStatus === 'TODO') return 'IN_PROGRESS';
    if (currentStatus === 'IN_PROGRESS') return 'DONE';
    return 'TODO';
  }

  return (
    <main className="app-shell">
      <section className="top-panel">
        <div>
          <p className="eyebrow">GitHub + Jenkins + Docker</p>
          <h1>Task Tracker CI/CD Demo</h1>
          <p className="intro">
            Gorevleri takip et, yeni notlar ekle ve pipeline sonrasi uygulamanin ayakta oldugunu kontrol et.
          </p>
        </div>

        <div
          className={`status-card status-image ${status?.status === 'ok' ? 'online' : 'offline'}`}
        >
          <img src={profileImageUrl} alt="Profil fotografi" />
        </div>
      </section>

      {message && <p className="message">{message}</p>}

      <section className="task-section">
        <div className="section-heading">
          <h2>Gorev Listesi</h2>
          <button type="button" onClick={loadTasks}>Yenile</button>
        </div>

        {loading ? (
          <p className="empty-state">Gorevler yukleniyor...</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <article key={task.id} className="task-card">
                <div className="card-heading">
                  <h3>{task.title}</h3>
                  <span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>
                <p>{task.description}</p>
                <div className="card-footer">
                  <span className={`status ${task.status.toLowerCase()}`}>{task.status}</span>
                  <button type="button" onClick={() => updateTaskStatus(task)}>
                    Durumu Guncelle
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="form-section">
        <h2>Yeni Gorev Ekle</h2>
        <form onSubmit={addTask} className="task-form">
          <label>
            Baslik
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Orn: Jenkins raporunu kontrol et"
            />
          </label>
          <label>
            Aciklama
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Kisa bir gorev notu yaz"
              rows="3"
            />
          </label>
          <label>
            Oncelik
            <select
              value={form.priority}
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
          <button type="submit">Gorev Ekle</button>
        </form>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
