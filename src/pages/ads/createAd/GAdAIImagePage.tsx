import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdImg } from '../../../redux/sessionSlice';
import { RootState } from '../../../redux/gecoStore';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';
import { GSubmitButton } from '../../../components/GSubmitButton';

import { GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { ROUTES } from '../../../constants/routes';
import { pollinationsService } from '../../../services/external/pollinationsService';
import { PacmanLoader } from 'react-spinners';

export const GAdAIImagePage = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formNewAd = useSelector((state: RootState) => state.formNewAd);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor, escribe una descripción de la imagen que deseas generar');
      return;
    }

    // Pollinations no requiere configuración (siempre disponible)
    // El servicio está siempre listo para usar

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      console.log('🎨 Iniciando generación de imagen con IA...');
      
      // Mejorar el prompt para publicidades
      const enhancedPrompt = pollinationsService.enhancePromptForAd(prompt);
      
      // Determinar tamaño basado en el tamaño seleccionado de la publicidad
      const adSize = formNewAd.size || '1080x1080';
      let imageSize: '256x256' | '512x512' | '1024x1024' | '1024x1792' | '1792x1024' = '1024x1024';
      
      // Mapear tamaño de publicidad a tamaño de imagen DALL-E
      if (adSize.includes('1920')) {
        imageSize = '1792x1024'; // Horizontal para redes sociales
      } else if (adSize.includes('1080')) {
        imageSize = '1024x1024'; // Cuadrado
      }

      const result = await pollinationsService.generateImage({
        prompt: enhancedPrompt,
        size: imageSize,
        quality: 'standard',
        n: 1
      });

      if (!result.success || !result.imageBase64) {
        throw new Error(result.error || 'No se pudo generar la imagen');
      }

      console.log('✅ Imagen generada exitosamente');
      setGeneratedImage(result.imageBase64);
      
    } catch (err) {
      console.error('❌ Error al generar imagen:', err);
      setError(err instanceof Error ? err.message : 'Error al generar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const handleUseImage = () => {
    if (!generatedImage) {
      setError('No hay imagen generada para usar');
      return;
    }

    console.log('✅ Usando imagen generada por IA');
    
    // Guardar la imagen en Redux
    dispatch(setNewAdImg(generatedImage));

    // Navegar al siguiente paso (Generación de publicidad)
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.AD_GENERATION}`,
      { state: generatedImage }
    );
  };

  const handleRegenerate = () => {
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link className="geco-add-contact-excel-nav-bar-section" to="/ad">
            <GCircularButton
              icon={GAdIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
            />
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
      </div>

      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title="🎨 Generar imagen con IA (GRATIS)"
          subtitle="Describe la imagen que deseas generar para tu publicidad"
        />
      </div>

      <div className="geco-form" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {!generatedImage ? (
          <>
            {/* Input para el prompt */}
            <div className="geco-input-box" style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Describe tu imagen:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Un gato con gafas de sol bebiendo café en una playa al atardecer, estilo fotográfico profesional"
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                disabled={loading}
              />
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                💡 Tip: Sé específico sobre colores, estilo, ambiente y detalles que quieres ver
              </p>
            </div>

            {/* Botón para generar */}
            <div style={{ textAlign: 'center' }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <PacmanLoader color="#FFD700" size={25} />
                  <p style={{ fontSize: '16px', color: '#666' }}>
                    Generando tu imagen con IA... Esto puede tomar 5-15 segundos
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleGenerateImage}
                  style={{
                    padding: '15px 40px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#FFD700',
                    color: '#000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  🎨 Generar imagen
                </button>
              )}
            </div>

            {/* Mostrar error */}
            {error && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#fee',
                border: '2px solid #fcc',
                borderRadius: '8px',
                color: '#c33'
              }}>
                <strong>❌ Error:</strong> {error}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Mostrar imagen generada */}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '15px' }}>✅ ¡Imagen generada exitosamente!</h3>
              
              <div style={{
                maxWidth: '600px',
                margin: '0 auto 20px',
                border: '3px solid #4CAF50',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <img
                  src={generatedImage}
                  alt="Imagen generada por IA"
                  style={{ width: '100%', display: 'block' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleUseImage}
                  style={{
                    padding: '15px 40px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  ✅ Usar esta imagen
                </button>
                <button
                  onClick={handleRegenerate}
                  style={{
                    padding: '15px 40px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    border: '2px solid #666',
                    backgroundColor: 'white',
                    color: '#666',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  🔄 Generar otra imagen
                </button>
              </div>

              <p style={{ fontSize: '14px', color: '#666', marginTop: '15px' }}>
                Si la imagen no te convence, puedes generar otra con un prompt diferente
              </p>
            </div>
          </>
        )}

        {/* Información adicional */}
        {!loading && !generatedImage && (
          <div style={{
            marginTop: '30px',
            padding: '15px',
            backgroundColor: '#f0f8ff',
            border: '2px solid #4a9eff',
            borderRadius: '8px'
          }}>
            <h4 style={{ marginTop: 0 }}>📝 Ejemplos de prompts efectivos:</h4>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>Un producto de café premium sobre una mesa de madera con granos de café, iluminación cálida</li>
              <li>Perro Golden Retriever feliz corriendo en un parque verde, fotografía profesional</li>
              <li>Auto deportivo rojo en una carretera de montaña al amanecer, vista dinámica</li>
              <li>Plato de comida gourmet elegantemente presentado, fotografía de comida profesional</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
