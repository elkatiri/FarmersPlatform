import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { promptAuthRequired } from '../utils/authPrompt';
import RequestWorkersCTA from './RequestWorkersCTA';

const WorkerCard = ({ worker }) => {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();
  const whatsappMessage = encodeURIComponent(
    `Bonjour ${worker.name}, j’ai trouvé votre profil sur Agriculteurs & Travailleurs et je souhaite discuter d’une mission.`
  );
  const whatsappUrl = `https://wa.me/${worker.phone.replace(/[^\d]/g, '')}?text=${whatsappMessage}`;
  const phoneUrl = `tel:${worker.phone.replace(/[^\d+]/g, '')}`;

  return (
    <div className="card">
      <h3>{worker.name}</h3>
      <p><strong>Téléphone :</strong> {worker.phone}</p>
      <p><strong>Expérience :</strong> {worker.experienceLevel}</p>
      <p><strong>Disponibilité :</strong> {worker.availability}</p>
      <p><strong>Transport :</strong> {worker.transportFlexibility}</p>
      <div>
        {worker.regions.map((region) => (
          <span key={region} className="badge">{region}</span>
        ))}
      </div>
      <div>
        {worker.skills.map((skill) => (
          <span key={skill} className="badge">{skill}</span>
        ))}
      </div>
      <div className="grid" style={{ marginTop: '0.75rem' }}>
        <RequestWorkersCTA className="w-full" />
        {isUserAuthenticated ? (
          <>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <button className="secondary">Contacter sur WhatsApp</button>
            </a>
            <a href={phoneUrl}>
              <button>Appeler</button>
            </a>
          </>
        ) : (
          <button className="secondary" onClick={() => promptAuthRequired(navigate)}>
            Se connecter pour contacter
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkerCard;
