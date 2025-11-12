import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';
import '../../styles/gpremium-result.css';

export const GPremiumSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const externalReference = searchParams.get('external_reference');

  useEffect(() => {
    console.log('✅ Pago exitoso:', { paymentId, status, externalReference });
    
    // Esperar 3 segundos y redirigir al home
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, paymentId, status, externalReference]);

  return (
    <div className="gpremium-result-page success">
      <Link className="gpremium-result-logo" to="/home">
        <GLogoLetter />
      </Link>

      <div className="gpremium-result-content">
        <div className="result-icon success">✓</div>
        
        <h1 className="result-title">¡Pago exitoso!</h1>
        
        <p className="result-message">
          Tu suscripción Premium ha sido activada correctamente.
        </p>

        <p className="result-subtitle">
          Ahora puedes disfrutar de todas las funciones ilimitadas de GECO.
        </p>

        <div className="result-details">
          {paymentId && (
            <p className="result-detail">
              <strong>ID de pago:</strong> {paymentId}
            </p>
          )}
          <p className="result-detail">
            <strong>Duración:</strong> 30 días
          </p>
        </div>

        <Link to="/home" className="result-button">
          Ir al inicio
        </Link>

        <p className="result-note">
          Serás redirigido automáticamente en 5 segundos...
        </p>
      </div>
    </div>
  );
};
