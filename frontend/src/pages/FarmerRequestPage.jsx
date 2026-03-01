import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { promptAuthRequired } from '../utils/authPrompt';

const initialState = {
  workType: '',
  location: '',
  startDate: '',
  endDate: '',
  workersNeeded: 1,
  transportResponsibility: 'farmer',
  transportInfo: '',
  housingProvided: false,
  mealsProvided: false,
  contactName: '',
  phone: '',
  whatsapp: '',
  notes: '',
};

const phoneRegex = /^\+?[0-9]{8,15}$/;

const FarmerRequestPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isUserAuthenticated, currentUser } = useAuth();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestId, setRequestId] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [requestHistory, setRequestHistory] = useState([]);
  const [authPromptShown, setAuthPromptShown] = useState(false);

  useEffect(() => {
    if (!isUserAuthenticated && !authPromptShown) {
      setAuthPromptShown(true);
      promptAuthRequired(navigate, t);
    }
  }, [isUserAuthenticated, authPromptShown, navigate, t]);

  useEffect(() => {
    const syncContactFromUser = () => {
      if (!currentUser) return;
      setForm((prev) => ({
        ...prev,
        contactName:
          prev.contactName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || prev.contactName,
        phone: prev.phone || currentUser.phone || prev.phone,
        whatsapp: prev.whatsapp || currentUser.phone || prev.whatsapp,
      }));
    };

    syncContactFromUser();
  }, [currentUser]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (!currentUser?.email) {
          setRequestHistory([]);
          return;
        }

        const { data } = await api.get('/requests/mine', {
          params: { email: currentUser.email },
        });

        const normalized = (Array.isArray(data) ? data : []).map((item) => ({
          id: item._id,
          workType: item.workType,
          location: item.location,
          startDate: item.startDate,
          endDate: item.endDate,
          workersNeeded: item.workersNeeded,
          status: item.status,
          createdAt: item.createdAt,
        }));

        setRequestHistory(normalized);
      } catch {
        setRequestHistory([]);
      }
    };
    loadHistory();
  }, [currentUser]);

  const validate = () => {
    if (!form.workType || !form.location || !form.startDate || !form.endDate || !form.contactName) {
      return t('farmerRequest.errRequired');
    }
    if (!phoneRegex.test(form.phone) || !phoneRegex.test(form.whatsapp)) {
      return t('farmerRequest.errPhone');
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return t('farmerRequest.errDate');
    }
    if (Number(form.workersNeeded) < 1) {
      return t('farmerRequest.errWorkers');
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isUserAuthenticated) {
      await promptAuthRequired(navigate, t);
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const payload = {
        ...form,
        userEmail: currentUser?.email || undefined,
        userName:
          `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || form.contactName || undefined,
      };
      const { data } = await api.post('/requests', payload);
      setSuccess(t('farmerRequest.successMsg'));
      setRequestId(data.request?._id || '');
      setSubmittedData(payload);
      // Refresh history from backend so status tracking stays up to date
      if (currentUser?.email) {
        try {
          const historyRes = await api.get('/requests/mine', {
            params: { email: currentUser.email },
          });
          const normalized = (Array.isArray(historyRes.data) ? historyRes.data : []).map((item) => ({
            id: item._id,
            workType: item.workType,
            location: item.location,
            startDate: item.startDate,
            endDate: item.endDate,
            workersNeeded: item.workersNeeded,
            status: item.status,
            createdAt: item.createdAt,
          }));
          setRequestHistory(normalized);
        } catch {
          // ignore, keep existing history state
        }
      }

      setForm(initialState);
    } catch (err) {
      setError(err.response?.data?.message || t('farmerRequest.errSubmit'));
    }
  };

  const whatsappPayload = submittedData || form;
  const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || whatsappPayload.whatsapp;
  const prefilledWhatsApp = encodeURIComponent(
    `${t('farmerRequest.waTitle')}${requestId ? ` #${requestId}` : ''}` +
      `\n${t('farmerRequest.waWork')}: ${whatsappPayload.workType || '-'}` +
      `\n${t('farmerRequest.waLocation')}: ${whatsappPayload.location || '-'}` +
      `\n${t('farmerRequest.waDates')}: ${whatsappPayload.startDate || '-'} ${t('farmerRequest.waTo')} ${whatsappPayload.endDate || '-'}` +
      `\n${t('farmerRequest.waWorkersNeeded')}: ${whatsappPayload.workersNeeded || '-'}` +
      `\n${t('farmerRequest.waTransport')}: ${whatsappPayload.transportResponsibility || '-'}` +
      `\n${t('farmerRequest.waHousing')}: ${whatsappPayload.housingProvided ? t('farmerRequest.waYes') : t('farmerRequest.waNo')}` +
      `\n${t('farmerRequest.waMeals')}: ${whatsappPayload.mealsProvided ? t('farmerRequest.waYes') : t('farmerRequest.waNo')}` +
      `\n${t('farmerRequest.waContact')}: ${whatsappPayload.contactName || '-'} (${whatsappPayload.whatsapp || '-'})`
  );
  const whatsappUrl = `https://wa.me/${(adminWhatsApp || '').replace(/[^\d]/g, '')}?text=${prefilledWhatsApp}`;

  const handleWhatsAppContinue = () => {
    if (!whatsappUrl) return;
    window.open(whatsappUrl, '_blank');
  };

  const getRequestStatusLabel = (status) => {
    const keyMap = {
      new: 'statusNew',
      in_progress: 'statusInProgress',
      matched: 'statusMatched',
      closed: 'statusClosed',
    };
    const key = keyMap[status] || null;
    return key ? t(`admin.${key}`) : status;
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{t('farmerRequest.label')}</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('farmerRequest.title')}</h1>
          <p className="max-w-2xl text-sm text-slate-600">{t('farmerRequest.desc')}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm">
          {t('farmerRequest.statusLabel')} : <strong>new</strong>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.workType')}</label>
            <input
              value={form.workType}
              onChange={(e) => setForm({ ...form, workType: e.target.value })}
              placeholder={t('farmerRequest.workTypePlaceholder')}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.location')}</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.startDate')}</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.endDate')}</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.workersNeeded')}</label>
            <input
              type="number"
              min="1"
              value={form.workersNeeded}
              onChange={(e) => setForm({ ...form, workersNeeded: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.transportResp')}</label>
            <select
              value={form.transportResponsibility}
              onChange={(e) => setForm({ ...form, transportResponsibility: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="farmer">{t('farmerRequest.transportFarmer')}</option>
              <option value="worker">{t('farmerRequest.transportWorker')}</option>
              <option value="shared">{t('farmerRequest.transportShared')}</option>
              <option value="unsure">{t('farmerRequest.transportUnsure')}</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.transportInfo')}</label>
            <input
              value={form.transportInfo}
              onChange={(e) => setForm({ ...form, transportInfo: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.contactName')}</label>
            <input
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.phone')}</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+212..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.whatsapp')}</label>
            <input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="+212..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.notes')}</label>
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <input
              type="checkbox"
              checked={form.housingProvided}
              onChange={(e) => setForm({ ...form, housingProvided: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.housingProvided')}</label>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <input
              type="checkbox"
              checked={form.mealsProvided}
              onChange={(e) => setForm({ ...form, mealsProvided: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label className="text-sm font-semibold text-slate-700">{t('farmerRequest.mealsProvided')}</label>
          </div>

          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {t('farmerRequest.submit')}
            </button>
            <button
              type="button"
              onClick={handleWhatsAppContinue}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100"
            >
              <span>📲</span>
              {t('farmerRequest.continueWhatsApp')}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{t('farmerRequest.historyTitle')}</h3>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{t('farmerRequest.historyLocal')}</span>
        </div>
        {requestHistory.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">{t('farmerRequest.noHistory')}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left text-sm text-slate-700">
                  <th className="px-3 py-2">{t('farmerRequest.thWork')}</th>
                  <th className="px-3 py-2">{t('farmerRequest.thLocation')}</th>
                  <th className="px-3 py-2">{t('farmerRequest.thDates')}</th>
                  <th className="px-3 py-2">{t('farmerRequest.thWorkers')}</th>
                  <th className="px-3 py-2">{t('farmerRequest.thStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {requestHistory.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 text-sm text-slate-700">
                    <td className="px-3 py-2 font-semibold text-slate-900">{item.workType}</td>
                    <td className="px-3 py-2">{item.location}</td>
                    <td className="px-3 py-2">
                      {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">{item.workersNeeded}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {getRequestStatusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default FarmerRequestPage;
