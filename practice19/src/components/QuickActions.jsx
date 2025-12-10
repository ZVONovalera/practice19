// src/components/QuickActions.jsx
import './QuickActions.css';

function QuickActions({ 
  markAllAsCompleted, 
  resetAllStatuses, 
  selectRandomTechnology,
  technologies 
}) {
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;
  const allCompleted = technologies.every(t => t.status === 'completed');

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      
      <div className="actions-grid">
        <button 
          className="action-btn complete-all"
          onClick={markAllAsCompleted}
          title="Отметить все технологии как завершенные"
        >
          <span className="action-icon">✅</span>
          <span className="action-text">Завершить все</span>
        </button>
        
        <button 
          className="action-btn reset-all"
          onClick={resetAllStatuses}
          title="Сбросить статусы всех технологий"
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Сбросить все</span>
        </button>
        
        <button 
          className="action-btn random-tech"
          onClick={selectRandomTechnology}
          disabled={notStartedCount === 0}
          title={notStartedCount === 0 ? "Все технологии уже начаты" : "Выбрать случайную технологию для изучения"}
        >
          <span className="action-icon">🎲</span>
          <span className="action-text">
            Случайный выбор
            {notStartedCount > 0 && (
              <span className="count-badge">{notStartedCount}</span>
            )}
          </span>
        </button>
      </div>
      
      <div className="actions-info">
        <p>
          {allCompleted ? (
            <span className="all-completed">🎉 Все технологии изучены! Поздравляем!</span>
          ) : (
            <>
              <span className="not-started-count">Доступно для изучения: <strong>{notStartedCount}</strong> технологий</span>
              {notStartedCount === 0 && (
                <span className="warning-text"> — начните одну из технологий "В процессе"</span>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default QuickActions;