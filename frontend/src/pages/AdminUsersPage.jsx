import { useEffect, useMemo, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const statusStyles = {
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-100',
  pending: 'bg-amber-50 text-amber-800 border-amber-100',
  rejected: 'bg-slate-100 text-slate-700 border-slate-200',
  deleted: 'bg-red-50 text-red-700 border-red-100',
};

const normalizeCsvList = (value) =>
  String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const AdminUsersPage = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
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
    status: 'pending',
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
      status: worker.status || 'pending',
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
      status: 'pending',
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
      pending: 'statusPending',
      approved: 'statusApproved',
      rejected: 'statusRejected',
      deleted: 'statusDeleted',
    };
    const key = keyMap[status] || null;
    return key ? t(`admin.${key}`) : status;
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('admin.usersTitle')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('admin.usersDesc')}</p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {selectedWorker ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t('admin.editUser')}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{selectedWorker.fullName}</h2>
            </div>
            <button
              onClick={cancelEdit}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              {t('admin.cancel')}
            </button>
          </div>

          <form onSubmit={saveEdit} className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.fullName')}</label>
              <input
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.status')}</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="pending">{t('admin.statusPending')}</option>
                <option value="approved">{t('admin.statusApproved')}</option>
                <option value="rejected">{t('admin.statusRejected')}</option>
                <option value="deleted">{t('admin.statusDeleted')}</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.phone')}</label>
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.whatsapp')}</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.location')}</label>
              <input
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.regions')}</label>
              <input
                value={form.regions}
                onChange={(e) => setForm((p) => ({ ...p, regions: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">{t('admin.csvHint')}</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.skills')}</label>
              <input
                value={form.skills}
                onChange={(e) => setForm((p) => ({ ...p, skills: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">{t('admin.csvHint')}</p>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.notes')}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {t('admin.save')}
              </button>
              <button
                type="button"
                onClick={() => deleteWorker(selectedId)}
                className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                {t('admin.delete')}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t('admin.usersTableLabel')}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{t('admin.usersTableTitle')}</h2>
          </div>
          <button
            onClick={fetchWorkers}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            {t('admin.refresh')}
          </button>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
              <tr>
                <th className="px-4 py-3">{t('admin.thName')}</th>
                <th className="px-4 py-3">{t('admin.thPhone')}</th>
                <th className="px-4 py-3">{t('admin.thLocation')}</th>
                <th className="px-4 py-3">{t('admin.thStatus')}</th>
                <th className="px-4 py-3">{t('admin.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={5}>
                    {t('admin.loading')}
                  </td>
                </tr>
              ) : workers.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={5}>
                    {t('admin.noUsers')}
                  </td>
                </tr>
              ) : (
                workers.map((worker) => (
                  <tr key={worker._id} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-slate-900">{worker.fullName}</td>
                    <td className="px-4 py-3 text-slate-700">{worker.phone}</td>
                    <td className="px-4 py-3 text-slate-700">{worker.location}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          statusStyles[worker.status] || 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {getStatusLabel(worker.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => startEdit(worker)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                        >
                          {t('admin.edit')}
                        </button>

                        <select
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none"
                          value={worker.status}
                          onChange={(e) => updateStatusQuick(worker._id, e.target.value)}
                        >
                          <option value="pending">{t('admin.statusPending')}</option>
                          <option value="approved">{t('admin.statusApproved')}</option>
                          <option value="rejected">{t('admin.statusRejected')}</option>
                          <option value="deleted">{t('admin.statusDeleted')}</option>
                        </select>

                        <button
                          onClick={() => deleteWorker(worker._id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
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
