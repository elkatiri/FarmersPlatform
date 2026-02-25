import { useEffect, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { token } = useAuth();
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
      setError(err.response?.data?.message || 'Failed to load admin data');
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
      <h2>Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Export Data</h3>
        <div className="grid grid-2">
          <button onClick={() => downloadExport('csv', 'workers')}>Export Workers CSV</button>
          <button onClick={() => downloadExport('excel', 'workers')}>Export Workers Excel</button>
          <button onClick={() => downloadExport('csv', 'requests')}>Export Requests CSV</button>
          <button onClick={() => downloadExport('excel', 'requests')}>Export Requests Excel</button>
        </div>
      </div>

      <div className="card table-wrap">
        <h3>Pending Worker Profiles</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Regions</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 ? (
              <tr>
                <td colSpan="5">No pending workers.</td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr key={worker._id}>
                  <td>{worker.name}</td>
                  <td>{worker.phone}</td>
                  <td>{worker.regions.join(', ')}</td>
                  <td>{worker.skills.join(', ')}</td>
                  <td style={{ display: 'flex', gap: '0.4rem' }}>
                    <button onClick={() => updateWorkerStatus(worker._id, 'approved')}>Approve</button>
                    <button className="secondary" onClick={() => updateWorkerStatus(worker._id, 'rejected')}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card table-wrap">
        <h3>Farmer Requests</h3>
        <table>
          <thead>
            <tr>
              <th>Work</th>
              <th>Location</th>
              <th>Workers</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5">No requests found.</td>
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
                      <option value="new">new</option>
                      <option value="matched">matched</option>
                      <option value="closed">closed</option>
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
