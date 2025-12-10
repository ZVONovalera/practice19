// src/components/Statistics.jsx
import './Statistics.css';

function Statistics({ technologies }) {
  // Подсчет статистики
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  
  const progressPercentage = Math.round((completed / total) * 100);
  
  // Находим самую частую категорию (статус)
  const statusCounts = { completed, 'in-progress': inProgress, 'not-started': notStarted };
  const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) => 
    statusCounts[a] > statusCounts[b] ? a : b
  );

  const getStatusName = (status) => {
    switch(status) {
      case 'not-started': return 'Не начато';
      case 'in-progress': return 'В процессе';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  return (
    <div className="statistics">
      <div className="stats-header">
        <h2>📊 Статистика прогресса</h2>
        <div className="progress-percentage">
          <span className="percentage-value">{progressPercentage}%</span>
          <span className="percentage-label">завершено</span>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Всего технологий</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value completed">{completed}</div>
          <div className="stat-label">Завершено</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value in-progress">{inProgress}</div>
          <div className="stat-label">В процессе</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value not-started">{notStarted}</div>
          <div className="stat-label">Не начато</div>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        >
          <span className="progress-text">
            {completed} из {total}
          </span>
        </div>
      </div>
      
      <div className="additional-stats">
        <div className="additional-stat">
          <span className="stat-icon">🎯</span>
          <span>Самый частый статус: <strong>{getStatusName(mostCommonStatus)}</strong></span>
        </div>
        <div className="additional-stat">
          <span className="stat-icon">⏳</span>
          <span>Осталось изучить: <strong>{notStarted + inProgress}</strong> технологий</span>
        </div>
      </div>
    </div>
  );
}

export default Statistics;