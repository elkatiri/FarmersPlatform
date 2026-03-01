import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { promptAuthRequired } from '../utils/authPrompt';
import { useLanguage } from '../context/LanguageContext';
import { FaWhatsapp } from 'react-icons/fa';

const ContactPage = () => {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();
  const { t } = useLanguage();
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
      setError(t('contact.errRequired'));
      return;
    }

    try {
      await api.post('/contact', form);
      setSuccess(t('contact.successMsg'));
      setForm({ name: '', email: '', message: '', requestCall: false });
    } catch (err) {
      setError(err.response?.data?.message || t('contact.errSend'));
    }
  };

  const whatsappUrl = 'https://wa.me/919999000000?text=Hi%2C%20I%20need%20support%20from%20Farmers%20%26%20Workers%20Platform';

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{t('contact.label')}</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('contact.title')}</h1>
          <p className="max-w-2xl text-sm text-slate-600">{t('contact.desc')}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          {t('contact.responseTime')}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{t('contact.whatsappTitle')}</h3>
          <p className="mt-2 text-sm text-slate-600">{t('contact.whatsappDesc')}</p>
          <div className="mt-4 flex flex-col gap-3">
            {isUserAuthenticated ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <FaWhatsapp className="text-white" />
                {t('contact.openWhatsApp')}
              </a>
            ) : (
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                onClick={() => promptAuthRequired(navigate, t)}
              >
                <FaWhatsapp className="text-emerald-600" />
                {t('contact.loginForWhatsApp')}
              </button>
            )}
            <div className="rounded-xl border border-slate-100 bg-white px-3 py-3 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">{t('contact.hours')}</p>
              <p>{t('contact.hoursValue')}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{t('contact.formTitle')}</h3>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t('contact.formLabel')}</span>
          </div>
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
          <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t('contact.name')}</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t('contact.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t('contact.message')}</label>
              <textarea
                rows="4"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <input
                type="checkbox"
                checked={form.requestCall}
                onChange={(e) => setForm({ ...form, requestCall: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label className="text-sm font-semibold text-slate-700">{t('contact.requestCall')}</label>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {t('contact.send')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
