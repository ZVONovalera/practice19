// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import useTechnologies from './hooks/useTechnologies';
import TechnologyCard from './components/TechnologyCard';
import Statistics from './Statistics';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import SearchBar from './components/SearchBar';

function App() {
  // Используем кастомный хук для работы с технологиями
  const {
    technologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    selectRandomTechnology,
    clearLocalStorage,
    exportData,
    progress,
    stats
  } = useTechnologies();
  
  // Состояние для фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация технологий по статусу
  const filteredByStatus = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  // Поиск по технологиям
  const filteredTechnologies = filteredByStatus.filter(tech => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      tech.title.toLowerCase().includes(query) ||
      tech.description.toLowerCase().includes(query) ||
      (tech.notes && tech.notes.toLowerCase().includes(query))
    );
  });

  // Функция для обработки случайного выбора технологии
  const handleRandomTechnology = () => {
    const randomTech = selectRandomTechnology();
    if (randomTech) {
      alert(`Следующая технология для изучения: ${randomTech.title}`);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📚 Трекер изучения технологий</h1>
        <Statistics 
          technologies={technologies} 
          progress={progress}
          stats={stats}
        />
      </header>

      <div className="controls-container">
        <QuickActions 
          markAllAsCompleted={markAllAsCompleted}
          resetAllStatuses={resetAllStatuses}
          selectRandomTechnology={handleRandomTechnology}
          technologies={technologies}
          clearLocalStorage={clearLocalStorage}
          exportData={exportData}
        />
        
        <div className="right-controls">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultsCount={filteredTechnologies.length}
            totalCount={technologies.length}
          />
          
          <FilterButtons 
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </div>
      </div>

      <div className="search-info">
        {searchQuery && (
          <div className="search-results-info">
            🔍 Найдено: <strong>{filteredTechnologies.length}</strong> из {technologies.length} технологий
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕ Очистить поиск
            </button>
          </div>
        )}
      </div>

      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            technology={tech}
            onStatusToggle={() => updateStatus(tech.id)}
            onNotesUpdate={(notes) => updateNotes(tech.id, notes)}
          />
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить поисковый запрос или выбрать другой фильтр</p>
          <button 
            className="reset-filters-btn"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
          >
            Сбросить все фильтры
          </button>
        </div>
      )}

      <div className="local-storage-info">
        <div className="storage-status">
          <span className="status-icon">💾</span>
          <span>Данные сохраняются автоматически в localStorage</span>
          <div className="storage-stats">
            <span className="stat-item">Технологий: {technologies.length}</span>
            <span className="stat-item">Заметок: {stats.notesCount}</span>
            <span className="stat-item">Прогресс: {progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;