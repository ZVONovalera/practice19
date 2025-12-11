// src/hooks/useTechnologies.js
import { useState, useEffect } from 'react';

const initialTechnologies = [
  { 
    id: 1, 
    title: 'React + JSX', 
    description: 'Базовые компоненты, JSX, props', 
    status: 'completed',
    notes: 'JSX - это синтаксическое расширение для JavaScript',
    category: 'frontend'
  },
  { 
    id: 2, 
    title: 'Состояние (useState)', 
    description: 'Управление состоянием в функциональных компонентах', 
    status: 'in-progress',
    notes: 'Хук useState возвращает массив: [state, setState]',
    category: 'frontend'
  },
  { 
    id: 3, 
    title: 'Эффекты (useEffect)', 
    description: 'Работа с API и побочными эффектами', 
    status: 'in-progress',
    notes: 'Использую для загрузки данных и подписок',
    category: 'frontend'
  },
  { 
    id: 4, 
    title: 'React Router', 
    description: 'Навигация между страницами', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 5, 
    title: 'Context API', 
    description: 'Глобальное состояние без пропсов', 
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  { 
    id: 6, 
    title: 'Redux / Zustand', 
    description: 'Продвинутое управление состоянием', 
    status: 'not-started',
    notes: 'Нужно сравнить эти две библиотеки',
    category: 'state-management'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useState([]);

  // Загрузка из localStorage при первом рендере
  useEffect(() => {
    const savedData = localStorage.getItem('techTrackerData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('✅ Данные загружены из localStorage');
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

  // Функция для обновления статуса технологии
  const updateStatus = (techId) => {
    setTechnologies(prev => prev.map(tech => {
      if (tech.id === techId) {
        const statusOrder = ['not-started', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(tech.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...tech, status: statusOrder[nextIndex] };
      }
      return tech;
    }));
  };

  // Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для отметки всех как выполненных
  const markAllAsCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  // Функция для экспорта данных
  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalTechnologies: technologies.length,
      technologies: technologies
    };
    return JSON.stringify(data, null, 2);
  };

  // Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Функция для случайного выбора следующей технологии
  const selectRandomTechnology = () => {
    const notStartedTech = technologies.filter(tech => tech.status === 'not-started');
    if (notStartedTech.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * notStartedTech.length);
    const randomTech = notStartedTech[randomIndex];
    updateStatus(randomTech.id);
    return randomTech;
  };

  // Функция для очистки localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem('techTrackerData');
    setTechnologies(initialTechnologies);
  };

  return {
    technologies,
    setTechnologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    exportData,
    selectRandomTechnology,
    clearLocalStorage,
    progress: calculateProgress(),
    stats: {
      total: technologies.length,
      completed: technologies.filter(t => t.status === 'completed').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      notStarted: technologies.filter(t => t.status === 'not-started').length,
      notesCount: technologies.filter(t => t.notes && t.notes.trim() !== '').length
    }
  };
}

export default useTechnologies;