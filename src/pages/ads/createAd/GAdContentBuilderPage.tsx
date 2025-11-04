import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationService } from '../../../services/internal/navigationService';
import {
  setNewAdContent,
  setNewAdTemplate,
  setNewAdPallette,
  setNewAdColorConfig,
  setNewAdTemplateMode,
} from '../../../redux/sessionSlice';
import { RootState } from '../../../redux/gecoStore';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { ROUTES } from '../../../constants/routes';
import { IAdPattern, IAdColours } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { AdGenerationService } from '../../../services/internal/adGenerationService';

const { getAdPatterns, getAdColours } = AdsService;

export const GAdContentBuilderPage = () => {
  const formNewAd = useSelector((state: RootState) => state.formNewAd);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estados del formulario
  const [titleAd, setTitleAd] = useState('');
  const [textAd, setTextAd] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<IAdPattern | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string>(GWhite);
  const [customHex, setCustomHex] = useState<string>(GWhite);
  
  // Estados para colores independientes
  const [independentColors, setIndependentColors] = useState<boolean>(false);
  const [titleColor, setTitleColor] = useState<string>(GWhite);
  const [titleCustomHex, setTitleCustomHex] = useState<string>(GWhite);
  const [textColor, setTextColor] = useState<string>(GWhite);
  const [textCustomHex, setTextCustomHex] = useState<string>(GWhite);

  // Estados de catálogos
  const [quickTemplates, setQuickTemplates] = useState<IAdPattern[]>([]);
  const [allPatterns, setAllPatterns] = useState<IAdPattern[]>([]);
  const [colours, setColours] = useState<IAdColours[]>([]);
  const [templateMode, setTemplateMode] = useState<'quick' | 'custom'>('quick');
  const [customTitleDisp, setCustomTitleDisp] = useState<string>('top-center');
  const [customTextDisp, setCustomTextDisp] = useState<string>('bottom-center');

  // Estados de preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [imageAspect, setImageAspect] = useState<'square' | 'landscape' | 'portrait'>('square');

  // Estado para tabs en mobile
  const [activeTab, setActiveTab] = useState<'content' | 'layout' | 'colors'>(
    'content'
  );

  useEffect(() => {
    if (!formNewAd || !formNewAd.size || !formNewAd.img) {
      navigate(`${ROUTES.AD.ROOT}`);
      return;
    }

    const fetchData = async () => {
      try {
        // Cargar templates
        const patternsResponse = await getAdPatterns(formNewAd.size);
        const patternsData = patternsResponse as ApiResponse<IAdPattern[]>;
        const list = patternsData.data ?? [];

        setAllPatterns(list);

        if (list.length > 0) {
          const base = list[0];
          const w = parseInt(String(base.width), 10) || 1080;
          const h = parseInt(String(base.height), 10) || 1080;
          const ratio = w / h;
          const aspect =
            Math.abs(ratio - 1) < 0.05
              ? 'square'
              : ratio > 1
              ? 'landscape'
              : 'portrait';
          
          // Guardar el aspecto de la imagen
          setImageAspect(aspect);

          const centerTitleWidth =
            aspect === 'landscape'
              ? '60%'
              : aspect === 'portrait'
              ? '90%'
              : '80%';
          const centerTextWidth =
            aspect === 'landscape'
              ? '55%'
              : aspect === 'portrait'
              ? '88%'
              : '80%';
          
          // Anchos para templates laterales (más estrechos)
          const sideTitleWidth =
            aspect === 'landscape'
              ? '45%'
              : aspect === 'portrait'
              ? '75%'
              : '65%';
          const sideTextWidth =
            aspect === 'landscape'
              ? '40%'
              : aspect === 'portrait'
              ? '70%'
              : '60%';

          const make = (
            id: string,
            titleDisposition: string,
            textDispostion: string,
            customTitleWidth?: string,
            customTextWidth?: string
          ): IAdPattern => ({
            id,
            url: '',
            width: base.width,
            height: base.height,
            padding: base.padding ?? '24px',
            titleDisposition,
            titleSize: base.titleSize ?? '64px',
            textDispostion,
            textSize: base.textSize ?? '28px',
            titleWidth: customTitleWidth || centerTitleWidth,
            textWidth: customTextWidth || centerTextWidth,
          });

          let quick: IAdPattern[] = [];
          if (aspect === 'landscape') {
            quick = [
              make('qt-left', 'top-left', 'bottom-left', sideTitleWidth, sideTextWidth),
              make('qt-right', 'top-right', 'bottom-right', sideTitleWidth, sideTextWidth),
              make('qt-top-bottom', 'top-center', 'bottom-center'),
              make('qt-center', 'middle-center', 'bottom-center'),
            ];
          } else if (aspect === 'portrait') {
            quick = [
              make('qt-top-bottom', 'top-center', 'bottom-center'),
              make('qt-center', 'middle-center', 'bottom-center'),
              make('qt-top-left', 'top-left', 'bottom-left', sideTitleWidth, sideTextWidth),
              make('qt-top-right', 'top-right', 'bottom-right', sideTitleWidth, sideTextWidth),
            ];
          } else {
            quick = [
              make('qt-center', 'middle-center', 'bottom-center'),
              make('qt-top-bottom', 'top-center', 'bottom-center'),
              make('qt-left', 'top-left', 'bottom-left', sideTitleWidth, sideTextWidth),
              make('qt-right', 'top-right', 'bottom-right', sideTitleWidth, sideTextWidth),
            ];
          }
          setQuickTemplates(quick);
          setSelectedTemplate(quick[0]);
        }

        // Cargar colores
        const coloursResponse = await getAdColours();
        const coloursData = coloursResponse as ApiResponse<IAdColours[]>;
        setColours(coloursData.data ?? []);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchData();
  }, [formNewAd]);

  // Restaurar configuración guardada desde Redux
  useEffect(() => {
    if (formNewAd.titleAd) setTitleAd(formNewAd.titleAd);
    if (formNewAd.textAd) setTextAd(formNewAd.textAd);
    if (formNewAd.pallette) {
      setSelectedColor(formNewAd.pallette);
      setCustomHex(formNewAd.pallette);
    }
    if (formNewAd.template) setSelectedTemplate(formNewAd.template);
    if (formNewAd.templateMode) setTemplateMode(formNewAd.templateMode);
    if (formNewAd.customTitleDisp) setCustomTitleDisp(formNewAd.customTitleDisp);
    if (formNewAd.customTextDisp) setCustomTextDisp(formNewAd.customTextDisp);
    if (formNewAd.independentColors !== undefined) {
      setIndependentColors(formNewAd.independentColors);
      if (formNewAd.titleColor) {
        setTitleColor(formNewAd.titleColor);
        setTitleCustomHex(formNewAd.titleColor);
      }
      if (formNewAd.textColor) {
        setTextColor(formNewAd.textColor);
        setTextCustomHex(formNewAd.textColor);
      }
    }
  }, [formNewAd.titleAd, formNewAd.textAd, formNewAd.pallette, formNewAd.template, formNewAd.independentColors]);

  // Generar preview cuando cambia algo
  useEffect(() => {
    if (!selectedTemplate || !formNewAd.img) return;

    const generatePreview = async () => {
      setGeneratingPreview(true);
      try {
        const preview = await AdGenerationService.generation(
          {
            titleAd,
            textAd,
            pallette: selectedColor,
            template: selectedTemplate,
            img: formNewAd.img,
            titleColor: independentColors ? titleColor : undefined,
            textColor: independentColors ? textColor : undefined,
          },
          { scale: 1, forceBrandColor: true }
        );
        setPreviewImage(preview);
      } catch (error) {
        console.error('Error generando preview:', error);
      } finally {
        setGeneratingPreview(false);
      }
    };

    const timeoutId = setTimeout(() => {
      generatePreview();
      if (initialLoad) setInitialLoad(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [titleAd, textAd, selectedTemplate, selectedColor, formNewAd.img, independentColors, titleColor, textColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    // Guardar contenido básico
    dispatch(setNewAdContent({ title: titleAd, text: textAd }));
    dispatch(setNewAdTemplate(selectedTemplate));
    dispatch(setNewAdPallette(selectedColor));
    
    // Guardar configuración de colores
    dispatch(setNewAdColorConfig({
      independentColors,
      titleColor: independentColors ? titleColor : undefined,
      textColor: independentColors ? textColor : undefined,
    }));
    
    // Guardar configuración de template
    dispatch(setNewAdTemplateMode({
      templateMode,
      customTitleDisp: templateMode === 'custom' ? customTitleDisp : undefined,
      customTextDisp: templateMode === 'custom' ? customTextDisp : undefined,
    }));

    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.AD_GENERATION}`
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
          title="Diseña tu publicidad"
          subtitle="Escribe el contenido y elige el diseño. Ve el resultado en tiempo real"
        />
      </div>

      <form
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onSubmit={handleSubmit}
      >
        <div className="content-builder-container">
          {/* Panel de configuración */}
          <div className="content-builder-settings">
            {/* Tabs en mobile */}
            <div
              style={{
                borderBottom: '3px solid #18191f',
                marginBottom: 16,
                gap: 4,
              }}
              className="mobile-tabs"
            >
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                style={{
                  padding: '12px 20px',
                  border: '2px solid #18191f',
                  borderBottom: 'none',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  background: activeTab === 'content' ? '#FFD21E' : '#f5f5f5',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: activeTab === 'content' ? '#18191f' : '#6B7280',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  marginBottom: '-3px',
                  boxShadow:
                    activeTab === 'content'
                      ? '0 -2px 4px rgba(0,0,0,0.1)'
                      : 'none',
                  flex: 1,
                }}
              >
                📝 Texto
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('layout')}
                style={{
                  padding: '12px 20px',
                  border: '2px solid #18191f',
                  borderBottom: 'none',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  background: activeTab === 'layout' ? '#FFD21E' : '#f5f5f5',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: activeTab === 'layout' ? '#18191f' : '#6B7280',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  marginBottom: '-3px',
                  boxShadow:
                    activeTab === 'layout'
                      ? '0 -2px 4px rgba(0,0,0,0.1)'
                      : 'none',
                  flex: 1,
                }}
              >
                📐 Layout
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('colors')}
                style={{
                  padding: '12px 20px',
                  border: '2px solid #18191f',
                  borderBottom: 'none',
                  borderTopLeftRadius: '12px',
                  borderTopRightRadius: '12px',
                  background: activeTab === 'colors' ? '#FFD21E' : '#f5f5f5',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: activeTab === 'colors' ? '#18191f' : '#6B7280',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  marginBottom: '-3px',
                  boxShadow:
                    activeTab === 'colors'
                      ? '0 -2px 4px rgba(0,0,0,0.1)'
                      : 'none',
                  flex: 1,
                }}
              >
                🎨 Color
              </button>
            </div>

            {/* Contenido de las tabs */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Sección de texto */}
              <div
                className={`config-section ${
                  activeTab !== 'content' ? 'mobile-hidden' : ''
                }`}
              >
                <h3
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                  className="desktop-only"
                >
                  📝 Contenido
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <input
                    type="text"
                    value={titleAd}
                    onChange={(e) => setTitleAd(e.target.value)}
                    placeholder="Título principal (opcional)"
                    className="input-box form-control"
                    maxLength={50}
                  />
                  <textarea
                    value={textAd}
                    onChange={(e) => setTextAd(e.target.value)}
                    placeholder="Texto adicional (opcional)"
                    className="input-box form-control"
                    rows={3}
                    maxLength={200}
                  />
                </div>
              </div>

              {/* Sección de disposición */}
              <div
                className={`config-section ${
                  activeTab !== 'layout' ? 'mobile-hidden' : ''
                }`}
              >
                <h3
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                  className="desktop-only"
                >
                  📐 Disposición del texto
                </h3>

                {/* Tabs entre modos */}
                <div
                  style={{
                    borderBottom: '2px solid #cfd3dc',
                    marginBottom: 12,
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setTemplateMode('quick')}
                    style={{
                      padding: '8px 16px',
                      border: '2px solid #cfd3dc',
                      borderBottom: 'none',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      background:
                        templateMode === 'quick' ? '#FFD21E' : '#f5f5f5',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      color: templateMode === 'quick' ? '#18191f' : '#6B7280',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      marginBottom: '-2px',
                      boxShadow:
                        templateMode === 'quick'
                          ? '0 -2px 4px rgba(0,0,0,0.08)'
                          : 'none',
                    }}
                  >
                    ⚡ Rápidos
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateMode('custom')}
                    style={{
                      padding: '8px 16px',
                      border: '2px solid #cfd3dc',
                      borderBottom: 'none',
                      borderTopLeftRadius: '8px',
                      borderTopRightRadius: '8px',
                      background:
                        templateMode === 'custom' ? '#FFD21E' : '#f5f5f5',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      color: templateMode === 'custom' ? '#18191f' : '#6B7280',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      marginBottom: '-2px',
                      boxShadow:
                        templateMode === 'custom'
                          ? '0 -2px 4px rgba(0,0,0,0.08)'
                          : 'none',
                    }}
                  >
                    ⚙️ Personalizar
                  </button>
                </div>

                {templateMode === 'quick' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(100px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    {quickTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        style={{
                          border:
                            selectedTemplate?.id === template.id
                              ? '3px solid #FFD21E'
                              : '2px solid #cfd3dc',
                          borderRadius: '8px',
                          padding: '8px',
                          cursor: 'pointer',
                          background:
                            selectedTemplate?.id === template.id
                              ? '#fff9e6'
                              : '#f9fafc',
                          position: 'relative',
                          height: '80px',
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            height: '100%',
                            border: '1px dashed #9FA4B4',
                            borderRadius: '4px',
                          }}
                        >
                          <div
                            style={getSchematicStyle(
                              template.titleDisposition,
                              '#18191f'
                            )}
                          >
                            <div
                              style={{
                                background: '#18191f',
                                height: '4px',
                                width: '60%',
                                borderRadius: '2px',
                              }}
                            />
                          </div>
                          <div
                            style={getSchematicStyle(
                              template.textDispostion,
                              '#9FA4B4'
                            )}
                          >
                            <div
                              style={{
                                background: '#9FA4B4',
                                height: '3px',
                                width: '50%',
                                borderRadius: '2px',
                                marginBottom: '2px',
                              }}
                            />
                            <div
                              style={{
                                background: '#9FA4B4',
                                height: '3px',
                                width: '40%',
                                borderRadius: '2px',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {/* Mini preview del custom */}
                    <div
                      style={{
                        border: '2px solid #cfd3dc',
                        borderRadius: 8,
                        padding: 8,
                        background: '#f9fafc',
                        marginBottom: 12,
                        maxWidth: 200,
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          height: 100,
                          border: '1px dashed #9FA4B4',
                          borderRadius: 4,
                        }}
                      >
                        <div
                          style={getSchematicStyle(customTitleDisp, '#18191f')}
                        >
                          <div
                            style={{
                              background: '#18191f',
                              height: 6,
                              width: '60%',
                              borderRadius: 2,
                            }}
                          />
                        </div>
                        <div
                          style={getSchematicStyle(customTextDisp, '#9FA4B4')}
                        >
                          <div
                            style={{
                              background: '#9FA4B4',
                              height: 4,
                              width: '50%',
                              borderRadius: 2,
                              marginBottom: 2,
                            }}
                          />
                          <div
                            style={{
                              background: '#9FA4B4',
                              height: 4,
                              width: '40%',
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selectores */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: '#18191f',
                          }}
                        >
                          Posición del título
                        </span>
                        <select
                          className="input-box form-control"
                          value={customTitleDisp}
                          onChange={(e) => setCustomTitleDisp(e.target.value)}
                          style={{ fontSize: '14px', padding: '6px' }}
                        >
                          {dispositionOptions().map((op) => (
                            <option key={`t-${op.value}`} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: '13px',
                            color: '#18191f',
                          }}
                        >
                          Posición del texto
                        </span>
                        <select
                          className="input-box form-control"
                          value={customTextDisp}
                          onChange={(e) => setCustomTextDisp(e.target.value)}
                          style={{ fontSize: '14px', padding: '6px' }}
                        >
                          {dispositionOptions().map((op) => (
                            <option key={`x-${op.value}`} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      {customTitleDisp === customTextDisp && (
                        <div
                          style={{
                            color: '#b91c1c',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          ⚠️ El título y el texto no pueden estar en la misma
                          posición
                        </div>
                      )}
                      <button
                        type="button"
                        disabled={customTitleDisp === customTextDisp}
                        onClick={() => {
                          const base = quickTemplates[0] || allPatterns[0];
                          if (!base) return;
                          
                          // Determinar si usamos anchos laterales o centrales
                          const isLateralTitle = customTitleDisp.includes('left') || customTitleDisp.includes('right');
                          const isLateralText = customTextDisp.includes('left') || customTextDisp.includes('right');
                          
                          // Calcular anchos apropiados
                          const w = parseInt(String(base.width), 10) || 1080;
                          const h = parseInt(String(base.height), 10) || 1080;
                          const ratio = w / h;
                          const aspect = Math.abs(ratio - 1) < 0.05 ? 'square' : ratio > 1 ? 'landscape' : 'portrait';
                          
                          const centerTW = aspect === 'landscape' ? '60%' : aspect === 'portrait' ? '90%' : '80%';
                          const centerTeW = aspect === 'landscape' ? '55%' : aspect === 'portrait' ? '88%' : '80%';
                          const sideTW = aspect === 'landscape' ? '45%' : aspect === 'portrait' ? '75%' : '65%';
                          const sideTeW = aspect === 'landscape' ? '40%' : aspect === 'portrait' ? '70%' : '60%';
                          
                          const custom: IAdPattern = {
                            id: 'custom',
                            url: '',
                            width: base.width,
                            height: base.height,
                            padding: base.padding ?? '24px',
                            titleDisposition: customTitleDisp,
                            titleSize: base.titleSize ?? '64px',
                            textDispostion: customTextDisp,
                            textSize: base.textSize ?? '28px',
                            titleWidth: isLateralTitle ? sideTW : centerTW,
                            textWidth: isLateralText ? sideTeW : centerTeW,
                          };
                          setSelectedTemplate(custom);
                        }}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          border: '2px solid #18191f',
                          boxShadow:
                            customTitleDisp === customTextDisp
                              ? 'none'
                              : '0 2px 0 #18191f',
                          background:
                            customTitleDisp === customTextDisp
                              ? '#e5e7eb'
                              : '#FFD21E',
                          color: '#18191f',
                          fontWeight: 600,
                          fontSize: '14px',
                          cursor:
                            customTitleDisp === customTextDisp
                              ? 'not-allowed'
                              : 'pointer',
                          marginTop: 4,
                        }}
                      >
                        ✓ Aplicar disposición
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de colores */}
              <div
                className={`config-section ${
                  activeTab !== 'colors' ? 'mobile-hidden' : ''
                }`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '18px',
                      fontWeight: 700,
                    }}
                    className="desktop-only"
                  >
                    🎨 Colores del texto
                  </h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={independentColors}
                      onChange={(e) => {
                        setIndependentColors(e.target.checked);
                        if (e.target.checked) {
                          setTitleColor(selectedColor);
                          setTitleCustomHex(customHex);
                          setTextColor(selectedColor);
                          setTextCustomHex(customHex);
                        }
                      }}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    Colores separados
                  </label>
                </div>

                {!independentColors ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => {
                          setCustomHex(e.target.value);
                          setSelectedColor(e.target.value);
                        }}
                        style={{
                          width: '40px',
                          height: '40px',
                          border: '2px solid #18191f',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      />
                      <input
                        type="text"
                        value={customHex}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          setCustomHex(val);
                          if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
                            setSelectedColor(val);
                          }
                        }}
                        placeholder="#RRGGBB"
                        className="input-box form-control"
                        style={{ flex: 1, maxWidth: '120px' }}
                      />
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                        gap: '6px',
                      }}
                    >
                      {colours.map((color) => (
                        <div
                          key={color.id}
                          onClick={() => {
                            setSelectedColor(color.hex);
                            setCustomHex(color.hex);
                          }}
                          style={{
                            width: '100%',
                            height: '40px',
                            backgroundColor: color.hex,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            border:
                              selectedColor === color.hex
                                ? '3px solid #FFD21E'
                                : '2px solid #18191f',
                            boxShadow:
                              selectedColor === color.hex
                                ? '0 2px 0 #FFD21E'
                                : '0 1px 0 #18191f',
                          }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Color del Título */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                        📝 Color del título
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <input
                          type="color"
                          value={titleCustomHex}
                          onChange={(e) => {
                            setTitleCustomHex(e.target.value);
                            setTitleColor(e.target.value);
                          }}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: '2px solid #18191f',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        />
                        <input
                          type="text"
                          value={titleCustomHex}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            setTitleCustomHex(val);
                            if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
                              setTitleColor(val);
                            }
                          }}
                          placeholder="#RRGGBB"
                          className="input-box form-control"
                          style={{ flex: 1, maxWidth: '120px' }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                          gap: '6px',
                        }}
                      >
                        {colours.map((color) => (
                          <div
                            key={`title-${color.id}`}
                            onClick={() => {
                              setTitleColor(color.hex);
                              setTitleCustomHex(color.hex);
                            }}
                            style={{
                              width: '100%',
                              height: '40px',
                              backgroundColor: color.hex,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              border:
                                titleColor === color.hex
                                  ? '3px solid #FFD21E'
                                  : '2px solid #18191f',
                              boxShadow:
                                titleColor === color.hex
                                  ? '0 2px 0 #FFD21E'
                                  : '0 1px 0 #18191f',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Color del Texto */}
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>
                        📄 Color del texto
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <input
                          type="color"
                          value={textCustomHex}
                          onChange={(e) => {
                            setTextCustomHex(e.target.value);
                            setTextColor(e.target.value);
                          }}
                          style={{
                            width: '40px',
                            height: '40px',
                            border: '2px solid #18191f',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        />
                        <input
                          type="text"
                          value={textCustomHex}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            setTextCustomHex(val);
                            if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
                              setTextColor(val);
                            }
                          }}
                          placeholder="#RRGGBB"
                          className="input-box form-control"
                          style={{ flex: 1, maxWidth: '120px' }}
                        />
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                          gap: '6px',
                        }}
                      >
                        {colours.map((color) => (
                          <div
                            key={`text-${color.id}`}
                            onClick={() => {
                              setTextColor(color.hex);
                              setTextCustomHex(color.hex);
                            }}
                            style={{
                              width: '100%',
                              height: '40px',
                              backgroundColor: color.hex,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              border:
                                textColor === color.hex
                                  ? '3px solid #FFD21E'
                                  : '2px solid #18191f',
                              boxShadow:
                                textColor === color.hex
                                  ? '0 2px 0 #FFD21E'
                                  : '0 1px 0 #18191f',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Panel derecho: Preview */}
          <div className="content-builder-preview desktop-sticky">
            <div className="config-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                >
                  👁️ Vista previa
                </h3>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: '#f0f0f0',
                    color: '#6B7280',
                  }}
                >
                  {imageAspect === 'landscape' ? '📐 Horizontal' : imageAspect === 'portrait' ? '📱 Vertical' : '⬛ Cuadrado'}
                </span>
              </div>

              {/* Container con altura adaptativa según formato */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: imageAspect === 'landscape' ? '16/9' : imageAspect === 'portrait' ? '9/16' : '1/1',
                  maxHeight: imageAspect === 'landscape' ? '350px' : imageAspect === 'portrait' ? '650px' : '500px',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                }}
              >
                {generatingPreview || initialLoad ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background:
                        'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite',
                      borderRadius: '8px',
                      border: '1px solid #cfd3dc',
                    }}
                  >
                    <div
                      style={{
                        color: '#9FA4B4',
                        fontSize: '14px',
                        textAlign: 'center',
                        padding: '20px',
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        ⏳
                      </div>
                      <div>Generando preview...</div>
                    </div>
                  </div>
                ) : previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      borderRadius: '8px',
                      border: '1px solid #cfd3dc',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#9FA4B4',
                      border: '2px dashed #cfd3dc',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                        👆
                      </div>
                      <div>Configura tu diseño para ver el preview</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Agregar estilo de animación */}
            <style>{`
              @keyframes shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <GSubmitButton
            label="Generar publicidad final"
            colorBackground={GYellow}
            colorFont={GBlack}
          />
        </div>
      </form>
    </div>
  );
};

function getSchematicStyle(
  disposition: string,
  color: string
): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };
  const map: Record<string, React.CSSProperties> = {
    'top-center': { top: 2, left: 0, right: 0, alignItems: 'center' },
    'top-left': { top: 2, left: 2, right: 'auto', width: '80%', alignItems: 'flex-start' },
    'top-right': { top: 2, right: 2, left: 'auto', width: '80%', alignItems: 'flex-end' },
    'middle-center': {
      top: '50%',
      transform: 'translateY(-50%)',
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    'middle-left': {
      top: '50%',
      transform: 'translateY(-50%)',
      left: 2,
      right: 'auto',
      width: '80%',
      alignItems: 'flex-start',
    },
    'middle-right': {
      top: '50%',
      transform: 'translateY(-50%)',
      right: 2,
      left: 'auto',
      width: '80%',
      alignItems: 'flex-end',
    },
    'bottom-center': { bottom: 2, left: 0, right: 0, alignItems: 'center' },
    'bottom-left': { bottom: 2, left: 2, right: 'auto', width: '80%', alignItems: 'flex-start' },
    'bottom-right': { bottom: 2, right: 2, left: 'auto', width: '80%', alignItems: 'flex-end' },
  };
  return { ...base, ...(map[disposition] || map['bottom-center']) };
}

type DispOption = { value: string; label: string };

function dispositionOptions(): DispOption[] {
  return [
    { value: 'top-center', label: 'Arriba centro' },
    { value: 'top-left', label: 'Arriba izquierda' },
    { value: 'top-right', label: 'Arriba derecha' },
    { value: 'middle-center', label: 'Centro' },
    { value: 'middle-left', label: 'Centro izquierda' },
    { value: 'middle-right', label: 'Centro derecha' },
    { value: 'bottom-center', label: 'Abajo centro' },
    { value: 'bottom-left', label: 'Abajo izquierda' },
    { value: 'bottom-right', label: 'Abajo derecha' },
  ];
}
