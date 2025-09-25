import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import { CreateAdGeneratedTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useSelector } from 'react-redux';
import { ROUTES } from '../../../constants/routes';
import { RootState } from '../../../redux/gecoStore';
import { AdGenerationService } from '../../../services/internal/adGenerationService';
import { useEffect, useState } from 'react';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { PacmanLoader } from 'react-spinners';

export const GAdGenerationPage = () => {
  const [generatedAd, setGeneratedAd] = useState<string | null>(null);
  const [adjustedAd, setAdjustedAd] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<'brand' | 'adjusted' | null>(null);
  const [loading, setLoading] = useState(false);
  const formNewAd = useSelector((state: RootState) => state.auth.formNewAd);

  const location = useLocation();
  const navigate = useNavigate();

  const img = location && location.state;

  useEffect(() => {
    if (!formNewAd.template && !formNewAd.pallette) {
      navigate(`${ROUTES.AD.ROOT}`);
    }
    const generateAd = async () => {
      try {
        setLoading(true);
        const payload = {
          titleAd: formNewAd.titleAd ?? undefined,
          textAd: formNewAd.textAd ?? undefined,
          pallette: formNewAd.pallette,
          template: formNewAd.template,
          img: img,
        };

        // Primero evaluar contraste con el color elegido
        const assess = await AdGenerationService.assessContrast(payload);
        if (!assess.meets) {
          // Generar ambas opciones: marca (forzada) y ajustada (auto-contraste)
          const pair = await AdGenerationService.generationAdjustedPair(payload);
          setGeneratedAd(pair.brand);
          setAdjustedAd(pair.adjusted);
          setSelectedKey('adjusted');
        } else {
          // Generar con color de marca (cumple contraste)
          const brand = await AdGenerationService.generation(payload, { scale: 2, forceBrandColor: true });
          setGeneratedAd(brand);
          setAdjustedAd(null);
          setSelectedKey('brand');
        }
      } catch (error) {
        navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}`);
      } finally {
        setLoading(false);
      }
    };
    generateAd();
  }, [formNewAd, img]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const chosen = selectedKey === 'adjusted' && adjustedAd ? adjustedAd : generatedAd;
    if (!chosen) return;
    navigate(`${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.INFORMATION}`,{ state: chosen });
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
          title={CreateAdGeneratedTitle.title}
          subtitle={CreateAdGeneratedTitle.subtitle}
        />
        <form className="geco-form" onSubmit={handleSubmit}>
          {loading && !generatedAd ? (
            <div
              style={{
                textAlign: 'start',
                marginTop: '25vh',
              }}
            >
              <PacmanLoader color={GYellow} />
            </div>
          ) : (
            <>
              {generatedAd && adjustedAd ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, width: '100%' }}>
                  <div
                    onClick={() => setSelectedKey('adjusted')}
                    style={{
                      border: selectedKey === 'adjusted' ? '3px solid #18191f' : '2px solid #18191f',
                      boxShadow: selectedKey === 'adjusted' ? '0px 4px 0px #18191f' : '0px 2px 0px #18191f',
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#fff',
                    }}
                  >
                    <img src={adjustedAd} alt="Contraste optimizado" style={{ width: '100%', display: 'block' }} />
                    <div style={{ padding: '8px 10px', background: '#f7f7f7', fontWeight: 600 }}>Contraste optimizado</div>
                  </div>
                  <div
                    onClick={() => setSelectedKey('brand')}
                    style={{
                      border: selectedKey === 'brand' ? '3px solid #18191f' : '2px solid #18191f',
                      boxShadow: selectedKey === 'brand' ? '0px 4px 0px #18191f' : '0px 2px 0px #18191f',
                      borderRadius: 12,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      background: '#fff',
                    }}
                  >
                    <img src={generatedAd} alt="Color de marca" style={{ width: '100%', display: 'block' }} />
                    <div style={{ padding: '8px 10px', background: '#f7f7f7', fontWeight: 600 }}>Color de marca</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: 8, color: '#9FA4B4', fontSize: 12 }}>
                    Vemos que tu color podría leer poco sobre esta imagen. Elegí "Contraste optimizado" para máxima legibilidad o conservá tu "Color de marca" si preferís mantener identidad.
                  </div>
                </div>
              ) : generatedAd ? (
                <>
                  <img src={generatedAd} alt="Previsualización" style={{ width: '100%', display: 'block', borderRadius: 12, border: '2px solid #18191f', boxShadow: '0 2px 0 #18191f' }} />
                </>
              ) : null}
              <div style={{ marginTop: '16px' }}>
                <GSubmitButton
                  label={'Siguiente'}
                  colorBackground={GYellow}
                  colorFont={GBlack}
                />
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
