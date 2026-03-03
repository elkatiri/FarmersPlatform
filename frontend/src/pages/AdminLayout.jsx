import { NavLink, Outlet } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api, authHeaders } from '../services/api';

const navLinkBase =
  'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200';

const AdminLayout = () => {
  const { logout, token } = useAuth();
  const { t, isRTL, toggleLang, lang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({ main: true, manage: true });
  const [counts, setCounts] = useState({ messages: 0, requests: 0, pendingUsers: 0 });

  const toggleSection = (key) =>
    setSectionsOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const fetchCounts = useCallback(async () => {
    if (!token) return;
    const headers = authHeaders(token);
    try {
      const [msgRes, reqRes, usersRes] = await Promise.all([
        api.get('/contact', headers),
        api.get('/requests', headers),
        api.get('/workers/pending', headers),
      ]);
      setCounts({
        messages: Array.isArray(msgRes.data) ? msgRes.data.length : 0,
        requests: Array.isArray(reqRes.data) ? reqRes.data.filter((r) => r.status === 'new').length : 0,
        pendingUsers: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
      });
    } catch {
      // silent – badges are cosmetic
    }
  }, [token]);

  useEffect(() => {
    fetchCounts();
    if (!token) return;
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, [fetchCounts, token]);

  useEffect(() => {
    const handler = () => fetchCounts();
    window.addEventListener('admin:refreshCounts', handler);
    return () => window.removeEventListener('admin:refreshCounts', handler);
  }, [fetchCounts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* ── Sidebar ── */}
        <aside
          className={`fixed inset-y-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:h-[90vh] lg:sticky lg:top-4 lg:mx-3 lg:my-4 lg:translate-x-0 lg:rounded-2xl lg:border lg:shadow-sm`}
        >
          {/* Brand */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 12L12 3L21 12" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 10V21H19V10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{t('appName')}</p>
                <p className="text-[10px] font-medium text-gray-400">{t('admin.panelLabel')}</p>
              </div>
            </div>
            <button
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Admin">
            {/* Main section */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('main')}
                className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                <span>{t('admin.sectionMain')}</span>
                <svg className={`h-3.5 w-3.5 transition-transform ${sectionsOpen.main ? '' : '-rotate-90'}`} viewBox="0 0 20 20" fill="none">
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {sectionsOpen.main && (
                <div className="mt-1 space-y-1">
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `${navLinkBase} ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                    }
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                    </span>
                    <span>{t('admin.navOverview')}</span>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Management section */}
            <div>
              <button
                type="button"
                onClick={() => toggleSection('manage')}
                className="flex w-full items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-gray-400"
              >
                <span>{t('admin.sectionManagement')}</span>
                <svg className={`h-3.5 w-3.5 transition-transform ${sectionsOpen.manage ? '' : '-rotate-90'}`} viewBox="0 0 20 20" fill="none">
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {sectionsOpen.manage && (
  <div className="mt-1 space-y-1">
    {/* USERS */}
    <NavLink
      to="/admin/users"
      className={({ isActive }) =>
        `${navLinkBase} ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
      }
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="3" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{t('admin.navUsers')}</span>
      {counts.pendingUsers > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-100 px-1.5 text-[10px] font-bold text-sky-700">
          {counts.pendingUsers}
        </span>
      )}
    </NavLink>

    {/* FAQ */}
      <NavLink
        to="/admin/faqs"
        className={({ isActive }) =>
          `${navLinkBase} ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
        }
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="17" r="0.5" fill="currentColor" />
          </svg>
        </span>
        <span>{t('admin.navFaqs')}</span>
      </NavLink>

      {/* MESSAGES */}
      <NavLink
        to="/admin/messages"
        className={({ isActive }) =>
          `${navLinkBase} ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
        }
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{t('admin.navMessages')}</span>
        {counts.messages > 0 && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-100 px-1.5 text-[10px] font-bold text-rose-700">
            {counts.messages}
          </span>
        )}
      </NavLink>

      {/* EXPORT */}
      <NavLink
        to="/admin/export"
        className={({ isActive }) =>
          `${navLinkBase} ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
        }
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{t('admin.navExport')}</span>
      </NavLink>
    </div>
  )}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-4 space-y-3">
            <button
              onClick={toggleLang}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {lang === 'fr' ? 'عربية' : 'Français'}
            </button>
            <button
              onClick={logout}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 17l5-5-5-5M20 12H9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('nav.logout')}
            </button>
            <p className={`text-[11px] text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('admin.sidebarHint')}
            </p>
          </div>
        </aside>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main area ── */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-lg lg:px-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Menu"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
                  </svg>
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{t('admin.topbarLabel')}</p>
                  <p className="text-sm font-semibold text-gray-900">{t('admin.topbarSubtitle')}</p>
                </div>
              </div>

              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    A
                  </div>
                  <div className="hidden text-xs leading-tight sm:block">
                    <p className="font-semibold text-gray-900">{t('admin.adminLabel')}</p>
                    <p className="text-[10px] text-gray-400">{t('admin.roleLabel')}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
