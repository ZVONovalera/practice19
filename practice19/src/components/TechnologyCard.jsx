// src/components/TechnologyCard.jsx
import { useState, useEffect } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusToggle, onNotesUpdate }) {
  // Защита от undefined технологии
  if (!technology) {
    return (
      <div className="technology-card error">
        <div className="card-header">
          <h3>Ошибка загрузки карточки</h3>
        </div>
        <p>Не удалось загрузить данные технологии</p>
      </div>
    );
  }

  const { id, title, description, status, notes } = technology;
  
  // Защита от undefined значений
  const safeId = id || Date.now();
  const safeTitle = title || 'Без названия';
  const safeDescription = description || 'Описание отсутствует';
  const safeStatus = status || 'not-started';
  const safeNotes = notes || '';
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [localNotes, setLocalNotes] = useState(safeNotes);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Синхронизация заметок
  useEffect(() => {
    if (!isEditingNotes) {
      setLocalNotes(safeNotes);
      setHasUnsavedChanges(false);
    }
  }, [safeNotes, isEditingNotes]);

  // Обработчик изменения статуса
  const handleStatusClick = () => {
    setIsAnimating(true);
    if (onStatusToggle) {
      onStatusToggle(safeId);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Сохранение заметок
  const handleNotesSave = () => {
    if (onNotesUpdate) {
      onNotesUpdate(safeId, localNotes);
    }
    setHasUnsavedChanges(false);
    setIsEditingNotes(false);
  };

  // Отмена редактирования
  const handleNotesCancel = () => {
    setLocalNotes(safeNotes);
    setHasUnsavedChanges(false);
    setIsEditingNotes(false);
  };

  // Изменение текста заметки
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setLocalNotes(newNotes);
    setHasUnsavedChanges(newNotes !== safeNotes);
  };

  // Текст статуса
  const getStatusText = () => {
    switch(safeStatus) {
      case 'not-started': return 'Не начато';
      case 'in-progress': return 'В процессе';
      case 'completed': return 'Завершено';
      default: return 'Неизвестно';
    }
  };

  // Иконка статуса
  const getStatusIcon = () => {
    switch(safeStatus) {
      case 'not-started': return '○';
      case 'in-progress': return '↻';
      case 'completed': return '✓';
      default: return '?';
    }
  };

  // Проверка наличия заметок
  const hasNotes = safeNotes && safeNotes.trim() !== '';

  return (
    <div className={`technology-card ${safeStatus} ${isAnimating ? 'animating' : ''}`}>
      <div className="card-header">
        <div className="title-section">
          <h3 onClick={handleStatusClick} title="Нажмите для изменения статуса">
            {safeTitle}
          </h3>
          <span className="tech-id">#{safeId}</span>
        </div>
        
        <div className="status-indicator" onClick={handleStatusClick} title="Нажмите для смены статуса">
          <span className="status-badge">
            <span>{getStatusIcon()}</span>
            <span>{getStatusText()}</span>
          </span>
        </div>
      </div>
      
      <p className="description">{safeDescription}</p>
      
      {/* Секция заметок */}
      <div className="notes-section">
        <div className="notes-header">
          <h4>📝 Заметки</h4>
          {!isEditingNotes ? (
            <button className="edit-notes-btn" onClick={() => setIsEditingNotes(true)}>
              {hasNotes ? 'Редактировать' : 'Добавить'}
            </button>
          ) : (
            <div className="notes-actions">
              <button 
                className={`save-notes-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
                onClick={handleNotesSave}
                disabled={!hasUnsavedChanges}
              >
                {hasUnsavedChanges ? 'Сохранить' : 'Сохранено'}
              </button>
              <button 
                className="cancel-notes-btn"
                onClick={handleNotesCancel}
                disabled={!hasUnsavedChanges}
              >
                {hasUnsavedChanges ? 'Отмена' : 'Закрыть'}
              </button>
            </div>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="notes-editor">
            <textarea
              className="notes-textarea"
              value={localNotes}
              onChange={handleNotesChange}
              placeholder="Записывайте важные моменты, ссылки, идеи..."
              rows="3"
              autoFocus
              maxLength="500"
            />
            <div className="notes-counter">
              {localNotes.length}/500 символов
              {hasUnsavedChanges && <span className="unsaved-indicator"> • не сохранено</span>}
            </div>
          </div>
        ) : (
          <div className="notes-preview" onClick={() => setIsEditingNotes(true)}>
            {hasNotes ? (
              <div className="notes-content">
                {safeNotes.length > 100 ? `${safeNotes.substring(0, 100)}...` : safeNotes}
                {safeNotes.length > 100 && <span className="read-more">ещё</span>}
              </div>
            ) : (
              <div className="notes-empty">
                Нажмите, чтобы добавить заметку...
              </div>
            )}
          </div>
        )}
        
        {hasNotes && (
          <div className="notes-info">
            <span className="notes-length">{safeNotes.length} симв.</span>
            <span className="notes-saved">✓ сохранено</span>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="last-updated">
          Статус: <span className={`status-text ${safeStatus}`}>{getStatusText()}</span>
        </div>
        <button className="action-btn" onClick={handleStatusClick} title="Сменить статус">
          Сменить
        </button>
      </div>
    </div>
  );
}

export default TechnologyCard;