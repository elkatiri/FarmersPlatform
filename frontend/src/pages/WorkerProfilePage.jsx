import { useState } from 'react';
import { api } from '../services/api';

const initialState = {
  name: '',
  phone: '',
  regions: '',
  skills: '',
  experienceLevel: 'beginner',
  availability: 'immediate',
  transportFlexibility: 'yes',
};

const WorkerProfilePage = () => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.phone || !form.regions || !form.skills) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      await api.post('/workers', {
        ...form,
        regions: form.regions.split(',').map((item) => item.trim()).filter(Boolean),
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
      });
      setSuccess('Profile submitted successfully. Waiting for admin approval.');
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit profile.');
    }
  };

  return (
    <div className="card">
      <h2>Workers — Create Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="grid grid-2">
        <div>
          <label>Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label>Phone *</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label>Regions (comma-separated) *</label>
          <input value={form.regions} onChange={(e) => setForm({ ...form, regions: e.target.value })} placeholder="Nashik, Pune" />
        </div>
        <div>
          <label>Skills (comma-separated) *</label>
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="harvesting, pruning" />
        </div>
        <div>
          <label>Experience Level *</label>
          <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        <div>
          <label>Availability *</label>
          <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
            <option value="immediate">Immediate</option>
            <option value="within_week">Within week</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>
        <div>
          <label>Transport Flexibility *</label>
          <select value={form.transportFlexibility} onChange={(e) => setForm({ ...form, transportFlexibility: e.target.value })}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="depends">Depends</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <button type="submit">Submit Profile</button>
        </div>
      </form>
    </div>
  );
};

export default WorkerProfilePage;
