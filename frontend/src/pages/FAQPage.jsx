import { useEffect, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [error, setError] = useState('');
  const { isAdminAuthenticated, token } = useAuth();
  const { t } = useLanguage();

  const fetchFaqs = async () => {
    const { data } = await api.get('/faqs');
    setFaqs(data);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const addFAQ = async (e) => {
    e.preventDefault();
    setError('');
    if (!question || !answer) {
      setError(t('faq.errRequired'));
      return;
    }

    try {
      await api.post('/faqs', { question, answer }, authHeaders(token));
      setQuestion('');
      setAnswer('');
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || t('faq.errRequired'));
    }
  };

  const startEdit = (faq) => {
    setEditingId(faq._id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const saveEdit = async () => {
    if (!editQuestion || !editAnswer) {
      setError(t('faq.errRequired'));
      return;
    }

    try {
      await api.patch(`/faqs/${editingId}`, { question: editQuestion, answer: editAnswer }, authHeaders(token));
      setEditingId('');
      setEditQuestion('');
      setEditAnswer('');
      setError('');
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || t('faq.errRequired'));
    }
  };

  const removeFAQ = async (id) => {
    try {
      await api.delete(`/faqs/${id}`, authHeaders(token));
      fetchFaqs();
    } catch (err) {
      setError(err.response?.data?.message || t('faq.errRequired'));
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{t('faq.label')}</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('faq.title')}</h1>
          <p className="max-w-2xl text-sm text-slate-600">{t('faq.desc')}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          <strong className="text-emerald-700">{t('faq.badge')}</strong> {t('faq.badgeDesc')}
        </div>
      </div>

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-5 text-sm text-slate-600 shadow-sm">{t('faq.noFaqs')}</div>
        ) : (
          faqs.map((faq) => (
            <div key={faq._id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              {editingId === faq._id ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-slate-700">{t('faq.question')}</label>
                    <input
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-semibold text-slate-700">{t('faq.answer')}</label>
                    <textarea
                      rows="3"
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <button
                      onClick={saveEdit}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      {t('faq.save')}
                    </button>
                    <button
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      onClick={() => setEditingId('')}
                    >
                      {t('faq.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-emerald-700">Q. {faq.question}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{faq.answer}</p>
                  {isAdminAuthenticated && (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => startEdit(faq)}
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        {t('faq.edit')}
                      </button>
                      <button
                        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300"
                        onClick={() => removeFAQ(faq._id)}
                      >
                        {t('faq.delete')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isAdminAuthenticated && (
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{t('faq.adminTitle')}</h3>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">CRUD</span>
          </div>
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <form onSubmit={addFAQ} className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t('faq.question')}</label>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t('faq.answer')}</label>
              <textarea
                rows="4"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                {t('faq.addFaq')}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default FAQPage;
