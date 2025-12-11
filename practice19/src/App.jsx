// src/App.jsx
import { useState } from 'react';
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
    isLoading, // ← ДОБАВЬ ЭТО!
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

  // Защита от undefined - используем пустой массив если technologies undefined
  const safeTechnologies = Array.isArray(technologies) ? technologies : [];

  // Фильтрация технологий по статусу
  const filteredByStatus = safeTechnologies.filter(tech => {
    if (!tech || !tech.status) return false;
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  // Поиск по технологиям с защитой от ошибок
  const filteredTechnologies = filteredByStatus.filter(tech => {
    if (!tech) return false;
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const techTitle = tech.title ? tech.title.toLowerCase() : '';
    const techDescription = tech.description ? tech.description.toLowerCase() : '';
    const techNotes = tech.notes ? tech.notes.toLowerCase() : '';
    
    return (
      techTitle.includes(query) ||
      techDescription.includes(query) ||
      techNotes.includes(query)
    );
  });

  // Функция для обработки случайного выбора технологии
  const handleRandomTechnology = () => {
    try {
      const randomTech = selectRandomTechnology();
      if (randomTech) {
        updateStatus(randomTech.id);
        alert(`Следующая технология для изучения: ${randomTech.title}`);
      } else {
        alert('Все технологии уже начаты или завершены!');
      }
    } catch (error) {
      console.error('Ошибка при случайном выборе:', error);
      alert('Произошла ошибка при выборе технологии');
    }
  };

  // Функция для обработки очистки хранилища
  const handleClearStorage = () => {
    if (window.confirm('Вы уверены? Все сохраненные данные будут удалены.')) {
      clearLocalStorage();
      alert('Данные очищены!');
    }
  };

  // Показываем загрузку если данные еще грузятся
  if (isLoading) { // ← Теперь isLoading определен
    return (
      <div className="App loading">
        <div className="loader">
          <div className="spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>📚 Трекер изучения технологий</h1>
        <Statistics 
          technologies={safeTechnologies} 
          progress={progress}
          stats={stats}
        />
      </header>

      <div className="controls-container">
        <QuickActions 
          markAllAsCompleted={markAllAsCompleted}
          resetAllStatuses={resetAllStatuses}
          selectRandomTechnology={handleRandomTechnology}
          technologies={safeTechnologies}
          clearLocalStorage={handleClearStorage}
          exportData={exportData}
        />
        
        <div className="right-controls">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            resultsCount={filteredTechnologies.length}
            totalCount={safeTechnologies.length}
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
            🔍 Найдено: <strong>{filteredTechnologies.length}</strong> из {safeTechnologies.length} технологий
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
        {filteredTechnologies.map(tech => {
          
          if (!tech || !tech.id) return null;
          
          return (
            <TechnologyCard
  key={tech.id}
  technology={tech}
  onStatusToggle={() => {
    console.log('App: Изменение статуса для', tech.id);
    updateStatus(tech.id);
  }}
  onNotesUpdate={(techId, notesText) => { // ← ВАЖНО: ДВА параметра!
    console.log('App: Сохранение заметки', {
      techId: techId,
      notesText: notesText,
      expectedId: tech.id
    });
    
    // Убедись что techId совпадает с tech.id
    if (techId === tech.id) {
      updateNotes(techId, notesText);
    } else {
      console.error('ID не совпадают!', techId, tech.id);
      updateNotes(tech.id, notesText); // Все равно сохраняем
    }
  }}
/>
          );
        })}
      </div>

      {filteredTechnologies.length === 0 && safeTechnologies.length > 0 && (
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

      {safeTechnologies.length === 0 && !isLoading && (
        <div className="no-data">
          <div className="no-data-icon">📭</div>
          <h3>Нет данных о технологиях</h3>
          <p>Попробуйте обновить страницу или очистить хранилище</p>
          <button 
            className="refresh-btn"
            onClick={() => window.location.reload()}
          >
            🔄 Обновить страницу
          </button>
        </div>
      )}

      <div className="local-storage-info">
        <div className="storage-status">
          <span className="status-icon">💾</span>
          <span>Данные сохраняются автоматически в localStorage</span>
          <div className="storage-stats">
            <span className="stat-item">Технологий: {safeTechnologies.length}</span>
            <span className="stat-item">Заметок: {stats?.notesCount || 0}</span>
            <span className="stat-item">Прогресс: {progress || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;