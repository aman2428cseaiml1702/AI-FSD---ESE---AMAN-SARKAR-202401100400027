import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name') || 'User';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/complaints`, {
        headers: { 'x-auth-token': token }
      });
      setComplaints(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchComplaints();
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/complaints/search?location=${searchTerm}`, {
        headers: { 'x-auth-token': token }
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Error searching:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/complaints/${id}`, { status }, {
        headers: { 'x-auth-token': token }
      });
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteComplaint = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/complaints/${id}`, {
        headers: { 'x-auth-token': token }
      });
      alert('Complaint deleted successfully!');
      fetchComplaints();
    } catch (err) {
      console.error('Error deleting complaint:', err);
      alert('Failed to delete complaint.');
    }
  };

  const filteredComplaints = categoryFilter 
    ? complaints.filter(c => c.category === categoryFilter)
    : complaints;

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: '2rem', fontSize: '2rem', color: '#e0aaff' }}>
        Welcome, {userName}! {userRole === 'admin' ? '(Admin Dashboard)' : ''}
      </h2>

      <div className="widgets-grid">
        <div className="widget glass-panel">
          <p>Total Complaints</p>
          <h3>{totalComplaints}</h3>
        </div>
        <div className="widget glass-panel">
          <p>Pending</p>
          <h3>{pendingComplaints}</h3>
        </div>
        <div className="widget glass-panel">
          <p>Resolved</p>
          <h3>{resolvedComplaints}</h3>
        </div>
        <div className="widget glass-panel" style={{ borderTop: '3px solid #00d2ff' }}>
          <p>System Status</p>
          <h3 style={{ background: 'linear-gradient(to right, #00d2ff, #3a7bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Online
          </h3>
        </div>
      </div>

      <div className="search-bar">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Search by Location (e.g., Ghaziabad)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>

        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Roads">Roads</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="card glass-panel table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length > 0 ? (
              filteredComplaints.map(complaint => (
                <tr key={complaint._id}>
                  <td><strong>{complaint.title}</strong><br/><small>{complaint.email}</small></td>
                  <td>{complaint.category}</td>
                  <td>{complaint.location}</td>
                  <td>
                    <span className={`badge badge-${complaint.status.toLowerCase()}`}>
                      {complaint.status}
                    </span>
                  </td>
                  <td>
                    {userRole === 'admin' ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select 
                          value={complaint.status} 
                          onChange={(e) => updateStatus(complaint._id, e.target.value)}
                          style={{ padding: '0.25rem', borderRadius: '0.25rem', background: '#302b63', color: '#fff', border: '1px solid #7b2cbf' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                        <button 
                          className="btn" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#e63946', color: '#fff', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                          onClick={() => deleteComplaint(complaint._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#e63946', color: '#fff', borderRadius: '0.25rem', border: 'none', cursor: 'pointer' }}
                        onClick={() => deleteComplaint(complaint._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No complaints found. Add your complaint using <strong>Add Complaint</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
