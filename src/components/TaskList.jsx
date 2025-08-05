// src/components/TaskList.jsx

import React from "react";

function TaskList({ tasks, onToggleStatus, onEdit }) {
  if (tasks.length === 0) return <p>There are no records of Tasks yet....
Please check back later.</p>;

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`task-card status-${task.status.toLowerCase().replace(" ", "")}`}
          tabIndex={0}
          aria-label={`Task: ${task.title}, Status: ${task.status}. Click status or press E to edit.`}
          onClick={() => onToggleStatus(task.id)}
          onKeyDown={(e) => {
            if (e.key === "e" || e.key === "E") {
              e.preventDefault();
              onEdit(task);
            }
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onToggleStatus(task.id);
            }
          }}
          role="button"
        >
          <div className="task-content">
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span className="status">{task.status}</span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              aria-label={`Edit task: ${task.title}`}
              className="edit-btn"
            >
              <img 
                src="https://img.icons8.com/ios-glyphs/30/3b82f6/edit--v1.png" 
                alt="Edit task"
                width="24"
                height="24"
                style={{ display: "block" }}
              />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
