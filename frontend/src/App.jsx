import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddComplaint from './pages/AddComplaint';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/" className="navbar-brand">Smart Complaint System</Link>
          <div className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/add-complaint" className="nav-link">Add Complaint</Link>
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
              </>
            ) : (
              <>
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
      </div>
    </Router>
  );
}

export default App;
