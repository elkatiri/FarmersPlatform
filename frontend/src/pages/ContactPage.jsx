import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { promptAuthRequired } from '../utils/authPrompt';

const ContactPage = () => {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    requestCall: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.message) {
      setError('Le nom, l’email et le message sont obligatoires.');
      return;
    }

    try {
      await api.post('/contact', form);
      setSuccess('Message envoyé avec succès.');
      setForm({ name: '', email: '', message: '', requestCall: false });
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de l’envoi du message.');
    }
  };

  const whatsappUrl = 'https://wa.me/919999000000?text=Hi%2C%20I%20need%20support%20from%20Farmers%20%26%20Workers%20Platform';

  return (
    <div className="card">
      <h2>Contact</h2>
      {isUserAuthenticated ? (
        <a href={whatsappUrl} target="_blank" rel="noreferrer">
          <button className="secondary">Contacter sur WhatsApp</button>
        </a>
      ) : (
        <button className="secondary" onClick={() => promptAuthRequired(navigate)}>
          Se connecter pour contacter sur WhatsApp
        </button>
      )}

      <form onSubmit={handleSubmit} className="grid" style={{ marginTop: '1rem' }}>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div>
          <label>Nom</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label>Message</label>
          <textarea rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={form.requestCall}
              onChange={(e) => setForm({ ...form, requestCall: e.target.checked })}
            />
            Demander un appel
          </label>
        </div>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default ContactPage;
