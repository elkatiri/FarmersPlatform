import RequestWorkersCTA from './RequestWorkersCTA';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const WorkerCard = ({ worker }) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const whatsappMessage = encodeURIComponent(
    t('workerCard.whatsappMessage').replace('{name}', worker.fullName || worker.name)
  );
  const targetNumber = (worker.whatsapp || worker.phone || '').replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${targetNumber}?text=${whatsappMessage}`;
  const phoneUrl = `tel:${(worker.phone || '').replace(/[^\d+]/g, '')}`;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{worker.fullName || worker.name}</h3>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {worker.experienceLevel}
          </span>
        </div>
        <p className="text-sm text-slate-600">{worker.location || worker.regions?.[0] || t('workerCard.locationNotProvided')}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">{t('workerCard.dispoLabel')}: {worker.availability}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold">
            {t('workerCard.transportLabel')}: {worker.transportFlexibility || (worker.travelFlexible ? t('workerCard.flexible') : t('workerCard.no'))}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {worker.regions.map((region) => (
            <span key={region} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {region}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {worker.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <RequestWorkersCTA className="w-full rounded-xl bg-amber-300 px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow hover:-translate-y-0.5 hover:shadow-lg" />
        {isAuthenticated && (
          <>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <button className="w-full rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-400">
                {t('workerCard.contactWhatsApp')}
              </button>
            </a>
            <a href={phoneUrl}>
              <button className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                {t('workerCard.call')}
              </button>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkerCard;
