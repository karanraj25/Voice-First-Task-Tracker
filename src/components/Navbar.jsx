function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🗣️ Voice Task Tracker</div>
      <button className="theme-toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? "🌞 Light" : "🌙 Night"}
      </button>
    </nav>
  );
}
export default Navbar;
