
const Navbar = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <header className="header">
      <div className="header-top">
        <h1>🧵 FabricsBossArena</h1>
        {onLogout && (
          <button id="logoutBtn" onClick={onLogout}>Logout</button>
        )}
      </div>
      <p>Where Elegance Meets Every Thread</p>
    </header>
  );
};

export default Navbar