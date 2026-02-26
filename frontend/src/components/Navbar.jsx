import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const { isAdminAuthenticated, isUserAuthenticated, currentUser, logout, logoutUser } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-[#facc15] text-[#14532d] shadow-sm'
        : 'text-white/95 hover:bg-[#15803d] hover:text-white'
    }`;

  return (
    <nav className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 pointer-events-none">
      <div className="pointer-events-auto w-[82%] max-w-6xl rounded-2xl border border-white/25 bg-gradient-to-r from-[#15803d]/95 via-[#16a34a]/95 to-[#0f3b20]/95 px-4 py-3 text-white shadow-[0_18px_55px_rgba(22,163,74,0.32)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="group flex items-center gap-3 text-lg font-extrabold tracking-tight text-white">
            <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/20 ring-2 ring-white/40 transition group-hover:scale-105">
              <img src={logo} alt="Agriculteurs & Travailleurs" className="h-full w-full object-cover" />
            </span>
          </Link>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <NavLink to="/" className={navLinkClass}>
              Accueil
            </NavLink>
            <NavLink to="/request-worker" className={navLinkClass}>
              Demandes
            </NavLink>
            <NavLink to="/worker-profile" className={navLinkClass}>
              Travailleurs
            </NavLink>
            <NavLink to="/directory" className={navLinkClass}>
              Annuaire
            </NavLink>
            <NavLink to="/faq" className={navLinkClass}>
              FAQ
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {isAdminAuthenticated && (
              <>
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
                <button
                    onClick={logout}
                    className="!w-auto rounded-lg bg-[#facc15] px-3 py-2 text-sm font-semibold text-[#14532d] transition hover:bg-[#fde047]"
                >
                  Déconnexion Admin
                </button>
              </>
            )}

            {isUserAuthenticated ? (
              <>
                <span className="rounded-lg bg-white/15 px-3 py-2 text-sm font-medium text-white">
                  {currentUser?.firstName ? `Bonjour, ${currentUser.firstName}` : 'Utilisateur connecté'}
                </span>
                <button
                    onClick={logoutUser}
                    className="!w-auto rounded-lg bg-[#facc15] px-3 py-2 text-sm font-semibold text-[#14532d] transition hover:bg-[#fde047]"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Connexion
                </NavLink>
            
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;