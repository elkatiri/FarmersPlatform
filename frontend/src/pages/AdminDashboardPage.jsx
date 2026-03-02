import { useEffect, useMemo, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const { t, isRTL } = useLanguage();
  const alignClass = isRTL ? 'text-right' : 'text-left';
  const dir = isRTL ? 'rtl' : 'ltr';
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  const [requestsSearch, setRequestsSearch] = useState('');
  const [requestsStatusFilter, setRequestsStatusFilter] = useState('all');
  const [requestsSort, setRequestsSort] = useState({ field: 'createdAt', direction: 'desc' });
  const [requestsPage, setRequestsPage] = useState(1);
  const pageSize = 8;

  const headers = authHeaders(token);

  const fetchData = async () => {
    setError('');
    try {
      const [pendingWorkersRes, requestsRes, messagesRes] = await Promise.all([
        api.get('/workers/pending', headers),
        api.get('/requests', headers),
        api.get('/contact', headers),
      ]);
      setWorkers(pendingWorkersRes.data);
      setRequests(requestsRes.data);
      setMessages(messagesRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateWorkerStatus = async (id, status) => {
    await api.patch(`/workers/${id}/status`, { status }, headers);
    fetchData();
  };

  const updateRequestStatus = async (id, status) => {
    await api.patch(`/requests/${id}/status`, { status }, headers);
    fetchData();
  };

  const downloadExport = async (format, type) => {
    const response = await api.get(`/export/${format}/${type}`, { ...headers, responseType: 'blob' });
    const ext = format === 'csv' ? 'csv' : 'xlsx';
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const stats = [
    { label: t('admin.pendingTitle'), value: workers.length, color: 'emerald' },
    { label: t('admin.requestsTitle'), value: requests.length, color: 'sky' },
    { label: t('admin.messagesTitle'), value: messages.length, color: 'amber' },
  ];

  const colorMap = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-100 text-emerald-600' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600', icon: 'bg-sky-100 text-sky-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'bg-amber-100 text-amber-600' },
  };

  const filteredSortedRequests = useMemo(() => {
    let data = Array.isArray(requests) ? [...requests] : [];
    if (requestsSearch.trim()) {
      const q = requestsSearch.trim().toLowerCase();
      data = data.filter((r) =>
        [r.workType, r.location, r.userEmail, r.contactName].filter(Boolean).join(' ').toLowerCase().includes(q)
      );
    }
    if (requestsStatusFilter !== 'all') data = data.filter((r) => r.status === requestsStatusFilter);
    data.sort((a, b) => {
      const { field, direction } = requestsSort;
      const dir = direction === 'asc' ? 1 : -1;
      if (field === 'createdAt') return (new Date(a.createdAt || a.startDate || 0) - new Date(b.createdAt || b.startDate || 0)) * dir;
      const va = (a[field] ?? '').toString().toLowerCase();
      const vb = (b[field] ?? '').toString().toLowerCase();
      return va < vb ? -1 * dir : va > vb ? 1 * dir : 0;
    });
    return data;
  }, [requests, requestsSearch, requestsStatusFilter, requestsSort]);

  const totalPages = Math.max(1, Math.ceil(filteredSortedRequests.length / pageSize));
  const paginatedRequests = filteredSortedRequests.slice((requestsPage - 1) * pageSize, requestsPage * pageSize);

  const setSortField = (field) => {
    setRequestsSort((prev) => prev.field === field ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' });
  };

  const SortIcon = ({ field }) => {
    if (requestsSort.field !== field) return null;
    return <span className="text-[10px] text-emerald-600">{requestsSort.direction === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">{t('admin.navOverview')}</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{t('admin.dashboardTitle')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('admin.dashboardDesc')}</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('admin.refresh')}
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => {
          const c = colorMap[item.color];
          return (
            <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.icon}`}>
                  <span className="text-lg font-bold">{item.value}</span>
                </span>
              </div>
              <p className={`mt-3 text-3xl font-bold ${c.text}`}>{item.value}</p>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Exports — compact collapsible */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setExportOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{t('admin.exportTitle')}</p>
              <p className="text-[11px] text-gray-400">{t('admin.exportHint')}</p>
            </div>
          </div>
          <svg className={`h-4 w-4 text-gray-400 transition-transform ${exportOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none">
            <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {exportOpen && (
          <div className="border-t border-gray-100 px-5 py-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => downloadExport('csv', 'workers')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
                {t('admin.exportWorkersCSV')}
              </button>
              <button onClick={() => downloadExport('excel', 'workers')} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100">
                {t('admin.exportWorkersExcel')}
              </button>
              <button onClick={() => downloadExport('csv', 'requests')} className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-800">
                {t('admin.exportRequestsCSV')}
              </button>
              <button onClick={() => downloadExport('excel', 'requests')} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                {t('admin.exportRequestsExcel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pending workers */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t('admin.sectionWorkers')}</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900">{t('admin.pendingTitle')}</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200" dir={dir}>
          <table className="min-w-full text-sm">
            <thead className={`bg-gray-50 ${alignClass} text-xs font-semibold uppercase tracking-wide text-gray-500`}>
              <tr>
                <th className="px-4 py-3">{t('admin.thName')}</th>
                <th className="px-4 py-3">{t('admin.thPhone')}</th>
                <th className="px-4 py-3">{t('admin.thRegions')}</th>
                <th className="px-4 py-3">{t('admin.thSkills')}</th>
                <th className="px-4 py-3">{t('admin.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {workers.length === 0 ? (
                <tr><td className="px-4 py-4 text-gray-400" colSpan="5">{t('admin.noPending')}</td></tr>
              ) : (
                workers.map((w) => (
                  <tr key={w._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{w.fullName || w.name}</td>
                    <td className="px-4 py-3 text-gray-600">{w.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{w.regions.join(', ')}</td>
                    <td className="px-4 py-3 text-gray-600">{w.skills.join(', ')}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => updateWorkerStatus(w._id, 'approuve')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700">
                          {t('admin.approve')}
                        </button>
                        <button onClick={() => updateWorkerStatus(w._id, 'rejete')} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                          {t('admin.reject')}
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

      {/* Requests (interactive) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t('admin.sectionRequests')}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{t('admin.requestsTitle')}</h2>
            <p className="mt-1 text-xs text-gray-500">{t('admin.requestsHelper')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="search"
              value={requestsSearch}
              onChange={(e) => { setRequestsSearch(e.target.value); setRequestsPage(1); }}
              placeholder={t('admin.searchRequests')}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none sm:w-56"
            />
            <select
              value={requestsStatusFilter}
              onChange={(e) => { setRequestsStatusFilter(e.target.value); setRequestsPage(1); }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">{t('admin.filterAll')}</option>
              <option value="nouveau">{t('admin.statusNew')}</option>
              <option value="en_cours">{t('admin.statusInProgress')}</option>
              <option value="apparie">{t('admin.statusMatched')}</option>
              <option value="clos">{t('admin.statusClosed')}</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200" dir={dir}>
          <table className="min-w-full text-sm">
            <thead className={`bg-gray-50 ${alignClass} text-xs font-semibold uppercase tracking-wide text-gray-500`}>
              <tr>
                <th className="px-4 py-3">
                  <button type="button" onClick={() => setSortField('workType')} className="inline-flex items-center gap-1 hover:text-gray-800">
                    {t('admin.thWork')} <SortIcon field="workType" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button type="button" onClick={() => setSortField('location')} className="inline-flex items-center gap-1 hover:text-gray-800">
                    {t('admin.thLocation')} <SortIcon field="location" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button type="button" onClick={() => setSortField('workersNeeded')} className="inline-flex items-center gap-1 hover:text-gray-800">
                    {t('admin.thWorkers')} <SortIcon field="workersNeeded" />
                  </button>
                </th>
                <th className="px-4 py-3">{t('admin.thDates')}</th>
                <th className="px-4 py-3">{t('admin.thUser')}</th>
                <th className="px-4 py-3">{t('admin.thStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRequests.length === 0 ? (
                <tr><td className="px-4 py-4 text-gray-400" colSpan="6">{t('admin.noRequests')}</td></tr>
              ) : (
                paginatedRequests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.workType}</td>
                    <td className="px-4 py-3 text-gray-600">{r.location}</td>
                    <td className="px-4 py-3 text-gray-600">{r.workersNeeded}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(r.startDate).toLocaleDateString()} – {new Date(r.endDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{r.userEmail || r.contactName || '-'}</td>
                    <td className="px-4 py-3">
                      <select
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-emerald-500 focus:outline-none"
                        value={r.status}
                        onChange={(e) => updateRequestStatus(r._id, e.target.value)}
                      >
                        <option value="nouveau">{t('admin.statusNew')}</option>
                        <option value="en_cours">{t('admin.statusInProgress')}</option>
                        <option value="apparie">{t('admin.statusMatched')}</option>
                        <option value="clos">{t('admin.statusClosed')}</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
          <p>{t('admin.paginationLabel')} {paginatedRequests.length} / {filteredSortedRequests.length} {t('admin.requestsTitle')}</p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={requestsPage === 1} onClick={() => setRequestsPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50">
              {t('admin.prev')}
            </button>
            <span className="text-[11px] text-gray-400">{t('admin.page')} {requestsPage} / {totalPages}</span>
            <button type="button" disabled={requestsPage === totalPages} onClick={() => setRequestsPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 disabled:opacity-40 hover:bg-gray-50">
              {t('admin.next')}
            </button>
          </div>
        </div>
      </section>


    </section>
  );
};

export default AdminDashboardPage;
