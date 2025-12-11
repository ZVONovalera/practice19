// src/components/FilterButtons.jsx
import './FilterButtons.css';

function FilterButtons({ activeFilter, setActiveFilter }) {
  const filters = [
    { id: 'all', label: 'Все', icon: '', count: null },
    { id: 'not-started', label: 'Не начато', icon: '', color: '#ff6b6b' },
    { id: 'in-progress', label: 'В процессе', icon: '', color: '#4ecdc4' },
    { id: 'completed', label: 'Завершено', icon: '', color: '#45b7d1' }
  ];

  return (
    <div className="filter-buttons">
      <h3>🔍 Фильтр по статусу</h3>
      <div className="filters-grid">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
            style={filter.color && activeFilter === filter.id ? 
              { borderColor: filter.color, color: filter.color } : {}}
          >
            <span className="filter-icon">{filter.icon}</span>
            <span className="filter-label">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterButtons;