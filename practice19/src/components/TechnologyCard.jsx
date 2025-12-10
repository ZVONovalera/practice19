// src/components/TechnologyCard.jsx
import { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusToggle, onNotesUpdate }) {
  const { id, title, description, status, notes } = technology;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(notes || '');

  // Обработчик клика по карточке (изменение статуса)
  const handleStatusClick = () => {
    setIsAnimating(true);
    onStatusToggle(id);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Обработчик сохранения заметок
  const handleNotesSave = () => {
    onNotesUpdate(id, localNotes);
    setIsEditingNotes(false);
  };

  // Обработчик отмены редактирования заметок
  const handleNotesCancel = () => {
    setLocalNotes(notes || '');
    setIsEditingNotes(false);
  };

  // Получение текста статуса на русском
  const getStatusText = () => {
    switch(status) {
      case 'not-started': return 'Не начато';
      case 'in-progress': return 'В процессе';
      case 'completed': return 'Завершено';
      default: return status;
    }
  };

  // Получение иконки статуса
  const getStatusIcon = () => {
    switch(status) {
      case 'not-started': return '⭕';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      default: return '';
    }
  };

  return (
    <div 
      className={`technology-card ${status} ${isAnimating ? 'animating' : ''}`}
    >
      <div className="card-header">
        <div className="title-section">
          <h3 onClick={handleStatusClick} className="clickable-title">{title}</h3>
          <span className="tech-id">ID: {id}</span>
        </div>
        
        <div 
          className="status-indicator clickable"
          onClick={handleStatusClick}
          title={`Нажмите для смены статуса (${getStatusText()})`}
        >
          <span className="status-badge">
            {getStatusIcon()} {getStatusText()}
          </span>
          <div className="status-hint">👆 Клик для смены</div>
        </div>
      </div>
      
      <p className="description">{description}</p>
      
      {/* Секция заметок */}
      <div className="notes-section">
        <div className="notes-header">
          <h4>📝 Мои заметки:</h4>
          {!isEditingNotes ? (
            <button 
              className="edit-notes-btn"
              onClick={() => setIsEditingNotes(true)}
            >
              {notes ? 'Редактировать' : 'Добавить заметку'}
            </button>
          ) : (
            <div className="notes-actions">
              <button 
                className="save-notes-btn"
                onClick={handleNotesSave}
              >
                💾 Сохранить
              </button>
              <button 
                className="cancel-notes-btn"
                onClick={handleNotesCancel}
              >
                ✕ Отмена
              </button>
            </div>
          )}
        </div>
        
        {isEditingNotes ? (
          <textarea
            className="notes-textarea"
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            placeholder="Записывайте сюда важные моменты, ссылки, идеи..."
            rows="4"
            autoFocus
          />
        ) : (
          <div 
            className="notes-preview clickable"
            onClick={() => setIsEditingNotes(true)}
          >
            {notes ? (
              <div className="notes-content">
                {notes.length > 150 ? `${notes.substring(0, 150)}...` : notes}
              </div>
            ) : (
              <div className="notes-empty">
                <em>Нажмите, чтобы добавить заметку...</em>
              </div>
            )}
          </div>
        )}
        
        <div className="notes-info">
          {notes ? (
            <>
              <span className="notes-length">{notes.length} символов</span>
              <span className="notes-saved">💾 Автосохранено</span>
            </>
          ) : (
            <span className="notes-empty-hint">Заметки будут сохранены в localStorage</span>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <div className="last-updated">
          Статус: <span className={`status-text ${status}`}>{getStatusText()}</span>
        </div>
        <div className="card-actions">
          <button 
            className="action-btn quick-status"
            onClick={handleStatusClick}
          >
            🔄 Сменить статус
          </button>
        </div>
      </div>
    </div>
  );
}

export default TechnologyCard;