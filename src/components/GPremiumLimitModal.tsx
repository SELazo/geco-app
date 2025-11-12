import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/gpremium-limit-modal.css';

interface IPremiumLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'strategies' | 'images' | 'contacts' | 'groups';
  currentCount: number;
  limit: number;
}

const FEATURE_MESSAGES = {
  strategies: {
    title: '📊 Límite de Estrategias Alcanzado',
    description: 'Has alcanzado el límite de 5 estrategias en el plan FREE.',
    premiumText: 'Con Premium, crea estrategias ilimitadas para potenciar tu negocio.'
  },
  images: {
    title: '🎨 Límite de Publicidades Alcanzado',
    description: 'Has alcanzado el límite de 10 publicidades en el plan FREE.',
    premiumText: 'Con Premium, diseña publicidades ilimitadas para tus campañas.'
  },
  contacts: {
    title: '📇 Límite de Contactos Alcanzado',
    description: 'Has alcanzado el límite de 50 contactos en el plan FREE.',
    premiumText: 'Con Premium, gestiona contactos ilimitados sin restricciones.'
  },
  groups: {
    title: '👥 Límite de Grupos Alcanzado',
    description: 'Has alcanzado el límite de 3 grupos en el plan FREE.',
    premiumText: 'Con Premium, organiza tus contactos en grupos ilimitados.'
  }
};

export const GPremiumLimitModal: React.FC<IPremiumLimitModalProps> = ({
  isOpen,
  onClose,
  feature,
  currentCount,
  limit
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/premium');
  };

  if (!isOpen) return null;

  const message = FEATURE_MESSAGES[feature];

  return (
    <div className="gpremium-limit-modal-overlay" onClick={onClose}>
      <div className="gpremium-limit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-icon">⚠️</div>
        
        <h2 className="modal-title">{message.title}</h2>
        
        <p className="modal-description">{message.description}</p>
        
        <div className="modal-limit-info">
          <span className="limit-current">{currentCount}</span>
          <span className="limit-separator">/</span>
          <span className="limit-max">{limit}</span>
          <span className="limit-label">usados</span>
        </div>

        <div className="modal-premium-box">
          <div className="premium-badge">✨ PREMIUM</div>
          <p className="premium-text">{message.premiumText}</p>
        </div>

        <div className="modal-actions">
          <button className="btn-upgrade" onClick={handleUpgrade}>
            Actualizar a Premium - $1500/mes
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};
