import { useNavigate } from 'react-router-dom';
import { LuArrowRight } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { promptAuthRequired } from '../utils/authPrompt';
import { useLanguage } from '../context/LanguageContext';

const RequestWorkersCTA = ({ className = '' }) => {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();
  const { t } = useLanguage();

  const handleClick = async () => {
    if (isUserAuthenticated) {
      navigate('/request-worker');
      return;
    }

    await promptAuthRequired(navigate, t);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-[#0f1f12] shadow-[0_12px_30px_rgba(232,184,75,0.35)] transition-all duration-200 bg-gradient-to-r from-[#facc15] via-[#fadd4f] to-[#facc15] hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(232,184,75,0.45)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#facc15]/70 focus:ring-offset-[#0f1f12] ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="text-[0.95rem] font-semibold tracking-wide">{t('requestCta')}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f1f12]/10 text-[#0f1f12] transition duration-200 group-hover:translate-x-0.5 group-hover:bg-[#0f1f12]/15">
          <LuArrowRight className="text-base" />
        </span>
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.3),transparent_45%)] opacity-70 transition-opacity duration-300 group-hover:opacity-90" aria-hidden="true" />
    </button>
  );
};

export default RequestWorkersCTA;
