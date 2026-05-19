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

  const handleAnalyze = async () => {
    if (!description) return alert("Please provide a description first.");
    
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/ai/analyze', { text: description }, {
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
      
      await axios.post('http://localhost:5000/api/complaints', { ...formData, category: finalCategory }, {
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div className="card">
        <h2>Register Complaint</h2>
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

      <div>
        {aiAnalysis ? (
          <div className="card ai-box">
            <h3>AI Analysis Result</h3>
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
    </div>
  );
};

export default AddComplaint;
