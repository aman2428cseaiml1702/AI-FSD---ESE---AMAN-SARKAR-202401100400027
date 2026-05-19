import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water Supply',
    location: ''
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { title, description, category, location } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleAnalyze = async () => {
    if (!description) return alert("Please provide a description first.");
    
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/ai/analyze`, { text: description }, {
        headers: { 'x-auth-token': token }
      });
      setAiAnalysis(res.data);
    } catch (err) {
      console.error("AI Analysis failed", err);
    }
    setIsAnalyzing(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // If AI suggested a department, use it as category, otherwise use form category
      const finalCategory = aiAnalysis?.department || category;
      
      await axios.post(`${API_URL}/api/complaints`, { ...formData, category: finalCategory }, {
        headers: { 'x-auth-token': token }
      });
      alert('Complaint registered successfully!');
      navigate('/');
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error submitting complaint');
      alert('Failed to register complaint.');
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
      <div className="card glass-panel">
        <h2 style={{ marginBottom: '1.5rem', color: '#e0aaff' }}>Register Complaint</h2>
        <form onSubmit={onSubmit} style={{ marginTop: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Complaint Title</label>
            <input type="text" name="title" value={title} onChange={onChange} className="form-control" required />
          </div>

          <div className="form-group">
            <label className="form-label">Complaint Description</label>
            <textarea name="description" value={description} onChange={onChange} className="form-control" required></textarea>
            <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="btn" style={{ marginTop: '0.5rem', backgroundColor: '#E5E7EB', color: '#374151' }}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" value={category} onChange={onChange} className="form-control">
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" name="location" value={location} onChange={onChange} className="form-control" required placeholder="e.g., Ghaziabad" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Submit Complaint
          </button>
        </form>
      </div>

      <div className="card glass-panel" style={{ height: 'fit-content' }}>
        {aiAnalysis ? (
          <div className="ai-box">
            <h3 style={{ color: '#e0aaff' }}>AI Analysis Result</h3>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Priority Detected:</strong> {aiAnalysis.priority}</p>
              <p><strong>Suggested Department:</strong> {aiAnalysis.department}</p>
              <div style={{ marginTop: '1rem' }}>
                <strong>AI Summary:</strong>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{aiAnalysis.summary}"</p>
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--surface-color)', borderRadius: '0.25rem' }}>
                <strong>Auto-Response Draft:</strong>
                <p>{aiAnalysis.autoResponse}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
            <p>Write a description and click "Analyze with AI" to see intelligent suggestions before submitting.</p>
          </div>
        )}
      </div>

      {/* Extended Guide Section */}
      <div className="card glass-panel" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
        <h2 style={{ color: '#e0aaff', marginBottom: '1.5rem' }}>Guide: How to Report an Issue Effectively</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Best Practices for Quick Resolution</h4>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <li style={{ marginBottom: '0.5rem' }}><strong>Be Specific:</strong> Instead of "pipe broken", write "The main water pipe outside Building A is leaking heavily onto the sidewalk."</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Exact Location:</strong> Always provide the nearest landmark, street name, or building number.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Use the AI:</strong> Click "Analyze with AI" before submitting to ensure our system routes your issue to the correct department immediately.</li>
              <li style={{ marginBottom: '0.5rem' }}><strong>Safety First:</strong> If the issue poses an immediate danger (like exposed electrical wires), please call the emergency hotline directly.</li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <img 
              src="/water_leak.png" 
              alt="Example of a well-documented leak" 
              style={{ 
                width: '100%', 
                maxHeight: '250px', 
                objectFit: 'cover', 
                borderRadius: '8px',
                border: '1px solid rgba(157, 78, 221, 0.3)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }} 
            />
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Example: Clear, visible documentation of a municipal water leak.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComplaint;
