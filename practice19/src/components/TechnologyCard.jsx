// src/components/TechnologyCard.jsx
import { useState, useEffect } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ technology, onStatusToggle }) {
  const { id, title, description, status } = technology;
  const [isAnimating, setIsAnimating] = useState(false);

  // Обработчик клика по карточке
  const handleClick = () => {
    setIsAnimating(true);
    onStatusToggle(id);
    
    // Сброс анимации через 300ms
    setTimeout(() => setIsAnimating(false), 300);
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
      onClick={handleClick}
      title={`Нажмите для смены статуса (${getStatusText()})`}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="status-badge">
          {getStatusIcon()} {getStatusText()}
        </span>
      </div>
      
      <p className="description">{description}</p>
      
      <div className="card-footer">
        <span className="tech-id">ID: {id}</span>
        <div className="status-indicator">
          <div className={`status-dot ${status}`}></div>
        </div>
      </div>
      
      <div className="click-hint">
        👆 Нажмите для изменения статуса
      </div>
    </div>
  );
}

export default TechnologyCard;