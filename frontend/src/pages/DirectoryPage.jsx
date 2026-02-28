import { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import WorkerCard from '../components/WorkerCard';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const DirectoryPage = () => {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ location: '', skill: '', availability: '' });

  useEffect(() => {
    const loadWorkers = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/workers', {
          params: {
            ...(filters.location ? { location: filters.location } : {}),
            ...(filters.skill ? { skill: filters.skill } : {}),
            ...(filters.availability ? { availability: filters.availability } : {}),
          },
        });
        setWorkers(data);
      } catch (error) {
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    loadWorkers();
  }, [filters]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{t('directory.label')}</p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('directory.title')}</h1>
          <p className="max-w-2xl text-sm text-slate-600">{t('directory.desc')}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm">
          {t('directory.status')} : <strong>{workers.length}</strong> {t('directory.approvedProfiles')}
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-600 shadow-sm">{t('directory.loading')}</div>
        ) : workers.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
            {t('directory.noResults')}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {workers.map((worker) => (
              <WorkerCard key={worker._id} worker={worker} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DirectoryPage;
