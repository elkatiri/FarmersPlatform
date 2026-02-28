import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@farmworkers.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid login');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '460px', margin: '0 auto' }}>
      <h2>{t('admin.loginTitle')}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="grid">
        <div>
          <label>{t('admin.email')}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>{t('admin.password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">{t('admin.loginBtn')}</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
