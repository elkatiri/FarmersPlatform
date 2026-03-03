import { useEffect, useMemo, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminFaqsPage = () => {
  const { token } = useAuth();
  const { t, isRTL } = useLanguage();
  const alignClass = isRTL ? 'text-right' : 'text-left';
  const dir = isRTL ? 'rtl' : 'ltr';
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
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">{t('admin.navFaqs')}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{t('admin.faqsTitle')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('admin.faqsDesc')}</p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              {editingFaq ? t('admin.editFaq') : t('admin.createFaq')}
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">
              {editingFaq ? editingFaq.question : t('admin.newFaqTitle')}
            </h2>
          </div>
          {editingFaq && (
            <button onClick={cancelEdit} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              {t('admin.cancel')}
            </button>
          )}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.question')}</label>
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t('admin.questionPlaceholder')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">{t('admin.answer')}</label>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} placeholder={t('admin.answerPlaceholder')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              {editingFaq ? t('admin.save') : t('admin.create')}
            </button>
            {editingFaq && (
              <button type="button" onClick={() => remove(editingId)}
                className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100">
                {t('admin.delete')}
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t('admin.faqsTableLabel')}</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">{t('admin.faqsTableTitle')}</h2>
          </div>
          <button onClick={fetchFaqs} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
            {t('admin.refresh')}
          </button>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {loading ? (
            <p className="py-4 text-sm text-gray-400">{t('admin.loading')}</p>
          ) : faqs.length === 0 ? (
            <p className="py-4 text-sm text-gray-400">{t('admin.noFaqs')}</p>
          ) : (
            faqs.map((faq) => (
              <div key={faq._id} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-2">
                <div>
                  <span className="text-[11px] font-medium text-gray-500">{t('admin.thQuestion')}</span>
                  <p className="text-sm font-semibold text-gray-900">{faq.question}</p>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-gray-500">{t('admin.thAnswer')}</span>
                  <p className="text-sm text-gray-600 line-clamp-3">{faq.answer}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button onClick={() => startEdit(faq)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                    {t('admin.edit')}
                  </button>
                  <button onClick={() => remove(faq._id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
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
                <th className="px-4 py-3">{t('admin.thQuestion')}</th>
                <th className="px-4 py-3">{t('admin.thAnswer')}</th>
                <th className="px-4 py-3">{t('admin.thActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-4 py-4 text-gray-400" colSpan={3}>{t('admin.loading')}</td></tr>
              ) : faqs.length === 0 ? (
                <tr><td className="px-4 py-4 text-gray-400" colSpan={3}>{t('admin.noFaqs')}</td></tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq._id} className="hover:bg-gray-50/60 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{faq.question}</td>
                    <td className="px-4 py-3 text-gray-600">{faq.answer}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => startEdit(faq)} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50">
                          {t('admin.edit')}
                        </button>
                        <button onClick={() => remove(faq._id)} className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
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
