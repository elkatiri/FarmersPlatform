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
    <section className="min-h-[80vh] bg-linear-to-br from-emerald-50 via-white to-amber-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Admin</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">{t('admin.loginTitle')}</h1>
          <p className="mt-2 text-sm text-slate-600">{t('admin.dashboardTitle')}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {t('admin.loginBtn')}
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur lg:p-8">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p className="font-semibold text-emerald-900">{t('admin.exportTitle')}</p>
            <p>{t('admin.exportWorkersCSV')} · {t('admin.exportRequestsCSV')}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{t('admin.pendingTitle')}</p>
            <p>{t('admin.approve')} / {t('admin.reject')}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold text-amber-900">{t('admin.requestsTitle')}</p>
            <p>{t('admin.thStatus')} · {t('admin.statusInProgress')} · {t('admin.statusMatched')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLoginPage;
