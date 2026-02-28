import { useLanguage } from '../context/LanguageContext';

const FilterBar = ({ filters, setFilters }) => {
  const { t } = useLanguage();

  return (
  <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">{t('filter.location')}</label>
        <input
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          placeholder={t('filter.locationPlaceholder')}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">{t('filter.skill')}</label>
        <input
          value={filters.skill}
          onChange={(e) => setFilters((prev) => ({ ...prev, skill: e.target.value }))}
          placeholder={t('filter.skillPlaceholder')}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">{t('filter.availability')}</label>
        <select
          value={filters.availability}
          onChange={(e) => setFilters((prev) => ({ ...prev, availability: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">{t('filter.all')}</option>
          <option value="immediate">{t('filter.immediate')}</option>
          <option value="within_week">{t('filter.withinWeek')}</option>
          <option value="seasonal">{t('filter.seasonal')}</option>
        </select>
      </div>
      <div className="flex items-end">
        <button
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
          onClick={() => setFilters({ location: '', skill: '', availability: '' })}
        >
          {t('filter.reset')}
        </button>
      </div>
    </div>
  </div>
  );
};

export default FilterBar;
