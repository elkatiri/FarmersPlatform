import { useEffect, useState } from 'react';
import { api, authHeaders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AdminMessagesPage = () => {
  const { token } = useAuth();
  const { t } = useLanguage();
  const headers = authHeaders(token);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/contact', headers);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteMessage'))) return;
    try {
      await api.delete(`/contact/${id}`, headers);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expandedId === id) setExpandedId(null);
      window.dispatchEvent(new CustomEvent('admin:refreshCounts'));
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  const deleteAllMessages = async () => {
    if (!window.confirm(t('admin.confirmDeleteAllMessages'))) return;
    try {
      await api.delete('/contact/all', headers);
      setMessages([]);
      setExpandedId(null);
      window.dispatchEvent(new CustomEvent('admin:refreshCounts'));
    } catch (err) {
      setError(err.response?.data?.message || t('admin.errLoad'));
    }
  };

  const filtered = searchQuery.trim()
    ? messages.filter((m) =>
        [m.name, m.email, m.message].filter(Boolean).join(' ').toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : messages;

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">{t('admin.navMessages')}</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{t('admin.messagesTitle')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('admin.messagesDesc')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {messages.length > 0 && (
              <button
                onClick={deleteAllMessages}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('admin.deleteAll')}
              </button>
            )}
            <button
              onClick={fetchMessages}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('admin.refresh')}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Search */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('admin.searchMessages')}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none sm:w-80"
        />
        <p className="mt-2 text-xs text-gray-400">
          {filtered.length} {t('admin.messagesTitle')}
        </p>
      </div>

      {/* Messages list */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-8 text-center text-sm text-gray-400">{t('admin.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-400">{t('admin.noMessages')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((msg) => {
              const isExpanded = expandedId === msg._id;
              return (
                <div key={msg._id} className="transition hover:bg-gray-50/60">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : msg._id)}
                    className="flex w-full items-start gap-4 px-5 py-4 text-left"
                  >
                    {/* Avatar */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                      {(msg.name || '?')[0].toUpperCase()}
                    </div>

                    {/* Summary */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{msg.name}</p>
                        <span className="shrink-0 text-[11px] text-gray-400">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{msg.email}</p>
                      {!isExpanded && (
                        <p className="mt-1 truncate text-sm text-gray-600">{msg.message}</p>
                      )}
                    </div>

                    {/* Chevron */}
                    <svg
                      className={`mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{t('admin.thSender')}</p>
                          <p className="mt-1 text-sm font-medium text-gray-900">{msg.name}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{t('admin.thEmail')}</p>
                          <p className="mt-1 text-sm text-gray-700">{msg.email}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{t('admin.thCreatedAt')}</p>
                          <p className="mt-1 text-sm text-gray-700">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '-'}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{t('admin.thMessage')}</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{msg.message}</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {t('admin.delete')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
};

export default AdminMessagesPage;
