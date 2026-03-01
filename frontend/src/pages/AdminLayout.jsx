import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const linkBase =
  'inline-flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition';

const AdminLayout = () => {
  const { logout } = useAuth();
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm md:sticky md:top-6 md:self-start">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Admin</p>
                <p className="mt-1 text-sm text-slate-600">{t('admin.dashboardTitle')}</p>
              </div>
            </div>

            <nav className="mt-6 space-y-2" aria-label="Admin navigation">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                <span>{t('admin.navOverview')}</span>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                <span>{t('admin.navUsers')}</span>
              </NavLink>

              <NavLink
                to="/admin/faqs"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                <span>{t('admin.navFaqs')}</span>
              </NavLink>
            </nav>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <button
                onClick={logout}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                {t('nav.logout')}
              </button>
              <p className={`mt-3 text-xs text-slate-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('admin.sidebarHint')}
              </p>
            </div>
          </aside>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
