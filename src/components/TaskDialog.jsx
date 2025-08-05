import React, { useState, useEffect } from "react";
import VoiceInput from "./VoiceInput";

function parseTranscript(transcript) {
  let title = transcript;
  let description = "";

  if (transcript.toLowerCase().includes(" about ")) {
    const parts = transcript.split(/ about /i);
    title = parts[0].trim();
    description = parts.slice(1).join(" about ").trim();
  } else if (transcript.includes(",")) {
    const parts = transcript.split(",");
    title = parts[0].trim();
    description = parts.slice(1).join(",").trim();
  } else if (transcript.includes(".")) {
    const parts = transcript.split(".");
    title = parts[0].trim();
    description = parts.slice(1).join(".").trim();
  }

  return { title, description };
}

function TaskDialog({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [useVoice, setUseVoice] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [voiceDone, setVoiceDone] = useState(false);
  const [rawTranscript, setRawTranscript] = useState("");

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setVoiceError(null);
    setVoiceDone(false);
    setRawTranscript("");
  }, [task]);

  const handleVoiceResult = (transcript) => {
    setRawTranscript(transcript);
    const { title: parsedTitle, description: parsedDesc } = parseTranscript(transcript);
    setTitle(parsedTitle);
    setDescription(parsedDesc);
    setVoiceDone(true);
  };

  const handleVoiceError = (err) => {
    setVoiceError(err);
    setUseVoice(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title cannot be empty.");
      return;
    }
    onSave(title.trim(), description.trim());
    onClose();
  };

  const resetVoice = () => {
    setVoiceDone(false);
    setRawTranscript("");
    setVoiceError(null);
    setUseVoice(true);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="dialogTitle">
      <form onSubmit={handleSubmit} className="task-form">
        {/* Close button top-right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="modal-close-btn"
        >
          &times;
        </button>

        <h2 id="dialogTitle">{task ? "Edit Task" : "Add Task"}</h2>

        {voiceError && (
          <div>
            <div className="banner error">Voice error: {voiceError}</div>
            <button type="button" onClick={() => setUseVoice(false)}>
              ✏️ Use Text Input Instead
            </button>
          </div>
        )}

        {useVoice && !voiceDone && !voiceError && (
          <VoiceInput
            onResult={handleVoiceResult}
            onError={handleVoiceError}
            onStop={() => {}}
          />
        )}

        {useVoice && voiceDone && !voiceError && (
          <div>
            <div className="banner success">✅ Voice input successful!</div>
            <p><b>Raw Transcript:</b> <i>{rawTranscript}</i></p>
            <p><b>Parsed Title:</b> {title}</p>
            <p><b>Parsed Description:</b> {description || "(No description)"}</p>
            <div className="dialog-actions">
              <button type="button" onClick={() => setUseVoice(false)}>
                ✏️ Edit as Text
              </button>
              <button type="button" onClick={resetVoice}>
                🔄 Retry Voice Input
              </button>
              <button type="submit">✅ Accept & Save</button>
            </div>
          </div>
        )}

        {!useVoice && !voiceError && (
          <>
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <div className="dialog-actions">
              <button type="button" onClick={() => setUseVoice(true)} className="voice-input-toggle-btn">
                🎤 Use Voice Input
              </button>
              <button type="submit">{task ? "Save" : "Add"}</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

export default TaskDialog;
