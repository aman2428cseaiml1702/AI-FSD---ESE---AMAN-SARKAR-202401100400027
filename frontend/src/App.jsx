import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddComplaint from './pages/AddComplaint';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar glass-panel">
          <Link to="/" className="navbar-brand">Smart Complaint System</Link>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link">Complaint List</Link>
                <Link to="/add-complaint" className="nav-link">Add Complaint</Link>
                {userRole !== 'admin' && (
                  <Link to="#" className="nav-link" onClick={() => alert('Support Contact: admin@smartcomplaint.com\nPhone: 1-800-COMPLAINT')}>Contact Support</Link>
                )}
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
              </>
            ) : (
              <>
                <Link to="#" className="nav-link">Help</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
            <Route path="/register" element={<Register setAuth={setIsAuthenticated} />} />
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Login setAuth={setIsAuthenticated} />} />
            <Route path="/add-complaint" element={isAuthenticated ? <AddComplaint /> : <Login setAuth={setIsAuthenticated} />} />
          </Routes>
        </main>

        <footer className="footer glass-panel">
          <div>&copy; 2026 Smart Complaint System. All rights reserved.</div>
          <div className="footer-links">
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
