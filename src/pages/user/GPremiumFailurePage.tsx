import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';
import '../../styles/gpremium-result.css';

export const GPremiumFailurePage = () => {
  const navigate = useNavigate();

  return (
    <div className="gpremium-result-page failure">
      <Link className="gpremium-result-logo" to="/home">
        <GLogoLetter />
      </Link>

      <div className="gpremium-result-content">
        <div className="result-icon failure">✕</div>
        
        <h1 className="result-title">Pago cancelado</h1>
        
        <p className="result-message">
          El proceso de pago fue cancelado o no pudo completarse.
        </p>

        <p className="result-subtitle">
          No te preocupes, no se realizó ningún cargo.
        </p>

        <div className="result-actions">
          <Link to="/premium" className="result-button">
            Intentar nuevamente
          </Link>
          <Link to="/home" className="result-button secondary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};
