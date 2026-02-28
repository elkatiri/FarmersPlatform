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
    <div>
      <h2>{t('admin.dashboardTitle')}</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>{t('admin.exportTitle')}</h3>
        <div className="grid grid-2">
          <button onClick={() => downloadExport('csv', 'workers')}>{t('admin.exportWorkersCSV')}</button>
          <button onClick={() => downloadExport('excel', 'workers')}>{t('admin.exportWorkersExcel')}</button>
          <button onClick={() => downloadExport('csv', 'requests')}>{t('admin.exportRequestsCSV')}</button>
          <button onClick={() => downloadExport('excel', 'requests')}>{t('admin.exportRequestsExcel')}</button>
        </div>
      </div>

      <div className="card table-wrap">
        <h3>{t('admin.pendingTitle')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('admin.thName')}</th>
              <th>{t('admin.thPhone')}</th>
              <th>{t('admin.thRegions')}</th>
              <th>{t('admin.thSkills')}</th>
              <th>{t('admin.thActions')}</th>
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 ? (
              <tr>
                <td colSpan="5">{t('admin.noPending')}</td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr key={worker._id}>
                  <td>{worker.fullName || worker.name}</td>
                  <td>{worker.phone}</td>
                  <td>{worker.regions.join(', ')}</td>
                  <td>{worker.skills.join(', ')}</td>
                  <td style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => updateWorkerStatus(worker._id, 'approved')}>{t('admin.approve')}</button>
                    <button className="secondary" onClick={() => updateWorkerStatus(worker._id, 'rejected')}>
                      {t('admin.reject')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card table-wrap">
        <h3>{t('admin.requestsTitle')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('admin.thWork')}</th>
              <th>{t('admin.thLocation')}</th>
              <th>{t('admin.thWorkers')}</th>
              <th>{t('admin.thDates')}</th>
              <th>{t('admin.thStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5">{t('admin.noRequests')}</td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.workType}</td>
                  <td>{request.location}</td>
                  <td>{request.workersNeeded}</td>
                  <td>
                    {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                  </td>
                  <td>
                    <select
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
    </div>
  );
};

export default AdminDashboardPage;
