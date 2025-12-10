// src/App.jsx
import './App.css';
import Card from './components/TechnologyCard';

function App() {
  const technologies = [
    { id: 1, title: 'React + JSX', description: 'Базовые компоненты, JSX, props', status: 'completed' },
    { id: 2, title: 'Состояние (useState)', description: 'Управление состоянием в функциональных компонентах', status: 'in-progress' },
    { id: 3, title: 'Эффекты (useEffect)', description: 'Работа с API и побочными эффектами', status: 'in-progress' },
    { id: 4, title: 'React Router', description: 'Навигация между страницами', status: 'not-started' },
    { id: 5, title: 'Context API', description: 'Глобальное состояние без пропсов', status: 'not-started' },
    { id: 6, title: 'Redux / Zustand', description: 'Продвинутое управление состоянием', status: 'not-started' }
  ];

  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const progress = Math.round((completedCount / technologies.length) * 100);

  return (
    <div className="App">
      <h1>Трекер изучения технологий</h1>
      
      <div className="progress-container">
        <div className="progress-bar" style={{width: `${progress}%`}}>
          {completedCount} из {technologies.length} — {progress}%
        </div>
      </div>

      {technologies.map(tech => (
        <Card
          key={tech.id}
          title={tech.title}
          description={tech.description}
          status={tech.status}
        />
      ))}
    </div>
  );
}

export default App;