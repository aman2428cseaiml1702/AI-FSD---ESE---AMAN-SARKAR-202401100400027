import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/complaints', {
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
      const res = await axios.get(`http://localhost:5000/api/complaints/search?location=${searchTerm}`, {
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
      await axios.put(`http://localhost:5000/api/complaints/${id}`, { status }, {
        headers: { 'x-auth-token': token }
      });
      fetchComplaints();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredComplaints = categoryFilter 
    ? complaints.filter(c => c.category === categoryFilter)
    : complaints;

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Complaints Dashboard</h2>

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
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="card table-container">
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
                    <select 
                      value={complaint.status} 
                      onChange={(e) => updateStatus(complaint._id, e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '0.25rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
