import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      setError(t('register.errRequired'));
      return;
    }

    if (form.password.length < 6) {
      setError(t('register.errPasswordLength'));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError(t('register.errPasswordMatch'));
      return;
    }

    const result = registerUser({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSuccess(t('register.successMsg'));
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-[#166534]">{t('register.title')}</h1>
      <p className="mt-2 text-sm text-gray-600">
        {t('register.desc')}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {error ? <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="sm:col-span-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p> : null}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('register.firstName')}</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('register.lastName')}</label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('register.email')}</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('register.phone')}</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('register.password')}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('register.confirmPassword')}</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#16a34a] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-[#16a34a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803d]"
          >
            {t('register.submit')}
          </button>
        </div>
      </form>

      <div className="mt-5">
        <Link
          to="/login"
          className="inline-flex w-full items-center justify-center rounded-xl border-2 border-[#facc15] px-5 py-3 text-sm font-semibold text-[#166534] transition hover:bg-[#fef9c3]"
        >
          {t('register.hasAccount')}
        </Link>
      </div>
    </section>
  );
};

export default RegisterPage;
