import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdTemplate } from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import { CreateAdPatternTitle } from '../../../constants/wording';
import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { IAdPattern } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { ROUTES } from '../../../constants/routes';

const { getAdPatterns } = AdsService;

export const GAdPatternPage = () => {
  const [patterns, setPatterns] = useState<IAdPattern[]>([]);
  const [quickTemplates, setQuickTemplates] = useState<IAdPattern[]>([]);
  const [customTitleDisp, setCustomTitleDisp] = useState<string>('top-center');
  const [customTextDisp, setCustomTextDisp] = useState<string>('bottom-center');
  const [mode, setMode] = useState<'quick' | 'custom'>('quick');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const size: string = location && location.state;

  useEffect(() => {
    if (!size) {
      navigate(`${ROUTES.AD.ROOT}`);
    }
    const fetchPatterns = async () => {
      try {
        const response = await getAdPatterns(size);
        const patternsData = response as ApiResponse<IAdPattern[]>;
        const list = patternsData.data ?? [];
        setPatterns(list);
        // Armar "Patrones rápidos" según orientación del tamaño elegido
        const base = list[0];
        const width = base?.width ?? '1080';
        const height = base?.height ?? '1080';
        const padding = base?.padding ?? '24px';
        const titleSize = base?.titleSize ?? '64px';
        const textSize = base?.textSize ?? '28px';

        const w = parseInt(String(width), 10) || 1080;
        const h = parseInt(String(height), 10) || 1080;
        const ratio = w / h;
        const aspect: 'square' | 'landscape' | 'portrait' = Math.abs(ratio - 1) < 0.05 ? 'square' : ratio > 1 ? 'landscape' : 'portrait';

        // Anchos recomendados por orientación para legibilidad
        const titleWidth = base?.titleWidth ?? (aspect === 'landscape' ? '60%' : aspect === 'portrait' ? '90%' : '80%');
        const textWidth = base?.textWidth ?? (aspect === 'landscape' ? '55%' : aspect === 'portrait' ? '88%' : '80%');

        const make = (id: string, titleDisposition: string, textDispostion: string): IAdPattern => ({
          id,
          url: '',
          width,
          height,
          padding,
          titleDisposition,
          titleSize,
          textDispostion,
          textSize,
          titleWidth,
          textWidth,
        });

        let quick: IAdPattern[] = [];
        if (aspect === 'landscape') {
          // Horizontal: priorizar layouts izquierda/derecha, que aprovechan el ancho
          quick = [
            make('qt-left', 'top-left', 'middle-left'),
            make('qt-right', 'top-right', 'middle-right'),
            make('qt-top-bottom', 'top-center', 'bottom-center'),
            make('qt-center', 'middle-center', 'bottom-center'),
          ];
        } else if (aspect === 'portrait') {
          // Vertical: priorizar top/bottom y centrados para scroll rápido
          quick = [
            make('qt-top-bottom', 'top-center', 'bottom-center'),
            make('qt-center', 'middle-center', 'bottom-center'),
            make('qt-bottom-focus', 'middle-center', 'bottom-center'),
            make('qt-top-focus', 'top-center', 'middle-center'),
          ];
        } else {
          // Cuadrado: balanceado
          quick = [
            make('qt-center', 'middle-center', 'bottom-center'),
            make('qt-top-bottom', 'top-center', 'bottom-center'),
            make('qt-left', 'top-left', 'middle-left'),
            make('qt-right', 'top-right', 'middle-right'),
          ];
        }
        setQuickTemplates(quick);
      } catch (error) {
        console.error(error);
      }
    };

    if (size) {
      fetchPatterns();
    }
  }, [size]);

  const handlePatternChange = (event: IAdPattern) => {
    dispatch(setNewAdTemplate(event));
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.PALLETTE}`
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
          title={CreateAdPatternTitle.title}
          subtitle={CreateAdPatternTitle.subtitle}
        />
      </div>
      <form className="geco-form">
        {size ? (
          <div className="geco-create-ad-container" style={{ width: '100%' }}>
            {/* Toggle de modo */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button
                type="button"
                onClick={() => setMode('quick')}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '2px solid #18191f',
                  boxShadow: mode === 'quick' ? '0 2px 0 #18191f' : 'none',
                  background: mode === 'quick' ? '#FFD21E' : '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Patrones rápidos
              </button>
              <button
                type="button"
                onClick={() => setMode('custom')}
                style={{
                  padding: '8px 12px',
                  borderRadius: 10,
                  border: '2px solid #18191f',
                  boxShadow: mode === 'custom' ? '0 2px 0 #18191f' : 'none',
                  background: mode === 'custom' ? '#FFD21E' : '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Patrón personalizado
              </button>
            </div>

            {mode === 'quick' ? (
              <>
                <p className="geco-strategy-subtitle">Patrones rápidos</p>
                {quickTemplates.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, width: '100%' }}>
                    {quickTemplates.map((qt) => (
                      <div
                        key={`quick-${qt.id}`}
                        onClick={() => handlePatternChange(qt)}
                        style={{
                          border: '2px solid #18191f',
                          boxShadow: '0px 2px 0px #18191f',
                          borderRadius: 12,
                          padding: 10,
                          cursor: 'pointer',
                          background: '#fff',
                        }}
                      >
                        <div style={{ position: 'relative', height: 160, border: '1px dashed #cfd3dc', borderRadius: 10, overflow: 'hidden', background: '#f9fafc' }}>
                          <div style={schematicBlockStyle(qt.titleDisposition, '#18191f')}>
                            <div style={{ background: '#18191f', height: 12, borderRadius: 3, width: widthPercentFor(qt.titleWidth) }} />
                            <span style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Título</span>
                          </div>
                          <div style={schematicBlockStyle(qt.textDispostion, '#9FA4B4')}>
                            <div style={{ background: '#9FA4B4', height: 8, borderRadius: 3, width: widthPercentFor(qt.textWidth), marginBottom: 4 }} />
                            <div style={{ background: '#9FA4B4', height: 8, borderRadius: 3, width: widthPercentFor(qt.textWidth, 0.7) }} />
                            <span style={{ fontSize: 10, color: '#9FA4B4', marginTop: 2 }}>Texto</span>
                          </div>
                        </div>
                        <div style={{ paddingTop: 8, color: '#18191f', fontWeight: 700 }}>
                          {labelForLayout(qt.titleDisposition, qt.textDispostion)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No hay patrones rápidos para este tamaño.</p>
                )}
              </>
            ) : (
              <>
                <p className="geco-strategy-subtitle">Personalizar disposición</p>
                {/* Mini preview arriba */}
                <div style={{
                  border: '2px solid #18191f',
                  boxShadow: '0px 2px 0px #18191f',
                  borderRadius: 12,
                  padding: 8,
                  background: '#fff',
                  maxWidth: 520,
                  marginBottom: 10,
                }}>
                  <div style={{ position: 'relative', height: 140, border: '1px dashed #cfd3dc', borderRadius: 10, overflow: 'hidden', background: '#f9fafc' }}>
                    <div style={schematicBlockStyle(customTitleDisp, '#18191f')}>
                      <div style={{ background: '#18191f', height: 10, borderRadius: 3, width: widthPercentFor((quickTemplates[0]?.titleWidth ?? '80%')) }} />
                      <span style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Título</span>
                    </div>
                    <div style={schematicBlockStyle(customTextDisp, '#9FA4B4')}>
                      <div style={{ background: '#9FA4B4', height: 7, borderRadius: 3, width: widthPercentFor((quickTemplates[0]?.textWidth ?? '80%')), marginBottom: 3 }} />
                      <div style={{ background: '#9FA4B4', height: 7, borderRadius: 3, width: widthPercentFor((quickTemplates[0]?.textWidth ?? '80%'), 0.7) }} />
                      <span style={{ fontSize: 10, color: '#9FA4B4', marginTop: 2 }}>Texto</span>
                    </div>
                  </div>
                </div>

                {/* Selectores */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
                    <span style={{ fontWeight: 600, color: '#18191f' }}>Posición del título</span>
                    <select
                      className="input-box form-control"
                      value={customTitleDisp}
                      onChange={(e) => setCustomTitleDisp(e.target.value)}
                    >
                      {dispositionOptions().map((op: { value: string; label: string }) => (
                        <option key={`t-${op.value}`} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
                    <span style={{ fontWeight: 600, color: '#18191f' }}>Posición del texto</span>
                    <select
                      className="input-box form-control"
                      value={customTextDisp}
                      onChange={(e) => setCustomTextDisp(e.target.value)}
                    >
                      {dispositionOptions().map((op: { value: string; label: string }) => (
                        <option key={`x-${op.value}`} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                  </label>
                  {customTitleDisp === customTextDisp && (
                    <div style={{ color: '#b91c1c', fontSize: 12, fontWeight: 600 }}>
                      El título y el texto no pueden estar en el mismo lugar.
                    </div>
                  )}
                  <div>
                    <button
                      type="button"
                      disabled={customTitleDisp === customTextDisp}
                      onClick={() => {
                        const base = quickTemplates[0] || patterns[0];
                        const make = (id: string, titleDisposition: string, textDispostion: string): IAdPattern => ({
                          id,
                          url: '',
                          width: base?.width ?? '1080',
                          height: base?.height ?? '1080',
                          padding: base?.padding ?? '24px',
                          titleDisposition,
                          titleSize: base?.titleSize ?? '64px',
                          textDispostion,
                          textSize: base?.textSize ?? '28px',
                          titleWidth: base?.titleWidth ?? '80%',
                          textWidth: base?.textWidth ?? '80%',
                        });
                        const custom = make('qt-custom', customTitleDisp, customTextDisp);
                        handlePatternChange(custom);
                      }}
                      style={{
                        padding: '10px 16px',
                        borderRadius: 10,
                        border: '2px solid #18191f',
                        boxShadow: '0 2px 0 #18191f',
                        background: customTitleDisp === customTextDisp ? '#e5e7eb' : '#FFD21E',
                        color: '#18191f',
                        fontWeight: 700,
                        cursor: customTitleDisp === customTextDisp ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Usar disposición
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* (Se eliminó la galería para simplificar la elección) */}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </form>
    </div>
  );
};

// Helpers para renderizar el esquema de disposición
function schematicBlockStyle(disposition: string, color: string): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  };
  const map: Record<string, React.CSSProperties> = {
    'top-center': { top: 6, left: 0, right: 0, alignItems: 'center' },
    'top-left': { top: 6, left: 6, alignItems: 'flex-start' },
    'top-right': { top: 6, right: 6, alignItems: 'flex-end' },
    'middle-center': { top: '50%', transform: 'translateY(-50%)', left: 0, right: 0, alignItems: 'center' },
    'middle-left': { top: '50%', transform: 'translateY(-50%)', left: 6, alignItems: 'flex-start' },
    'middle-right': { top: '50%', transform: 'translateY(-50%)', right: 6, alignItems: 'flex-end' },
    'bottom-center': { bottom: 6, left: 0, right: 0, alignItems: 'center' },
    'bottom-left': { bottom: 6, left: 6, alignItems: 'flex-start' },
    'bottom-right': { bottom: 6, right: 6, alignItems: 'flex-end' },
  } as any;
  return { ...base, ...(map[disposition] || map['bottom-center']), color };
}

function labelForLayout(titleDisposition: string, textDispostion: string): string {
  const t = (s: string) => s.replace('-', ' ').replace('middle', 'centro').replace('top', 'arriba').replace('bottom', 'abajo').replace('left', 'izquierda').replace('right', 'derecha').replace('center', 'centro');
  return `${t(titleDisposition)} / ${t(textDispostion)}`;
}

type DispOption = { value: string; label: string };
function dispositionOptions(): DispOption[] {
  // Conjunto reducido para no abrumar
  return [
    { value: 'top-center', label: 'Arriba centro' },
    { value: 'middle-left', label: 'Centro izquierda' },
    { value: 'middle-center', label: 'Centro' },
    { value: 'middle-right', label: 'Centro derecha' },
    { value: 'bottom-center', label: 'Abajo centro' },
  ];
}

// Convierte anchos tipo '80%' en un width CSS, aplicando un factor para variar la barra secundaria
function widthPercentFor(widthValue: string | undefined, factor: number = 1): string {
  if (!widthValue) return `${Math.round(75 * factor)}%`;
  // Si ya viene como porcentaje, escalarlo
  if (typeof widthValue === 'string' && widthValue.trim().endsWith('%')) {
    const n = parseFloat(widthValue);
    if (isFinite(n)) return `${Math.max(10, Math.min(100, Math.round(n * factor)))}%`;
  }
  // Si viene en px u otro formato, usar un valor razonable
  return `${Math.round(75 * factor)}%`;
}

// Alias por si en el futuro queremos mapear otras unidades
function percentFromWidth(widthValue: string | undefined): string {
  return widthPercentFor(widthValue, 1);
}
