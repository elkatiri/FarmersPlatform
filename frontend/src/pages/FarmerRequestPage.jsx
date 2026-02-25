import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { promptAuthRequired } from '../utils/authPrompt';

const initialState = {
  workType: '',
  location: '',
  startDate: '',
  endDate: '',
  workersNeeded: 1,
  transportInfo: '',
  housingProvided: false,
  mealsProvided: false,
  whatsapp: '',
  notes: '',
};

const FarmerRequestPage = () => {
  const navigate = useNavigate();
  const { isUserAuthenticated, currentUser } = useAuth();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestId, setRequestId] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);
  const hasShownAuthPromptRef = useRef(false);

  const historyKey = useMemo(() => {
    if (!currentUser?.email) return '';
    return `workerRequests_${currentUser.email.toLowerCase()}`;
  }, [currentUser?.email]);

  useEffect(() => {
    if (!isUserAuthenticated || !historyKey) {
      setRequestHistory([]);
      return;
    }
    const saved = JSON.parse(localStorage.getItem(historyKey) || '[]');
    setRequestHistory(saved);
  }, [historyKey, isUserAuthenticated]);

  useEffect(() => {
    if (!isUserAuthenticated && !hasShownAuthPromptRef.current) {
      hasShownAuthPromptRef.current = true;
      promptAuthRequired(navigate);
    }
  }, [isUserAuthenticated, navigate]);

  const validate = () => {
    if (!form.workType || !form.location || !form.startDate || !form.endDate || !form.transportInfo || !form.whatsapp) {
      return 'Veuillez remplir tous les champs obligatoires.';
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return 'La date de fin ne peut pas être avant la date de début.';
    }
    if (Number(form.workersNeeded) < 1) {
      return 'Le nombre de travailleurs doit être au minimum de 1.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const payload = { ...form };
      const { data } = await api.post('/requests', payload);
      setSuccess('Demande envoyée avec succès.');
      setRequestId(data.request?._id || '');
      setSubmittedData(payload);

      if (historyKey) {
        const newEntry = {
          id: data.request?._id || `local-${Date.now()}`,
          workType: payload.workType,
          location: payload.location,
          startDate: payload.startDate,
          endDate: payload.endDate,
          workersNeeded: payload.workersNeeded,
          status: data.request?.status || 'new',
          createdAt: data.request?.createdAt || new Date().toISOString(),
        };
        const updatedHistory = [newEntry, ...requestHistory];
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
        setRequestHistory(updatedHistory);
      }

      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de l’envoi de la demande.');
    }
  };

  const whatsappPayload = submittedData || form;
  const prefilledWhatsApp = encodeURIComponent(
    `Demande de travailleurs${requestId ? ` #${requestId}` : ''}\nTravail: ${whatsappPayload.workType || '-'}\nLieu: ${whatsappPayload.location || '-'}\nDates: ${whatsappPayload.startDate || '-'} à ${whatsappPayload.endDate || '-'}\nTravailleurs demandés: ${whatsappPayload.workersNeeded || '-'}\nTransport: ${whatsappPayload.transportInfo || '-'}\nLogement: ${whatsappPayload.housingProvided ? 'Oui' : 'Non'}\nRepas: ${whatsappPayload.mealsProvided ? 'Oui' : 'Non'}\nNotes: ${whatsappPayload.notes || '-'}\nContact: ${whatsappPayload.whatsapp || '-'}`
  );
  const whatsappUrl = `https://wa.me/${(whatsappPayload.whatsapp || '').replace(/[^\d]/g, '')}?text=${prefilledWhatsApp}`;

  if (!isUserAuthenticated) {
    return (
      <div className="card">
        <h2>Demande de travailleurs</h2>
        <p>
          Pour utiliser le service et créer une demande de travailleurs, vous devez d’abord créer un
          compte et vous connecter.
        </p>
        <div className="grid grid-2" style={{ marginTop: '1rem' }}>
          <button onClick={() => promptAuthRequired(navigate)}>Se connecter / Créer un compte</button>
          <button className="secondary" onClick={() => navigate('/directory')}>
            Parcourir les travailleurs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Créer une demande de travailleurs</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="grid grid-2">
        <div>
          <label>Type de travail *</label>
          <input value={form.workType} onChange={(e) => setForm({ ...form, workType: e.target.value })} placeholder="taille, récolte" />
        </div>
        <div>
          <label>Lieu *</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label>Date de début *</label>
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </div>
        <div>
          <label>Date de fin *</label>
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <div>
          <label>Nombre de travailleurs *</label>
          <input type="number" min="1" value={form.workersNeeded} onChange={(e) => setForm({ ...form, workersNeeded: Number(e.target.value) })} />
        </div>
        <div>
          <label>Informations transport *</label>
          <input value={form.transportInfo} onChange={(e) => setForm({ ...form, transportInfo: e.target.value })} />
        </div>
        <div>
          <label>Contact WhatsApp *</label>
          <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+91..." />
        </div>
        <div>
          <label>Notes (optionnel)</label>
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={form.housingProvided} onChange={(e) => setForm({ ...form, housingProvided: e.target.checked })} /> Logement fourni
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" checked={form.mealsProvided} onChange={(e) => setForm({ ...form, mealsProvided: e.target.checked })} /> Repas fournis
          </label>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit">Soumettre la demande</button>
        </div>
      </form>
      {success && (
        <a href={whatsappUrl} target="_blank" rel="noreferrer">
          <button style={{ marginTop: '0.75rem' }} className="secondary">Continuer sur WhatsApp</button>
        </a>
      )}

      <div style={{ marginTop: '1rem' }}>
        <h3>Historique de mes demandes</h3>
        {requestHistory.length === 0 ? (
          <p>Aucune demande enregistrée pour le moment.</p>
        ) : (
          <div className="table-wrap" style={{ marginTop: '0.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Travail</th>
                  <th>Lieu</th>
                  <th>Dates</th>
                  <th>Travailleurs</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {requestHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.workType}</td>
                    <td>{item.location}</td>
                    <td>
                      {new Date(item.startDate).toLocaleDateString()} -{' '}
                      {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td>{item.workersNeeded}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerRequestPage;
