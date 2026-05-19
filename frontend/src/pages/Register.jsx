import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ setAuth }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('name', res.data.user.name);
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto' }} className="card glass-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#e0aaff' }}>Create an Account</h2>
      {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" name="name" value={name} onChange={onChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" name="email" value={email} onChange={onChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" value={password} onChange={onChange} className="form-control" required minLength="6" />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select 
            name="role" 
            value={role} 
            onChange={onChange}
            className="form-control"
          >
            <option value="user">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login</Link>
      </p>
    </div>
  );
};

export default Register;
