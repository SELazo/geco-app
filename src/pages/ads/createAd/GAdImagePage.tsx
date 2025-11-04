import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdImg } from '../../../redux/sessionSlice';
import { RootState } from '../../../redux/gecoStore';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';
import '../../../styles/gadimage.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GAdIcon,
  GIconButtonBack,
  GDeletetIcon,
} from '../../../constants/buttons';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GErrorPopup } from '../../../components/GErrorPopup';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { ROUTES } from '../../../constants/routes';
import { pollinationsService } from '../../../services/external/pollinationsService';
import { PacmanLoader } from 'react-spinners';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const GAdImagePage = () => {
  const formNewAd = useSelector((state: RootState) => state.formNewAd);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'ai' | 'own'>('own');

  // Estados para imagen propia
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [requestError, setRequestError] = useState(false);

  // Estados para IA
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!formNewAd || !formNewAd.size) {
      navigate(`${ROUTES.AD.ROOT}`);
      return;
    }
  }, [formNewAd]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && verifyFile(file)) {
      setSelectedFile(file);
    }
  };

  const verifyFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('El archivo es muy grande. Máximo 5MB.');
      setRequestError(true);
      return false;
    }
    return true;
  };

  const handleUseOwnImage = () => {
    if (!selectedFile) {
      setFileError('Por favor selecciona una imagen.');
      setRequestError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      dispatch(setNewAdImg(base64));
      navigate(
        `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.CONTENT_BUILDER}`
      );
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError('Por favor, escribe una descripción de la imagen.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const enhancedPrompt = pollinationsService.enhancePromptForAd(prompt);

      const adSize = formNewAd.size || '1080x1080';
      let imageSize:
        | '256x256'
        | '512x512'
        | '1024x1024'
        | '1024x1792'
        | '1792x1024' = '1024x1024';

      if (adSize.includes('1920')) {
        imageSize = '1792x1024';
      } else if (adSize.includes('1080')) {
        imageSize = '1024x1024';
      }

      const result = await pollinationsService.generateImage({
        prompt: enhancedPrompt,
        size: imageSize,
        quality: 'standard',
        n: 1,
      });

      if (!result.success || !result.imageBase64) {
        throw new Error(result.error || 'No se pudo generar la imagen');
      }

      setGeneratedImage(result.imageBase64);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al generar la imagen'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseAIImage = () => {
    if (!generatedImage) {
      setError('No hay imagen generada para usar');
      return;
    }

    dispatch(setNewAdImg(generatedImage));
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.CONTENT_BUILDER}`
    );
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
          title="Elige o crea tu imagen"
          subtitle="Sube tu propia imagen o genera una con inteligencia artificial"
        />
      </div>

      <div
        className="geco-form"
        style={{ maxWidth: '900px', margin: '0 auto' }}
      >
        {/* Tabs */}
        <div
          style={{
            borderBottom: '3px solid #18191f',
            marginBottom: 24,
            display: 'flex',
            gap: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setMode('own')}
            style={{
              padding: '14px 28px',
              border: '2px solid #18191f',
              borderBottom: 'none',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              background: mode === 'own' ? '#FFD21E' : '#f5f5f5',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              color: mode === 'own' ? '#18191f' : '#6B7280',
              transition: 'all 0.2s ease',
              position: 'relative',
              marginBottom: '-3px',
              boxShadow: mode === 'own' ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📤 Mi imagen
          </button>
          <button
            type="button"
            onClick={() => setMode('ai')}
            style={{
              padding: '14px 28px',
              border: '2px solid #18191f',
              borderBottom: 'none',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              background: mode === 'ai' ? '#FFD21E' : '#f5f5f5',
              fontWeight: 700,
              fontSize: '16px',
              cursor: 'pointer',
              color: mode === 'ai' ? '#18191f' : '#6B7280',
              transition: 'all 0.2s ease',
              position: 'relative',
              marginBottom: '-3px',
              boxShadow: mode === 'ai' ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🎨 Generar con IA
          </button>
        </div>

        {/* Contenido según modo */}
        {mode === 'own' ? (
          <div
            style={{
              border: '2px solid #18191f',
              borderRadius: '12px',
              padding: '24px',
              background: '#fff',
              boxShadow: '0 2px 0 #18191f',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              Sube tu imagen
            </h3>

            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label
                htmlFor="file-upload"
                className="custom-file-upload"
                style={{
                  width: '100%',
                  display: 'block',
                  textAlign: 'center',
                }}
              >
                {selectedFile ? 'Cambiar imagen' : '📁 Seleccionar archivo'}
              </label>
              <input
                id="file-upload"
                name="file"
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple={false}
                onChange={handleFileChange}
                className="input-box-excel form-control"
              />
            </div>

            {selectedFile && (
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div
                  style={{
                    maxWidth: '400px',
                    margin: '0 auto',
                    border: '2px solid #18191f',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Vista previa"
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>
                <p
                  style={{
                    marginTop: '8px',
                    color: '#9FA4B4',
                    fontSize: '14px',
                  }}
                >
                  {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            <button
              onClick={handleUseOwnImage}
              type="button"
              disabled={!selectedFile}
              style={{
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                borderRadius: '8px',
                border: '2px solid #18191f',
                backgroundColor: selectedFile ? '#FFD21E' : '#e5e7eb',
                color: '#18191f',
                cursor: selectedFile ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                boxShadow: selectedFile ? '0 2px 0 #18191f' : 'none',
              }}
            >
              Continuar con esta imagen
            </button>

            <p
              style={{
                marginTop: '12px',
                fontSize: '14px',
                color: '#9FA4B4',
                textAlign: 'center',
              }}
            >
              Formatos: JPG, PNG • Tamaño máximo: 5MB
            </p>
          </div>
        ) : (
          <div
            style={{
              border: '2px solid #18191f',
              borderRadius: '12px',
              padding: '24px',
              background: '#fff',
              boxShadow: '0 2px 0 #18191f',
            }}
          >
            {!generatedImage ? (
              <>
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: 700,
                  }}
                >
                  Genera una imagen con IA
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: 600,
                    }}
                  >
                    Describe la imagen que quieres:
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ej: Un café humeante sobre una mesa de madera, luz natural, estilo profesional"
                    style={{
                      width: '100%',
                      minHeight: '100px',
                      padding: '12px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '2px solid #cfd3dc',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                    disabled={loading}
                  />
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#9FA4B4',
                      marginTop: '6px',
                    }}
                  >
                    💡 Sé específico: menciona colores, estilos, ambiente y
                    detalles importantes
                  </p>
                </div>

                {loading ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '30px 0',
                    }}
                  >
                    <PacmanLoader color="#FFD21E" size={25} />
                    <p style={{ fontSize: '16px', color: '#9FA4B4' }}>
                      Generando tu imagen... Esto puede tomar 5-15 segundos
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateImage}
                    type="button"
                    style={{
                      width: '100%',
                      padding: '15px',
                      fontSize: '18px',
                      borderRadius: '8px',
                      border: '2px solid #18191f',
                      backgroundColor: '#FFD21E',
                      color: '#18191f',
                      cursor: 'pointer',
                      fontWeight: 700,
                      boxShadow: '0 2px 0 #18191f',
                    }}
                  >
                    🎨 Generar imagen
                  </button>
                )}

                {error && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: '#fee',
                      border: '2px solid #fcc',
                      borderRadius: '8px',
                      color: '#c33',
                    }}
                  >
                    <strong>❌ Error:</strong> {error}
                  </div>
                )}

                <div
                  style={{
                    marginTop: '20px',
                    padding: '12px',
                    backgroundColor: '#f0f8ff',
                    border: '2px solid #4a9eff',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                >
                  <strong>📝 Ejemplos de prompts:</strong>
                  <ul
                    style={{
                      paddingLeft: '20px',
                      lineHeight: '1.6',
                      margin: '8px 0 0 0',
                    }}
                  >
                    <li>
                      Producto de café premium, granos esparcidos, iluminación
                      cálida
                    </li>
                    <li>
                      Perro feliz corriendo en un parque, fotografía profesional
                    </li>
                    <li>Auto deportivo en carretera de montaña al amanecer</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  ✅ ¡Imagen generada!
                </h3>

                <div
                  style={{
                    maxWidth: '500px',
                    margin: '0 auto 20px',
                    border: '3px solid #4CAF50',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <img
                    src={generatedImage}
                    alt="Imagen generada"
                    style={{ width: '100%', display: 'block' }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={handleUseAIImage}
                    type="button"
                    style={{
                      padding: '12px 24px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '2px solid #18191f',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 700,
                      boxShadow: '0 2px 0 #18191f',
                    }}
                  >
                    ✅ Usar esta imagen
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedImage(null);
                      setError(null);
                    }}
                    type="button"
                    style={{
                      padding: '12px 24px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '2px solid #18191f',
                      backgroundColor: 'white',
                      color: '#18191f',
                      cursor: 'pointer',
                      fontWeight: 700,
                      boxShadow: '0 2px 0 #18191f',
                    }}
                  >
                    🔄 Generar otra
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {requestError && (
        <GErrorPopup
          icon={GDeletetIcon}
          label={fileError}
          onRequestError={() => setRequestError(false)}
        />
      )}
    </div>
  );
};
