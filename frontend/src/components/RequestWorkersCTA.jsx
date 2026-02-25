import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { promptAuthRequired } from '../utils/authPrompt';

const RequestWorkersCTA = ({ className = '' }) => {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();

  const handleClick = async () => {
    if (isUserAuthenticated) {
      navigate('/request-worker');
      return;
    }

    await promptAuthRequired(navigate);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-xl bg-[#facc15] px-6 py-3 text-sm font-bold text-[#166534] transition hover:bg-[#fde047] focus:outline-none focus:ring-2 focus:ring-[#16a34a]/60 ${className}`}
    >
      Demander des travailleurs
    </button>
  );
};

export default RequestWorkersCTA;
