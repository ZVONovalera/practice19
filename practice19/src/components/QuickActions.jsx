// src/components/QuickActions.jsx
import './QuickActions.css';

function QuickActions({ 
  markAllAsCompleted, 
  resetAllStatuses, 
  selectRandomTechnology,
  technologies,
  clearLocalStorage  // Добавлен новый пропс
}) {
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;
  const allCompleted = technologies.every(t => t.status === 'completed');
  const hasSavedNotes = technologies.some(t => t.notes && t.notes.trim() !== '');

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

        {/* Новая кнопка для очистки localStorage */}
        <button 
          className="action-btn clear-storage"
          onClick={clearLocalStorage}
          disabled={technologies.length === 0}
          title={hasSavedNotes ? "Очистить все сохраненные данные (включая заметки)" : "Очистить сохраненные данные"}
        >
          <span className="action-icon">🗑️</span>
          <span className="action-text">
            Очистить хранилище
            {hasSavedNotes && (
              <span className="notes-badge" title="Есть сохраненные заметки">📝</span>
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
        
        {/* Информация о сохраненных данных */}
        <div className="storage-info">
          <span className="storage-icon">💾</span>
          <span className="storage-text">
            Данные сохраняются автоматически. 
            {hasSavedNotes && (
              <span className="notes-info"> Заметки: {technologies.filter(t => t.notes && t.notes.trim() !== '').length} шт.</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;