import { useEffect, useState } from 'react';
import FilterBar from '../components/FilterBar';
import WorkerCard from '../components/WorkerCard';
import { api } from '../services/api';

const DirectoryPage = () => {
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
    <div>
      <h2>Worker Directory</h2>
      <FilterBar filters={filters} setFilters={setFilters} />
      {loading ? (
        <p>Loading workers...</p>
      ) : workers.length === 0 ? (
        <p>No approved workers found for selected filters.</p>
      ) : (
        <div className="grid grid-2">
          {workers.map((worker) => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
