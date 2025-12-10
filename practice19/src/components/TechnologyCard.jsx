// src/components/TechnologyCard.jsx

function Card({ title, description, status }) {
  const statusText = 
    status === 'completed' ? 'Завершено' :
    status === 'in-progress' ? 'В процессе' : 'Не начато';

  const statusIcon = 
    status === 'completed' ? 'Checkmark' :
    status === 'in-progress' ? 'In progress' : 'Cross';

  return (
    <div className={`tech-card ${status}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="status">
        <strong>Статус:</strong> {statusIcon} {statusText}
      </p>
    </div>
  );
}

export default Card;