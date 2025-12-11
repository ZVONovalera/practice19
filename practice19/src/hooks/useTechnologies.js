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

  // 1. Загружаем данные при монтировании
  useEffect(() => {
    console.log('🔍 Загрузка данных из localStorage...');
    
    try {
      const savedData = localStorage.getItem('techTrackerData');
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        console.log('✅ Данные загружены:', parsed.length, 'технологий');
        
        // Нормализуем данные (защита от undefined)
        const normalized = parsed.map(item => ({
          id: item.id || Date.now(),
          title: item.title || 'Без названия',
          description: item.description || '',
          status: item.status || 'not-started',
          notes: String(item.notes || ''), // ГАРАНТИРУЕМ что это строка
          category: item.category || 'uncategorized'
        }));
        
        setTechnologies(normalized);
      } else {
        console.log('📝 Нет сохраненных данных, использую начальные');
        setTechnologies(initialTechnologies);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки:', error);
      console.log('🔄 Использую начальные данные');
      setTechnologies(initialTechnologies);
    }
  }, []);

  // 2. Сохраняем при изменении
  useEffect(() => {
    if (technologies.length > 0) {
      console.log('💾 Сохранение данных...');
      localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    }
  }, [technologies]);

  // 3. Простые функции
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

  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev => prev.map(tech => 
      tech.id === techId ? { ...tech, notes: String(newNotes || '') } : tech
    ));
  };

  const markAllAsCompleted = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'completed' })));
  };

  const resetAllStatuses = () => {
    setTechnologies(prev => prev.map(tech => ({ ...tech, status: 'not-started' })));
  };

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    return JSON.stringify(data, null, 2);
  };

  const selectRandomTechnology = () => {
    const notStarted = technologies.filter(t => t.status === 'not-started');
    if (notStarted.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * notStarted.length);
    return notStarted[randomIndex];
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('techTrackerData');
    setTechnologies(initialTechnologies);
  };

  // 4. Рассчитываем статистику БЕЗОПАСНО
  const progress = technologies.length > 0 
    ? Math.round((technologies.filter(t => t.status === 'completed').length / technologies.length) * 100)
    : 0;

  const stats = {
    total: technologies.length,
    completed: technologies.filter(t => t.status === 'completed').length,
    inProgress: technologies.filter(t => t.status === 'in-progress').length,
    notStarted: technologies.filter(t => t.status === 'not-started').length,
    notesCount: technologies.filter(t => {
      try {
        const notes = t.notes;
        return notes && typeof notes === 'string' && notes.trim().length > 0;
      } catch {
        return false;
      }
    }).length
  };

  return {
    technologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    exportData,
    selectRandomTechnology,
    clearLocalStorage,
    progress,
    stats
  };
}

export default useTechnologies;