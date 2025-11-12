import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';
import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack } from '../../constants/buttons';
import { GWhite, GYellow, GBlack } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { PremiumService } from '../../services/external/premiumService';
import { AccountService } from '../../services/external/accountService';
import { FREE_LIMITS, PREMIUM_LIMITS, PREMIUM_PRICE } from '../../interfaces/dtos/external/IPremium';
import '../../styles/gpremium.css';

export const GPremiumPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checkingAccount, setCheckingAccount] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      setCheckingAccount(true);
      const premium = await AccountService.isPremium();
      setIsPremium(premium);
    } catch (error) {
      console.error('Error verificando estado premium:', error);
    } finally {
      setCheckingAccount(false);
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🚀 Iniciando upgrade a premium...');
      
      // Crear preferencia y redirigir a Mercado Pago
      await PremiumService.startPremiumCheckout();
      
    } catch (error: any) {
      console.error('❌ Error al iniciar pago:', error);
      setError(error.message || 'Error al procesar el pago');
      setLoading(false);
    }
  };

  if (checkingAccount) {
    return (
      <div className="gpremium-page">
        <div className="gpremium-header">
          <Link className="gpremium-logo" to="/home">
            <GLogoLetter />
          </Link>
          <GCircularButton
            icon={GIconButtonBack}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
            onClickAction={NavigationService.goBack}
          />
        </div>
        <div className="gpremium-loading">
          <p>Verificando estado de cuenta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gpremium-page">
      {/* Header */}
      <div className="gpremium-header">
        <Link className="gpremium-logo" to="/home">
          <GLogoLetter />
        </Link>
        <GCircularButton
          icon={GIconButtonBack}
          size="1.5em"
          width="50px"
          height="50px"
          colorBackground={GWhite}
          onClickAction={NavigationService.goBack}
        />
      </div>

      {/* Contenido principal */}
      <div className="gpremium-content">
        <h1 className="gpremium-title">
          {isPremium ? '¡Eres Premium!' : 'Mejora tu experiencia'}
        </h1>

        {isPremium ? (
          <div className="gpremium-active">
            <div className="gpremium-badge premium">
              <span>✨ PREMIUM ACTIVO</span>
            </div>
            <p className="gpremium-subtitle">
              Estás disfrutando de todos los beneficios premium
            </p>
          </div>
        ) : (
          <p className="gpremium-subtitle">
            Desbloquea todo el potencial de GECO con Premium
          </p>
        )}

        {/* Comparación de planes */}
        <div className="gpremium-plans">
          {/* Plan FREE */}
          <div className="gpremium-plan-card free">
            <div className="plan-header">
              <h2>FREE</h2>
              <p className="plan-price">$0</p>
            </div>
            <ul className="plan-features">
              <li>
                <span className="feature-icon">✓</span>
                {FREE_LIMITS.strategies} estrategias
              </li>
              <li>
                <span className="feature-icon">✓</span>
                {FREE_LIMITS.images} publicidades
              </li>
              <li>
                <span className="feature-icon">✓</span>
                {FREE_LIMITS.contacts} contactos
              </li>
              <li>
                <span className="feature-icon">✓</span>
                {FREE_LIMITS.groups} grupos
              </li>
            </ul>
          </div>

          {/* Plan PREMIUM */}
          <div className={`gpremium-plan-card premium ${isPremium ? 'active' : ''}`}>
            <div className="plan-header">
              <h2>PREMIUM</h2>
              <p className="plan-price">${PREMIUM_PRICE}<span className="plan-period">/mes</span></p>
            </div>
            <ul className="plan-features">
              <li>
                <span className="feature-icon">✨</span>
                ∞ estrategias ilimitadas
              </li>
              <li>
                <span className="feature-icon">✨</span>
                ∞ publicidades ilimitadas
              </li>
              <li>
                <span className="feature-icon">✨</span>
                ∞ contactos ilimitados
              </li>
              <li>
                <span className="feature-icon">✨</span>
                ∞ grupos ilimitados
              </li>
            </ul>
            
            {!isPremium && (
              <button
                className="premium-button"
                onClick={handleUpgradeToPremium}
                disabled={loading}
              >
                {loading ? 'Procesando...' : `Obtener Premium - $${PREMIUM_PRICE}`}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="gpremium-error">
            <p>{error}</p>
          </div>
        )}

        {/* Beneficios adicionales */}
        <div className="gpremium-benefits">
          <h3>¿Por qué Premium?</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-emoji">🚀</span>
              <h4>Sin límites</h4>
              <p>Crea todas las estrategias y campañas que necesites</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-emoji">📊</span>
              <h4>Análisis avanzado</h4>
              <p>Accede a estadísticas detalladas de tus campañas</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-emoji">⚡</span>
              <h4>Soporte prioritario</h4>
              <p>Ayuda rápida cuando más la necesites</p>
            </div>
            <div className="benefit-item">
              <span className="benefit-emoji">🎨</span>
              <h4>Plantillas exclusivas</h4>
              <p>Acceso a diseños premium para tus publicidades</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
