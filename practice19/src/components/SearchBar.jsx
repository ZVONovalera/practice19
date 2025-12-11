// src/components/SearchBar.jsx
import './SearchBar.css';

function SearchBar({ searchQuery, setSearchQuery, resultsCount, totalCount }) {
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="search-bar">
      <div className="search-header">
        <h3>🔍 Поиск технологий</h3>
        {searchQuery && (
          <span className="search-results">
            Найдено: {resultsCount}/{totalCount}
          </span>
        )}
      </div>
      
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Искать по названию, описанию или заметкам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button 
            className="clear-btn"
            onClick={handleClearSearch}
            title="Очистить поиск"
          >
            ✕
          </button>
        ) : (
          <span className="search-icon"></span>
        )}
      </div>
      
      <div className="search-tips">
        <div className="tip">
          <span className="tip-icon"></span>
          <span>Ищите по: названию, описанию или вашим заметкам</span>
        </div>
        <div className="tip">
          <span className="tip-icon"></span>
          <span>Поиск работает в реальном времени</span>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;