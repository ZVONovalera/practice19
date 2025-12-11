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

  // Синхронизируем localNotes при изменении внешних notes
  useEffect(() => {
    if (!isEditingNotes) {
      setLocalNotes(safeNotes);
      setHasUnsavedChanges(false);
    }
  }, [safeNotes, isEditingNotes]);

  // Обработчик клика по карточке (изменение статуса)
  const handleStatusClick = () => {
    setIsAnimating(true);
    if (onStatusToggle) {
      onStatusToggle(safeId);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Обработчик сохранения заметок - ИСПРАВЛЕН!
  const handleNotesSave = (e) => {
  // Предотвращаем поведение по умолчанию (если это форма)
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  
  // Берем ТЕКСТ, а не event
  const notesToSave = localNotes;
  console.log('Saving notes:', notesToSave, 'Type:', typeof notesToSave);
  
  if (onNotesUpdate) {
    // Явно передаем текст
    onNotesUpdate(safeId, notesToSave);
  }
  
  setHasUnsavedChanges(false);
  setIsEditingNotes(false);
};

  // Обработчик отмены редактирования заметок
  const handleNotesCancel = () => {
    setLocalNotes(safeNotes);
    setHasUnsavedChanges(false);
    setIsEditingNotes(false);
  };

  // Обработчик изменения текста заметки
  const handleNotesChange = (e) => {
    const newNotes = e.target.value; // ← Берем значение из textarea
    setLocalNotes(newNotes);
    setHasUnsavedChanges(newNotes !== safeNotes);
  };

  // Получение текста статуса на русском
  const getStatusText = () => {
    switch(safeStatus) {
      case 'not-started': return 'Не начато';
      case 'in-progress': return 'В процессе';
      case 'completed': return 'Завершено';
      default: return 'Неизвестно';
    }
  };

  // Получение иконки статуса
  const getStatusIcon = () => {
    switch(safeStatus) {
      case 'not-started': return '⭕';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      default: return '❓';
    }
  };

  // Проверяем есть ли заметки
  const hasNotes = safeNotes && safeNotes.trim() !== '';

  return (
    <div 
      className={`technology-card ${safeStatus} ${isAnimating ? 'animating' : ''}`}
    >
      <div className="card-header">
        <div className="title-section">
          <h3 
            onClick={handleStatusClick} 
            className="clickable-title"
            title="Нажмите для изменения статуса"
          >
            {safeTitle}
          </h3>
          <span className="tech-id">ID: {safeId}</span>
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
      
      <p className="description">{safeDescription}</p>
      
      {/* Секция заметок */}
      <div className="notes-section">
        <div className="notes-header">
          <h4>📝 Мои заметки:</h4>
          {!isEditingNotes ? (
            <button 
              className="edit-notes-btn"
              onClick={() => setIsEditingNotes(true)}
              aria-label={hasNotes ? "Редактировать заметки" : "Добавить заметки"}
            >
              {hasNotes ? 'Редактировать' : 'Добавить заметку'}
            </button>
          ) : (
            <div className="notes-actions">
              <button 
  className={`save-notes-btn ${hasUnsavedChanges ? 'has-changes' : ''}`}
  onClick={() => handleNotesSave()} // ← Прямой вызов без параметров
  disabled={!hasUnsavedChanges}
  title={hasUnsavedChanges ? "Сохранить изменения" : "Нет изменений для сохранения"}
>
  {hasUnsavedChanges ? '💾 Сохранить' : '✓ Сохранено'}
</button>
              <button 
                className="cancel-notes-btn"
                onClick={handleNotesCancel}
                disabled={!hasUnsavedChanges}
                title={hasUnsavedChanges ? "Отменить изменения" : "Нет изменений для отмены"}
              >
                {hasUnsavedChanges ? '✕ Отмена' : '✕ Закрыть'}
              </button>
            </div>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="notes-editor">
            <textarea
              className="notes-textarea"
              value={localNotes}
              onChange={handleNotesChange} // ← Используем правильный обработчик
              placeholder="Записывайте сюда важные моменты, ссылки, идеи..."
              rows="4"
              autoFocus
              maxLength="1000"
            />
            <div className="notes-counter">
              {localNotes.length}/1000 символов
              {hasUnsavedChanges && <span className="unsaved-indicator"> *не сохранено</span>}
            </div>
          </div>
        ) : (
          <div 
            className={`notes-preview clickable ${hasNotes ? 'has-notes' : 'empty'}`}
            onClick={() => setIsEditingNotes(true)}
            title={hasNotes ? "Нажмите для редактирования" : "Нажмите для добавления заметки"}
          >
            {hasNotes ? (
              <div className="notes-content">
                {safeNotes.length > 150 ? `${safeNotes.substring(0, 150)}...` : safeNotes}
                {safeNotes.length > 150 && <span className="read-more"> [читать далее]</span>}
              </div>
            ) : (
              <div className="notes-empty">
                <em>Нажмите, чтобы добавить заметку...</em>
              </div>
            )}
          </div>
        )}
        
        <div className="notes-info">
          {hasNotes ? (
            <>
              <span className="notes-length">{safeNotes.length} символов</span>
              <span className="notes-saved">💾 Автосохранено</span>
            </>
          ) : (
            <span className="notes-empty-hint">Заметки будут сохранены в localStorage</span>
          )}
        </div>
      </div>
      
      <div className="card-footer">
        <div className="last-updated">
          Статус: <span className={`status-text ${safeStatus}`}>{getStatusText()}</span>
        </div>
        <div className="card-actions">
          <button 
            className="action-btn quick-status"
            onClick={handleStatusClick}
            aria-label="Сменить статус технологии"
          >
            🔄 Сменить статус
          </button>
        </div>
      </div>
    </div>
  );
}

export default TechnologyCard;