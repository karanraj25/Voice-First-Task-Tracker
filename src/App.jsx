import React, { useState } from "react";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import TaskList from "./components/TaskList";
import TaskDialog from "./components/TaskDialog";

const STATUSES = ["Pending", "In Progress", "Completed"];

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Add or edit task handler
  const handleSaveTask = (title, description, taskId = null) => {
    if (taskId) {
      setTasks(tasks =>
        tasks.map(task =>
          task.id === taskId
            ? { ...task, title, description }
            : task
        )
      );
    } else {
      setTasks(tasks => [
        ...tasks,
        {
          id: Date.now().toString(),
          title,
          description,
          status: "Pending",
        },
      ]);
    }
  };

  // Cycle status on click
  const handleToggleStatus = (taskId) => {
    setTasks(tasks =>
      tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status:
                STATUSES[(STATUSES.indexOf(task.status) + 1) % STATUSES.length],
            }
          : task
      )
    );
  };

  // Open task in edit mode
  const handleEditTask = (task) => {
    setEditTask(task);
  };

  // Filter handler
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={`app-root ${darkMode ? "dark" : "light"}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={()=>setDarkMode(d => !d)} />
        <div className="container">
          <header>
            <h1>🗣️ Voice-First Task Tracker</h1>
            <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
              <input
                type="text"
                value={filter}
                placeholder="Filter by title"
                onChange={handleFilterChange}
                aria-label="Filter tasks"
                style={{flex:1}}
              />
              <button onClick={() => setShowAddDialog(true)}>
                ➕ Add Task
              </button>
            </div>
          </header>
          <main>
            <TaskList
              tasks={filteredTasks}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditTask}
            />
          </main>
          {showAddDialog && (
            <TaskDialog
              onClose={() => setShowAddDialog(false)}
              onSave={handleSaveTask}
            />
          )}
          {editTask && (
            <TaskDialog
              task={editTask}
              onClose={() => setEditTask(null)}
              onSave={(title, description) =>
                {handleSaveTask(title, description, editTask.id); setEditTask(null);}
              }
            />
          )}
        </div>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
