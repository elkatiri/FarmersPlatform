import { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const initialState = {
  fullName: '',
  phone: '',
  whatsapp: '',
  location: '',
  regions: '',
  skills: '',
  experienceLevel: 'beginner',
  availability: 'immediate',
  availabilityStart: '',
  availabilityEnd: '',
  travelFlexible: true,
  transportFlexibility: 'yes',
  notes: '',
};

const WorkerProfilePage = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName || !form.phone || !form.whatsapp || !form.location || !form.regions || !form.skills) {
      setError(t('workerProfile.errRequired'));
      return;
    }

    try {
      await api.post('/workers', {
        ...form,
        regions: form.regions.split(',').map((item) => item.trim()).filter(Boolean),
        skills: form.skills.split(',').map((item) => item.trim()).filter(Boolean),
        availabilityStart: form.availabilityStart || undefined,
        availabilityEnd: form.availabilityEnd || undefined,
      });
      setSuccess(t('workerProfile.successMsg'));
      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || t('workerProfile.errSubmit'));
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{t('workerProfile.label')}</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('workerProfile.title')}</h1>
          <p className="max-w-2xl text-sm text-slate-600">{t('workerProfile.desc')}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          {t('workerProfile.statusLabel')} : <strong>pending</strong>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.fullName')}</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.phone')}</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+212..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.whatsapp')}</label>
            <input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="+212..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.location')}</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder={t('workerProfile.locationPlaceholder')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.regions')}</label>
            <input
              value={form.regions}
              onChange={(e) => setForm({ ...form, regions: e.target.value })}
              placeholder={t('workerProfile.regionsPlaceholder')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.skills')}</label>
            <input
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder={t('workerProfile.skillsPlaceholder')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.experienceLevel')}</label>
            <select
              value={form.experienceLevel}
              onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="beginner">{t('workerProfile.beginner')}</option>
              <option value="intermediate">{t('workerProfile.intermediate')}</option>
              <option value="expert">{t('workerProfile.expert')}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.availability')}</label>
            <select
              value={form.availability}
              onChange={(e) => setForm({ ...form, availability: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="immediate">{t('workerProfile.immediate')}</option>
              <option value="within_week">{t('workerProfile.withinWeek')}</option>
              <option value="seasonal">{t('workerProfile.seasonal')}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.availabilityStart')}</label>
            <input
              type="date"
              value={form.availabilityStart}
              onChange={(e) => setForm({ ...form, availabilityStart: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.availabilityEnd')}</label>
            <input
              type="date"
              value={form.availabilityEnd}
              onChange={(e) => setForm({ ...form, availabilityEnd: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.transportFlexibility')}</label>
            <select
              value={form.transportFlexibility}
              onChange={(e) => setForm({ ...form, transportFlexibility: e.target.value, travelFlexible: e.target.value !== 'no' })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="yes">{t('workerProfile.yes')}</option>
              <option value="no">{t('workerProfile.no')}</option>
              <option value="depends">{t('workerProfile.depends')}</option>
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">{t('workerProfile.notes')}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {t('workerProfile.submit')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default WorkerProfilePage;
