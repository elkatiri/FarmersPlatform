import { useEffect, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  const headers = authHeaders(token);

  const fetchData = async () => {
    setError('');
    try {
      const [pendingWorkersRes, requestsRes] = await Promise.all([
        api.get('/workers/pending', headers),
        api.get('/requests', headers),
      ]);
      setWorkers(pendingWorkersRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateWorkerStatus = async (id, status) => {
    await api.patch(`/workers/${id}/status`, { status }, headers);
    fetchData();
  };

  const updateRequestStatus = async (id, status) => {
    await api.patch(`/requests/${id}/status`, { status }, headers);
    fetchData();
  };

  const downloadExport = async (format, type) => {
    const response = await api.get(`/export/${format}/${type}`, {
      ...headers,
      responseType: 'blob',
    });

    const ext = format === 'csv' ? 'csv' : 'xlsx';
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <section className="space-y-6">
        <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Admin</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('admin.dashboardTitle')}</h1>
              <p className="mt-2 text-sm text-slate-600">{t('admin.exportTitle')} · {t('admin.pendingTitle')} · {t('admin.requestsTitle')}</p>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Exports</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{t('admin.exportTitle')}</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => downloadExport('csv', 'workers')}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {t('admin.exportWorkersCSV')}
            </button>
            <button
              onClick={() => downloadExport('excel', 'workers')}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              {t('admin.exportWorkersExcel')}
            </button>
            <button
              onClick={() => downloadExport('csv', 'requests')}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t('admin.exportRequestsCSV')}
            </button>
            <button
              onClick={() => downloadExport('excel', 'requests')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              {t('admin.exportRequestsExcel')}
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Workers</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{t('admin.pendingTitle')}</h2>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                <tr>
                  <th className="px-4 py-3">{t('admin.thName')}</th>
                  <th className="px-4 py-3">{t('admin.thPhone')}</th>
                  <th className="px-4 py-3">{t('admin.thRegions')}</th>
                  <th className="px-4 py-3">{t('admin.thSkills')}</th>
                  <th className="px-4 py-3">{t('admin.thActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {workers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-600" colSpan="5">{t('admin.noPending')}</td>
                  </tr>
                ) : (
                  workers.map((worker) => (
                    <tr key={worker._id} className="bg-white">
                      <td className="px-4 py-3 font-semibold text-slate-900">{worker.fullName || worker.name}</td>
                      <td className="px-4 py-3 text-slate-700">{worker.phone}</td>
                      <td className="px-4 py-3 text-slate-700">{worker.regions.join(', ')}</td>
                      <td className="px-4 py-3 text-slate-700">{worker.skills.join(', ')}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => updateWorkerStatus(worker._id, 'approved')}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                          >
                            {t('admin.approve')}
                          </button>
                          <button
                            onClick={() => updateWorkerStatus(worker._id, 'rejected')}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                          >
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

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Requests</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{t('admin.requestsTitle')}</h2>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                <tr>
                  <th className="px-4 py-3">{t('admin.thWork')}</th>
                  <th className="px-4 py-3">{t('admin.thLocation')}</th>
                  <th className="px-4 py-3">{t('admin.thWorkers')}</th>
                  <th className="px-4 py-3">{t('admin.thDates')}</th>
                  <th className="px-4 py-3">{t('admin.thUser')}</th>
                  <th className="px-4 py-3">{t('admin.thStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {requests.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-600" colSpan="6">{t('admin.noRequests')}</td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id} className="bg-white">
                      <td className="px-4 py-3 font-semibold text-slate-900">{request.workType}</td>
                      <td className="px-4 py-3 text-slate-700">{request.location}</td>
                      <td className="px-4 py-3 text-slate-700">{request.workersNeeded}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {request.userEmail || request.contactName || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
                          value={request.status}
                          onChange={(e) => updateRequestStatus(request._id, e.target.value)}
                        >
                          <option value="new">{t('admin.statusNew')}</option>
                          <option value="in_progress">{t('admin.statusInProgress')}</option>
                          <option value="matched">{t('admin.statusMatched')}</option>
                          <option value="closed">{t('admin.statusClosed')}</option>
                        </select>
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

export default AdminDashboardPage;
