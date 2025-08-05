import React, { useState, useRef } from "react";

export default function VoiceInput({ onResult, onError }) {
  const [state, setState] = useState("ready"); // ready, listening, processing, success, error
  const transcriptRef = useRef("");

  const startListening = () => {
    setState("listening");
    transcriptRef.current = "";
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setState("error");
      onError("Speech Recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setState("listening");

    recognition.onerror = (event) => {
      setState("error");
      const msg =
        event.error === "not-allowed"
          ? "Microphone permission denied."
          : event.error || "Speech recognition error";
      onError(msg);
    };

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      transcriptRef.current = speech;
    };

    recognition.onend = () => {
      setState("processing");
      setTimeout(() => {
        setState("success");
        onResult(transcriptRef.current.trim() || "");
      }, 400);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (state === "listening" && window.SpeechRecognition) {
      // Attempt to stop recognition, if running
      try {
        // Access recognition instance is tricky here; 
        // we could keep it in a ref if needed, but currently omitted
      } catch {}
    }
  };

  const reset = () => {
    setState("ready");
    transcriptRef.current = "";
  };

  return (
    <div className="voice-input">
      {state === "ready" && (
        <button className="mic-button" onClick={startListening} aria-label="Start voice input">
          🎤 Tap to speak
        </button>
      )}

      {state === "listening" && (
        <div className="status listening">
          <div className="red-pulse"></div>
          <p>🔴 Listening...</p>
          {/* Optionally add stop button */}
        </div>
      )}

      {state === "processing" && (
        <div className="status processing">
          <div className="spinner"></div>
          <p>⚡ Processing speech...</p>
        </div>
      )}

      {state === "success" && (
        <div className="status success">
          <p>✅ Transcribed Text:</p>
          <blockquote>{transcriptRef.current}</blockquote>
          <div className="actions">
            <button onClick={() => onResult(transcriptRef.current)}>Accept</button>
            <button onClick={reset}>Retry</button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="status error">
          <p>❌ Couldn't hear you, try again.</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    </div>
  );
}
