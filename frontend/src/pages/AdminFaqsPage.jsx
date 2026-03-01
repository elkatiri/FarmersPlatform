import { useEffect, useMemo, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminFaqsPage = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const headers = authHeaders(token);

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const editingFaq = useMemo(() => faqs.find((f) => f._id === editingId) || null, [faqs, editingId]);

  const fetchFaqs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/faqs');
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const startEdit = (faq) => {
    setEditingId(faq._id);
    setQuestion(faq.question || '');
    setAnswer(faq.answer || '');
  };

  const cancelEdit = () => {
    setEditingId('');
    setQuestion('');
    setAnswer('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.patch(`/faqs/${editingId}`, { question, answer }, headers);
      } else {
        await api.post('/faqs', { question, answer }, headers);
      }
      await fetchFaqs();
      cancelEdit();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || t('admin.errLoad');
      setError(msg);
    }
  };

  const remove = async (id) => {
    const ok = window.confirm(t('admin.confirmDeleteFaq'));
    if (!ok) return;

    setError('');
    try {
      await api.delete(`/faqs/${id}`, headers);
      await fetchFaqs();
      if (editingId === id) cancelEdit();
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t('admin.faqsTitle')}</h1>
        <p className="mt-2 text-sm text-slate-600">{t('admin.faqsDesc')}</p>
      </header>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {editingFaq ? t('admin.editFaq') : t('admin.createFaq')}
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {editingFaq ? editingFaq.question : t('admin.newFaqTitle')}
            </h2>
          </div>
          {editingFaq ? (
            <button
              onClick={cancelEdit}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              {t('admin.cancel')}
            </button>
          ) : null}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.question')}</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder={t('admin.questionPlaceholder')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t('admin.answer')}</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder={t('admin.answerPlaceholder')}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {editingFaq ? t('admin.save') : t('admin.create')}
            </button>
            {editingFaq ? (
              <button
                type="button"
                onClick={() => remove(editingId)}
                className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                {t('admin.delete')}
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{t('admin.faqsTableLabel')}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">{t('admin.faqsTableTitle')}</h2>
          </div>
          <button
            onClick={fetchFaqs}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            {t('admin.refresh')}
          </button>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
              <tr>
                <th className="px-4 py-3">{t('admin.thQuestion')}</th>
                <th className="px-4 py-3">{t('admin.thAnswer')}</th>
                <th className="px-4 py-3">{t('admin.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={3}>
                    {t('admin.loading')}
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-600" colSpan={3}>
                    {t('admin.noFaqs')}
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq._id} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-slate-900">{faq.question}</td>
                    <td className="px-4 py-3 text-slate-700">{faq.answer}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => startEdit(faq)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50"
                        >
                          {t('admin.edit')}
                        </button>
                        <button
                          onClick={() => remove(faq._id)}
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

export default AdminFaqsPage;
