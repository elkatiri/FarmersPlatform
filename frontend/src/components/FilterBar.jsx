const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="card grid grid-2">
      <div>
        <label>Location</label>
        <input
          value={filters.location}
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
          placeholder="e.g. Nashik"
        />
      </div>
      <div>
        <label>Skill</label>
        <input
          value={filters.skill}
          onChange={(e) => setFilters((prev) => ({ ...prev, skill: e.target.value }))}
          placeholder="e.g. harvesting"
        />
      </div>
      <div>
        <label>Availability</label>
        <select
          value={filters.availability}
          onChange={(e) => setFilters((prev) => ({ ...prev, availability: e.target.value }))}
        >
          <option value="">All</option>
          <option value="immediate">Immediate</option>
          <option value="within_week">Within week</option>
          <option value="seasonal">Seasonal</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'end' }}>
        <button
          className="secondary"
          onClick={() => setFilters({ location: '', skill: '', availability: '' })}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
