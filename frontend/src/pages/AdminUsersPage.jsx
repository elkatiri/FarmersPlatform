import { useEffect, useMemo, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const statusStyles = {
  approuve: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  en_attente: 'bg-amber-50 text-amber-800 border-amber-100',
  rejete: 'bg-slate-100 text-slate-700 border-slate-200',
  supprime: 'bg-red-50 text-red-700 border-red-100',
};

const normalizeCsvList = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const AdminUsersPage = () => {
  const { token } = useAuth();
  const { t, isRTL } = useLanguage();
  const alignClass = isRTL ? 'text-right' : 'text-left';
  const dir = isRTL ? 'rtl' : 'ltr';
  const headers = authHeaders(token);

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    location: '',
    regions: '',
    skills: '',
    status: 'en_attente',
    notes: '',
  });

  const selectedWorker = useMemo(
    () => workers.find((w) => w._id === selectedId) || null,
    [workers, selectedId]
  );

  const fetchWorkers = async () => {
    setLoading(true);
    setError('');
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        api.get('/workers', headers),
        api.get('/workers/pending', headers),
      ]);

      const approved = Array.isArray(approvedRes.data) ? approvedRes.data : [];
      const pending = Array.isArray(pendingRes.data) ? pendingRes.data : [];

      const mergedById = new Map();
      [...approved, ...pending].forEach((worker) => {
        if (worker && worker._id) {
          mergedById.set(worker._id, worker);
        }
      });

      setWorkers(Array.from(mergedById.values()));
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchWorkers();
  }, [token]);

  const startEdit = (worker) => {
    setSelectedId(worker._id);
    setForm({
      fullName: worker.fullName || '',
      phone: worker.phone || '',
      whatsapp: worker.whatsapp || '',
      location: worker.location || '',
      regions: Array.isArray(worker.regions) ? worker.regions.join(', ') : '',
      skills: Array.isArray(worker.skills) ? worker.skills.join(', ') : '',
      status: worker.status || 'en_attente',
      notes: worker.notes || '',
    });
  };

  const cancelEdit = () => {
    setSelectedId('');
    setForm({
      fullName: '',
      phone: '',
      whatsapp: '',
      location: '',
      regions: '',
      skills: '',
      status: 'en_attente',
      notes: '',
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!selectedId) return;

    setError('');
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        whatsapp: form.whatsapp,
        location: form.location,
        regions: normalizeCsvList(form.regions),
        skills: normalizeCsvList(form.skills),
        status: form.status,
        notes: form.notes,
      };

      await api.patch(`/workers/${selectedId}`, payload, headers);
      await fetchWorkers();
      cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  const updateStatusQuick = async (workerId, status) => {
    setError('');
    try {
      await api.patch(`/workers/${workerId}/status`, { status }, headers);
      await fetchWorkers();
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  const deleteWorker = async (workerId) => {
    const ok = window.confirm(t('admin.confirmDeleteUser'));
    if (!ok) return;

    setError('');
    try {
      await api.delete(`/workers/${workerId}`, headers);
      await fetchWorkers();
      if (selectedId === workerId) cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  const getStatusLabel = (status) => {
    const keyMap = {
      en_attente: 'statusPending',
      approuve: 'statusApproved',
      rejete: 'statusRejected',
      supprime: 'statusDeleted',
    };
    const key = keyMap[status] || null;
    return key ? t(`admin.${key}`) : status;
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">{t('admin.navUsers')}</p>
        <h1 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">{t('admin.usersTitle')}</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">{t('admin.usersDesc')}</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {selectedWorker && (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t('admin.editUser')}</p>
              <h2 className="mt-1 text-base sm:text-lg font-bold text-gray-900">{selectedWorker.fullName}</h2>
            </div>
            <button onClick={cancelEdit} className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              {t('admin.cancel')}
            </button>
          </div>

          <form onSubmit={saveEdit} className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.fullName')}</label>
              <input value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.status')}</label>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none">
                <option value="en_attente">{t('admin.statusPending')}</option>
                <option value="approuve">{t('admin.statusApproved')}</option>
                <option value="rejete">{t('admin.statusRejected')}</option>
                <option value="supprime">{t('admin.statusDeleted')}</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.phone')}</label>
              <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.whatsapp')}</label>
              <input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.location')}</label>
              <input value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.regions')}</label>
              <input value={form.regions} onChange={(e) => setForm((p) => ({ ...p, regions: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none" />
              <p className="mt-1 text-xs text-gray-400">{t('admin.csvHint')}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.skills')}</label>
              <input value={form.skills} onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none" />
              <p className="mt-1 text-xs text-gray-400">{t('admin.csvHint')}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.notes')}</label>
              <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                {t('admin.save')}
              </button>
              <button type="button" onClick={() => deleteWorker(selectedId)}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100">
                {t('admin.delete')}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t('admin.usersTableLabel')}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{t('admin.usersTableTitle')}</h2>
          </div>
          <button onClick={fetchWorkers} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            {t('admin.refresh')}
          </button>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {loading ? (
            <p className="py-4 text-sm text-gray-400">{t('admin.loading')}</p>
          ) : workers.length === 0 ? (
            <p className="py-4 text-sm text-gray-400">{t('admin.noUsers')}</p>
          ) : (
            workers.map((worker) => (
              <div key={worker._id} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{worker.fullName}</p>
                    {worker.location && (
                      <p className="mt-0.5 text-xs text-gray-500 flex items-center gap-1">
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {worker.location}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[worker.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {getStatusLabel(worker.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="block font-medium text-gray-400">{t('admin.thPhone')}</span>
                    <p className="text-gray-700 mt-0.5">{worker.phone}</p>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-400">{t('admin.whatsapp')}</span>
                    <p className="text-gray-700 mt-0.5">{worker.whatsapp || '-'}</p>
                  </div>
                  {worker.regions?.length > 0 && (
                    <div className="col-span-2">
                      <span className="block font-medium text-gray-400">{t('admin.thRegions')}</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(Array.isArray(worker.regions) ? worker.regions : []).map((r, i) => (
                          <span key={i} className="inline-block rounded-md bg-sky-50 border border-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-700">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {worker.skills?.length > 0 && (
                    <div className="col-span-2">
                      <span className="block font-medium text-gray-400">{t('admin.thSkills')}</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {(Array.isArray(worker.skills) ? worker.skills : []).map((s, i) => (
                          <span key={i} className="inline-block rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
                  <button onClick={() => startEdit(worker)} className="flex-1 min-w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 text-center transition hover:bg-gray-50">
                    {t('admin.edit')}
                  </button>
                  <select className="flex-1 min-w-25 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700 focus:border-emerald-500 focus:outline-none"
                    value={worker.status} onChange={(e) => updateStatusQuick(worker._id, e.target.value)}>
                    <option value="en_attente">{t('admin.statusPending')}</option>
                    <option value="approuve">{t('admin.statusApproved')}</option>
                    <option value="rejete">{t('admin.statusRejected')}</option>
                    <option value="supprime">{t('admin.statusDeleted')}</option>
                  </select>
                  <button onClick={() => deleteWorker(worker._id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="mt-4 hidden md:block overflow-x-auto rounded-xl border border-gray-200" dir={dir}>
          <table className="min-w-full text-sm">
            <thead className={`bg-gray-50 ${alignClass} text-xs font-semibold uppercase tracking-wide text-gray-500`}>
              <tr>
                <th className="px-4 py-3">{t('admin.thName')}</th>
                <th className="px-4 py-3">{t('admin.thPhone')}</th>
                <th className="px-4 py-3">{t('admin.thLocation')}</th>
                <th className="px-4 py-3">{t('admin.thStatus')}</th>
                <th className="px-4 py-3">{t('admin.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-4 py-4 text-gray-400" colSpan={5}>{t('admin.loading')}</td></tr>
              ) : workers.length === 0 ? (
                <tr><td className="px-4 py-4 text-gray-400" colSpan={5}>{t('admin.noUsers')}</td></tr>
              ) : (
                workers.map((worker) => (
                  <tr key={worker._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{worker.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{worker.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{worker.location}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[worker.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        {getStatusLabel(worker.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => startEdit(worker)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                          {t('admin.edit')}
                        </button>
                        <select className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-emerald-500 focus:outline-none"
                          value={worker.status} onChange={(e) => updateStatusQuick(worker._id, e.target.value)}>
                          <option value="en_attente">{t('admin.statusPending')}</option>
                          <option value="approuve">{t('admin.statusApproved')}</option>
                          <option value="rejete">{t('admin.statusRejected')}</option>
                          <option value="supprime">{t('admin.statusDeleted')}</option>
                        </select>
                        <button onClick={() => deleteWorker(worker._id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                          {t('admin.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default AdminUsersPage;
