// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import Statistics from './components/Statistics';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';
import SearchBar from './components/SearchBar';

// Начальные данные (используются только если нет сохраненных)
const initialTechnologies = [
  { 
    id: 1, 
    title: 'React + JSX', 
    description: 'Базовые компоненты, JSX, props', 
    status: 'completed',
    notes: 'JSX - это синтаксическое расширение для JavaScript'
  },
  { 
    id: 2, 
    title: 'Состояние (useState)', 
    description: 'Управление состоянием в функциональных компонентах', 
    status: 'in-progress',
    notes: 'Хук useState возвращает массив: [state, setState]'
  },
  { 
    id: 3, 
    title: 'Эффекты (useEffect)', 
    description: 'Работа с API и побочными эффектами', 
    status: 'in-progress',
    notes: 'Использую для загрузки данных и подписок'
  },
  { 
    id: 4, 
    title: 'React Router', 
    description: 'Навигация между страницами', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 5, 
    title: 'Context API', 
    description: 'Глобальное состояние без пропсов', 
    status: 'not-started',
    notes: ''
  },
  { 
    id: 6, 
    title: 'Redux / Zustand', 
    description: 'Продвинутое управление состоянием', 
    status: 'not-started',
    notes: 'Нужно сравнить эти две библиотеки'
  }
];

function App() {
  // Состояние для технологий с загрузкой из localStorage
  const [technologies, setTechnologies] = useState([]);
  
  // Состояние для фильтра
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка данных из localStorage при первом рендере
  useEffect(() => {
    const savedData = localStorage.getItem('techTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Данные загружены из localStorage:', parsedData.length, 'технологий');
        setTechnologies(parsedData);
      } catch (error) {
        console.error('❌ Ошибка при загрузке из localStorage:', error);
        setTechnologies(initialTechnologies);
      }
    } else {
      console.log('📝 Локальное хранилище пусто, используются начальные данные');
      setTechnologies(initialTechnologies);
    }
  }, []);

  // Автосохранение в localStorage при изменении технологий
  useEffect(() => {
    if (technologies.length > 0) {
      localStorage.setItem('techTrackerData', JSON.stringify(technologies));
      console.log('💾 Данные сохранены в localStorage');
    }
  }, [technologies]);

  // Функция для изменения статуса технологии
  const toggleTechnologyStatus = (id) => {
    setTechnologies(prevTech => prevTech.map(tech => {
      if (tech.id === id) {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(tech.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...tech, status: statusOrder[nextIndex] };
      }
      return tech;
    }));
  };

  // Функция для изменения заметок технологии
  const updateTechnologyNotes = (id, notes) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, notes } : tech
      )
    );
  };

  // Функция для отметки всех как выполненных
  const markAllAsCompleted = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Функция для случайного выбора следующей технологии
  const selectRandomTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    
    if (notStartedTech.length === 0) {
      alert('Все технологии уже начаты или завершены!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * notStartedTech.length);
    const randomTech = notStartedTech[randomIndex];
    
    toggleTechnologyStatus(randomTech.id);
    alert(`Следующая технология для изучения: ${randomTech.title}`);
  };

  // Функция для очистки localStorage (дополнительно)
  const clearLocalStorage = () => {
    if (window.confirm('Вы уверены? Все сохраненные данные будут удалены.')) {
      localStorage.removeItem('techTrackerData');
      setTechnologies(initialTechnologies);
      alert('Данные очищены!');
    }
  };

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
      tech.notes.toLowerCase().includes(query)
    );
  });

  return (
    <div className="App">
      <header className="app-header">
        <h1>📚 Трекер изучения технологий</h1>
        <Statistics technologies={technologies} />
      </header>

      <div className="controls-container">
        <QuickActions 
          markAllAsCompleted={markAllAsCompleted}
          resetAllStatuses={resetAllStatuses}
          selectRandomTechnology={selectRandomTechnology}
          technologies={technologies}
          clearLocalStorage={clearLocalStorage}
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
            onStatusToggle={toggleTechnologyStatus}
            onNotesUpdate={updateTechnologyNotes}
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
          <button 
            className="storage-clear-btn"
            onClick={clearLocalStorage}
            title="Очистить все сохраненные данные"
          >
            Очистить хранилище
          </button>
        </div>
        <div className="storage-hint">
          Все изменения сохраняются автоматически. Обновите страницу чтобы убедиться.
        </div>
      </div>
    </div>
  );
}

export default App;