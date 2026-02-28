import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError(t('login.errRequired'));
      return;
    }

    const result = loginUser(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/request-worker');
  };

  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{t('login.label')}</p>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('login.title')}</h1>
              <p className="mt-2 text-sm text-slate-600">{t('login.desc')}</p>
            </div>
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">{t('login.secure')}</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('login.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={t('login.emailPlaceholder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('login.password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {t('login.submit')}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/register"
              className="inline-flex w-full items-center justify-center rounded-xl border-2 border-amber-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-amber-50"
            >
              {t('login.createAccount')}
            </Link>

            <p className="text-center text-sm text-slate-600">
              {t('login.adminHint')}{' '}
              <Link to="/admin/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                {t('login.adminLink')}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-3xl border border-slate-100 bg-white/70 p-6 shadow-sm backdrop-blur lg:p-8">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p className="font-semibold text-emerald-900">{t('login.benefit1Title')}</p>
            <p>{t('login.benefit1Desc')}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">{t('login.benefit2Title')}</p>
            <p>{t('login.benefit2Desc')}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold text-amber-900">{t('login.benefit3Title')}</p>
            <p>{t('login.benefit3Desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
