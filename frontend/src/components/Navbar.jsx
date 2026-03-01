import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const { isAdminAuthenticated, isUserAuthenticated, currentUser, logout, logoutUser } = useAuth();
  const { t, lang, toggleLang, isRTL } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/request-worker', label: t('nav.requests') },
    { to: '/worker-profile', label: t('nav.workers') },
    { to: '/directory', label: t('nav.directory') },
    { to: '/faq', label: t('nav.faq') },
    { to: '/contact', label: t('nav.contact') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-amber-400/90 text-emerald-950 shadow-sm'
        : 'text-white/90 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300
        ${scrolled
          ? 'mx-4 border border-white/20 bg-emerald-900/90 shadow-xl shadow-emerald-950/20 backdrop-blur-xl sm:mx-auto'
          : 'mx-4 bg-emerald-900/80 backdrop-blur-md sm:mx-auto'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          
            {/* <img src={logo} alt={t('appName')} className="h-8 w-8 object-cover" />
           */}
          <span className="hidden text-base font-bold tracking-tight text-white sm:block">{t('appName')}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>{l.label}</NavLink>
          ))}
          {isAdminAuthenticated && (
            <NavLink to="/admin" className={navLinkClass}>{t('nav.admin')}</NavLink>
          )}
        </div>

        {/* Auth + lang + mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <button
            onClick={toggleLang}
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
            aria-label="Switch language"
          >
            {lang === 'fr' ? 'عربية' : 'FR'}
          </button>

          {/* Desktop auth */}
          <div className="hidden items-center gap-2 lg:flex">
            {isAdminAuthenticated && (
              <button onClick={logout} className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-amber-300">
                {t('nav.logout')}
              </button>
            )}
            {isUserAuthenticated ? (
              <>
                <span className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
                  {currentUser?.firstName || t('nav.user')}
                </span>
                <button onClick={logoutUser} className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-emerald-950 transition hover:bg-amber-300">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-900 shadow-sm transition hover:bg-emerald-50">
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mx-4 mt-2 animate-fade-in rounded-2xl border border-white/15 bg-emerald-900/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={navLinkClass}>{l.label}</NavLink>
            ))}
            {isAdminAuthenticated && (
              <>
                <NavLink to="/admin" className={navLinkClass}>{t('nav.admin')}</NavLink>
                <button onClick={logout} className="mt-2 w-full rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-bold text-emerald-950">
                  {t('nav.logoutAdmin')}
                </button>
              </>
            )}
            {isUserAuthenticated ? (
              <>
                <span className="mt-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white/90 text-center">
                  {currentUser?.firstName || t('nav.user')}
                </span>
                <button onClick={logoutUser} className="w-full rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-bold text-emerald-950">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <Link to="/login" className="mt-2 block w-full rounded-lg bg-white px-3 py-2.5 text-center text-sm font-bold text-emerald-900">
                {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;