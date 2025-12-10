// src/App.jsx
import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import Statistics from './Statistics';
import QuickActions from './components/QuickActions';
import FilterButtons from './components/FilterButtons';

function App() {
  // Начальное состояние технологий
  const [technologies, setTechnologies] = useState([
    { id: 1, title: 'React + JSX', description: 'Базовые компоненты, JSX, props', status: 'completed' },
    { id: 2, title: 'Состояние (useState)', description: 'Управление состоянием в функциональных компонентах', status: 'in-progress' },
    { id: 3, title: 'Эффекты (useEffect)', description: 'Работа с API и побочными эффектами', status: 'in-progress' },
    { id: 4, title: 'React Router', description: 'Навигация между страницами', status: 'not-started' },
    { id: 5, title: 'Context API', description: 'Глобальное состояние без пропсов', status: 'not-started' },
    { id: 6, title: 'Redux / Zustand', description: 'Продвинутое управление состоянием', status: 'not-started' }
  ]);

  // Состояние для фильтра
  const [activeFilter, setActiveFilter] = useState('all');

  // Функция для изменения статуса технологии
  const toggleTechnologyStatus = (id) => {
    setTechnologies(prevTech => prevTech.map(tech => {
      if (tech.id === id) {
        // Циклическое переключение статусов
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(tech.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...tech, status: statusOrder[nextIndex] };
      }
      return tech;
    }));
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
    
    // Переключаем статус выбранной технологии
    toggleTechnologyStatus(randomTech.id);
    
    alert(`Следующая технология для изучения: ${randomTech.title}`);
  };

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    if (activeFilter === 'all') return true;
    return tech.status === activeFilter;
  });

  return (
    <div className="App">
      <header className="app-header">
        <h1>Трекер изучения технологий</h1>
        <Statistics technologies={technologies} />
      </header>

      <div className="controls-container">
        <QuickActions 
          markAllAsCompleted={markAllAsCompleted}
          resetAllStatuses={resetAllStatuses}
          selectRandomTechnology={selectRandomTechnology}
          technologies={technologies}
        />
        
        <FilterButtons 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      <div className="technologies-grid">
        {filteredTechnologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            technology={tech}
            onStatusToggle={toggleTechnologyStatus}
          />
        ))}
      </div>

      {filteredTechnologies.length === 0 && (
        <div className="no-results">
          <p>Нет технологий с выбранным статусом</p>
        </div>
      )}
    </div>
  );
}

export default App;