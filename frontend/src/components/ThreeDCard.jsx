import React, { useRef, useState } from 'react';
import './ThreeDCard.css'; // Import the CSS file

const ThreeDCard = ({ title, content, imageUrl }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    setIsHovered(false);
  };

  return (
    <div className="card-container">
      <div 
        ref={cardRef}
        className="card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-base mb-2">{content}</p>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={title} 
            style={{ 
              width: '100%', 
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '15px',
              marginTop: '15px'
            }} 
          />
        )}
        
      </div>
    </div>
  );
};

export default ThreeDCard;
