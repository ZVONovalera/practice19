// src/components/Modal.jsx
import './Modal.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        // В компоненте Modal замени:
<div className="modal-header">
  <h3 className="modal-title">{title}</h3>
  <button className="modal-close" onClick={onClose} aria-label="Закрыть">×</button>
</div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;