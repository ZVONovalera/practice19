
import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ 
  markAllAsCompleted, 
  resetAllStatuses, 
  selectRandomTechnology,
  technologies,
  clearLocalStorage,
  exportData
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportedData, setExportedData] = useState('');
  
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;
  const allCompleted = technologies.every(t => t.status === 'completed');
  const hasSavedNotes = technologies.some(t => t.notes && t.notes.trim() !== '');

  const handleExport = () => {
    try {
      const data = exportData();
      setExportedData(data);
      
      
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowExportModal(true);
    } catch (error) {
      alert('Ошибка при экспорте данных: ' + error.message);
    }
  };

  const handleClearStorage = () => {
    if (window.confirm('Вы уверены? Все сохраненные данные будут удалены.')) {
      clearLocalStorage();
      alert('Данные очищены!');
    }
  };

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      
      <div className="actions-grid">
        <button 
          className="action-btn complete-all"
          onClick={markAllAsCompleted}
          title="Отметить все технологии как завершенные"
        >
          <span className="action-icon">✓</span>
          <span className="action-text">Завершить все</span>
        </button>
        
        <button 
          className="action-btn reset-all"
          onClick={resetAllStatuses}
          title="Сбросить статусы всех технологий"
        >
          <span className="action-icon">↻</span>
          <span className="action-text">Сбросить все</span>
        </button>
        
        <button 
          className="action-btn random-tech"
          onClick={selectRandomTechnology}
          disabled={notStartedCount === 0}
          title={notStartedCount === 0 ? "Все технологии уже начаты" : "Выбрать случайную технологию для изучения"}
        >
          <span className="action-icon">↻?</span>
          <span className="action-text">
            Случайный выбор
            {notStartedCount > 0 && (
              <span className="count-badge">{notStartedCount}</span>
            )}
          </span>
        </button>

        <button 
          className="action-btn export-data"
          onClick={handleExport}
          disabled={technologies.length === 0}
          title="Экспортировать все данные в JSON файл"
        >
          <span className="action-icon">⇪</span>
          <span className="action-text">Экспорт</span>
        </button>

        <button 
          className="action-btn clear-storage"
          onClick={handleClearStorage}
          disabled={technologies.length === 0}
          title={hasSavedNotes ? "Очистить все сохраненные данные" : "Очистить сохраненные данные"}
        >
          <span className="action-icon">×</span>
          <span className="action-text">
            Очистить
            {hasSavedNotes && (
              <span className="notes-badge" title="Есть сохраненные заметки">!</span>
            )}
          </span>
        </button>
      </div>
      
      <div className="actions-info">
        <p>
          {allCompleted ? (
            <span className="all-completed">Все технологии изучены</span>
          ) : (
            <>
              <span className="not-started-count">Доступно для изучения: <strong>{notStartedCount}</strong> технологий</span>
              {notStartedCount === 0 && (
                <span className="warning-text"> — начните одну из технологий в процессе</span>
              )}
            </>
          )}
        </p>
        
        <div className="storage-info">
          <span className="storage-icon"></span>
          <span className="storage-text">
            Данные сохраняются автоматически
            {hasSavedNotes && (
              <span className="notes-info"> • Заметок: {technologies.filter(t => t.notes && t.notes.trim() !== '').length}</span>
            )}
          </span>
        </div>
      </div>

      {/* Модальное окно экспорта */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных завершен"
      >
        <div className="export-modal-content">
          <p>Данные успешно экспортированы в JSON файл.</p>
          <p>Файл автоматически загружен в ваше устройство.</p>
          
          <div className="export-stats">
            <h4>Статистика экспорта:</h4>
            <ul>
              <li>Всего технологий: <strong>{technologies.length}</strong></li>
              <li>Завершено: <strong>{technologies.filter(t => t.status === 'completed').length}</strong></li>
              <li>В процессе: <strong>{technologies.filter(t => t.status === 'in-progress').length}</strong></li>
              <li>Не начато: <strong>{notStartedCount}</strong></li>
              <li>С заметками: <strong>{technologies.filter(t => t.notes && t.notes.trim() !== '').length}</strong></li>
            </ul>
          </div>
          
          <div className="modal-actions">
            <button 
              className="modal-btn copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(exportedData);
                alert('Данные скопированы в буфер обмена!');
              }}
            >
              Копировать JSON
            </button>
            <button 
              className="modal-btn close-btn"
              onClick={() => setShowExportModal(false)}
            >
              Закрыть
            </button>
          </div>
          
          <div className="export-hint">
            <small>Файл содержит все данные из трекера, включая статусы и заметки.</small>
          </div>
        </div>
      </Modal>
    </div>
  );
}


export default QuickActions;