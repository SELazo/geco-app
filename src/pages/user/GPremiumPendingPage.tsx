import React from 'react';
import { Link } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';
import '../../styles/gpremium-result.css';

export const GPremiumPendingPage = () => {
  return (
    <div className="gpremium-result-page pending">
      <Link className="gpremium-result-logo" to="/home">
        <GLogoLetter />
      </Link>

      <div className="gpremium-result-content">
        <div className="result-icon pending">⏳</div>
        
        <h1 className="result-title">Pago pendiente</h1>
        
        <p className="result-message">
          Tu pago está siendo procesado.
        </p>

        <p className="result-subtitle">
          Te notificaremos cuando se confirme tu suscripción Premium.
          Esto puede tomar algunos minutos.
        </p>

        <Link to="/home" className="result-button">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
