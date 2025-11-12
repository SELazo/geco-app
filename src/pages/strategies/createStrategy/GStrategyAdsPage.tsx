import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  INewGoupInfo,
  INewStrategyForm,
  setNewStrategyAds,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import('../../../styles/gstrategyItem.css');
import '../../../styles/gcreatead.css';
import '../../../styles/gpublic-strategy.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GIconButtonBack,
  GStrategyIcon,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  AddNewGroupStep2SectionTitle,
  CreateStrategyAdsTitle,
  NewStrategyAdsEmpty,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import {
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ROUTES } from '../../../constants/routes';
import { AdsService } from '../../../services/external/adsService';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { AdsFirestoreService } from '../../../services/external/adsFirestoreService';
import { IAd } from '../../../interfaces/dtos/external/IFirestore';
import { DateService } from '../../../services/internal/dateService';

const { getAds } = AdsService;
const { getDateString } = DateService;

export const GStrategyAdsPage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedFirestoreIds, setSelectedFirestoreIds] = useState<string[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);
  const [error, setError] = useState({ show: false, message: '' });
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [adImages, setAdImages] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const strategyForm: INewStrategyForm = useSelector(
    (state: any) => state.formNewStrategy
  );

  // Precargar publicidades ya seleccionadas
  useEffect(() => {
    if (strategyForm?.ads && strategyForm.ads.length > 0 && adsList.length > 0) {
      console.log('🔄 Precargando publicidades seleccionadas:', strategyForm.ads);
      
      // Buscar los ads correspondientes y agregar sus IDs numéricos y de Firestore
      const selectedAdsData = adsList.filter((ad) => 
        strategyForm.ads.includes((ad as any).firestoreId || String(ad.id))
      );
      
      const numericIds = selectedAdsData.map(ad => 
        typeof ad.id === 'number' ? ad.id : parseInt(String(ad.id))
      );
      
      const firestoreIds = selectedAdsData.map(ad => 
        (ad as any).firestoreId || String(ad.id)
      );
      
      setSelectedNumbers(numericIds);
      setSelectedFirestoreIds(firestoreIds);
      
      console.log('✅ Precargados:', { numericIds, firestoreIds });
    }
  }, [adsList, strategyForm?.ads]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log('🔍 Cargando publicidades desde Firestore...');
        
        // Obtener usuario
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('❌ No hay usuario');
          setAdsList([]);
          return;
        }
        
        const user = JSON.parse(storedUser);
        const userId = user.id || user.email;
        
        console.log('👤 Buscando publicidades para userId:', userId);
        console.log('👤 Usuario completo:', user);
        
        // Cargar publicidades desde Firestore (igual que GAdsListPage)
        const firestoreAds = await AdsFirestoreService.getUserAds(String(userId));
        console.log(`✅ ${firestoreAds.length} publicidades cargadas desde Firestore`);
        console.log('📦 Datos de Firestore:', firestoreAds);
        
        // Mapear a formato esperado por el componente
        const mappedAds: IGetAdResponse[] = firestoreAds.map((ad: any, index: number) => {
          // Manejar Timestamp de Firestore
          let dateString = new Date().toISOString();
          if (ad.createdAt) {
            if (typeof ad.createdAt === 'object' && 'seconds' in ad.createdAt) {
              dateString = new Date((ad.createdAt as any).seconds * 1000).toISOString();
            } else if (ad.createdAt instanceof Date) {
              dateString = ad.createdAt.toISOString();
            }
          }
          
          // 🔍 BUSCAR IMAGEN EN MÚLTIPLES UBICACIONES (igual que GAdsListPage)
          let imageUrl = '';
          if (ad.ad_image) {
            // Estructura actual: ad_image
            imageUrl = ad.ad_image;
            console.log('✅ Imagen encontrada en ad.ad_image para', ad.id);
          } else if (ad.content?.imageUrl) {
            // Estructura alternativa: content.imageUrl
            imageUrl = ad.content.imageUrl;
            console.log('✅ Imagen encontrada en ad.content.imageUrl para', ad.id);
          } else if (ad.imageUrl) {
            // Estructura alternativa: imageUrl directo
            imageUrl = ad.imageUrl;
            console.log('✅ Imagen encontrada en ad.imageUrl para', ad.id);
          } else {
            console.warn('⚠️ No se encontró imagen para publicidad:', ad.id);
          }
          
          // IMPORTANTE: Los campos reales en Firestore son ad_title, ad_description, etc.
          return {
            id: index + 1, // ID numérico basado en índice
            firestoreId: ad.id, // ID de Firestore (string) para referencias
            firestoreData: ad, // Guardar datos completos de Firestore
            title: ad.ad_title || ad.title || '', // ✅ Leer ad_title
            description: ad.ad_description || ad.description || '', // ✅ Leer ad_description
            size: ad.ad_size || ad.size || '1080x1080',
            create_date: dateString,
            deleted_date: null,
            account_id: parseInt(ad.userId || ad.accounts_account_id || '0'),
            ad_template: {
              id: 1,
              type: ad.ad_template?.disposition_pattern || ad.template || '',
              disposition_pattern: ad.ad_template?.disposition_pattern || ad.template || '',
              color_text: ad.ad_template?.color_text || ad.palette || '#000000',
            },
            imageUrl: imageUrl, // ✅ Imagen con fallbacks múltiples
          };
        });
        
        console.log('📊 Publicidades mapeadas:', mappedAds.length);
        console.log('📊 Primera publicidad:', mappedAds[0]);
        console.log('📊 Todas las publicidades:', mappedAds);
        setAdsList(mappedAds);
        
      } catch (error) {
        console.error('❌ Error cargando publicidades:', error);
        setAdsList([]);
      }
    };

    fetchAds();
  }, []);

  // Cargar imágenes de las publicidades seleccionadas
  useEffect(() => {
    const loadImages = async () => {
      const selectedAds = adsList.filter((ad) => 
        selectedNumbers.includes(typeof ad.id === 'number' ? ad.id : parseInt(String(ad.id)))
      );
      const images: Record<number, string> = {};
      
      for (const ad of selectedAds) {
        const numId = typeof ad.id === 'number' ? ad.id : parseInt(String(ad.id));
        let foundImage = false;
        
        // 🔍 BUSCAR IMAGEN EN MÚLTIPLES UBICACIONES (igual que GAdViewPage)
        
        // Opción 1: imageUrl en el objeto principal
        if ((ad as any).imageUrl) {
          console.log('✅ Imagen encontrada en ad.imageUrl para ad', numId);
          images[numId] = (ad as any).imageUrl;
          foundImage = true;
        } 
        // Opción 2: ad_image en firestoreData
        else if ((ad as any).firestoreData?.ad_image) {
          console.log('✅ Imagen encontrada en firestoreData.ad_image para ad', numId);
          images[numId] = (ad as any).firestoreData.ad_image;
          foundImage = true;
        }
        // Opción 3: content.imageUrl en firestoreData
        else if ((ad as any).firestoreData?.content?.imageUrl) {
          console.log('✅ Imagen encontrada en firestoreData.content.imageUrl para ad', numId);
          images[numId] = (ad as any).firestoreData.content.imageUrl;
          foundImage = true;
        }
        // Opción 4: imageUrl directo en firestoreData
        else if ((ad as any).firestoreData?.imageUrl) {
          console.log('✅ Imagen encontrada en firestoreData.imageUrl para ad', numId);
          images[numId] = (ad as any).firestoreData.imageUrl;
          foundImage = true;
        }
        
        // Opción 5: Intentar con el servicio (fallback)
        if (!foundImage) {
          try {
            console.log('⚠️ Intentando cargar imagen desde servicio para ad', numId);
            const url = await AdsService.getAdImg(numId);
            if (url) {
              images[numId] = url as string;
              foundImage = true;
            }
          } catch (e) {
            console.warn(`❌ No se pudo cargar imagen para ad ${numId} desde servicio`);
          }
        }
        
        // Si no encontró nada, usar placeholder
        if (!foundImage) {
          console.warn(`⚠️ No se encontró imagen para ad ${numId}, usando placeholder`);
          images[numId] = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239fa4b4' font-family='Montserrat' font-size='24'%3EPublicidad%3C/text%3E%3C/svg%3E`;
        }
      }
      
      setAdImages(images);
    };
    
    if (selectedNumbers.length > 0) {
      loadImages();
    } else {
      setAdImages({});
    }
    
    // Reset carousel index cuando cambian las selecciones
    setCurrentAdIndex(0);
  }, [selectedNumbers, adsList]);

  // Funciones del carrusel
  const selectedAds = adsList.filter((ad) => 
    selectedNumbers.includes(typeof ad.id === 'number' ? ad.id : parseInt(String(ad.id)))
  );
  
  const nextAd = () => {
    if (selectedAds.length > 0) {
      setCurrentAdIndex((prev) => (prev + 1) % selectedAds.length);
    }
  };

  const prevAd = () => {
    if (selectedAds.length > 0) {
      setCurrentAdIndex((prev) => (prev - 1 + selectedAds.length) % selectedAds.length);
    }
  };

  const goToAd = (index: number) => {
    setCurrentAdIndex(index);
  };

  const validationSchema = Yup.object().shape({});

  const onSubmit = async () => {
    if (selectedFirestoreIds.length === 0) {
      setError({
        show: true,
        message:
          'Selecciona al menos un publicidad para que sea parte de tu estrategia de comunicación.',
      });
    } else {
      // Guardar los firestoreIds en lugar de los IDs numéricos
      console.log('💾 Guardando IDs de publicidades:', selectedFirestoreIds);
      dispatch(setNewStrategyAds(selectedFirestoreIds as any));
      navigate(
        `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.GROUPS}`
      );
      reset();
    }
  };

  const handleAdsSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    firestoreId: string
  ) => {
    const isChecked = e.target.checked;
    
    // Actualizar IDs numéricos (para UI)
    setSelectedNumbers((prevSelectedNumbers) => {
      if (isChecked) {
        return [...prevSelectedNumbers, id];
      } else {
        return prevSelectedNumbers.filter((number) => number !== id);
      }
    });
    
    // Actualizar firestoreIds (para guardar en estrategia)
    setSelectedFirestoreIds((prevIds) => {
      if (isChecked) {
        return [...prevIds, firestoreId];
      } else {
        return prevIds.filter((fid) => fid !== firestoreId);
      }
    });
  };

  const { handleSubmit, reset } = useForm<INewGoupInfo | {}>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-strategy-main">
      <div className="geco-strategy-nav-bar">
        <Link className="geco-strategy-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-strategy-nav-bar-section" to="/strategy">
          <GCircularButton
            icon={GStrategyIcon}
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
      <div className="geco-strategy-header-title">
        <GHeadSectionTitle
          title={CreateStrategyAdsTitle.title}
          subtitle={CreateStrategyAdsTitle.subtitle}
        />
      </div>

      <form
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="content-builder-container">
          {/* Panel izquierdo: Selección de publicidades */}
          <div className="content-builder-settings">
            <div className="config-section">
              <h3
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                📢 Seleccioná tus publicidades
              </h3>

              {Array.isArray(adsList) && adsList.length !== 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {adsList.map((ad) => (
                    <label
                      key={ad.id}
                      className="geco-strategy-item-card"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: selectedNumbers.includes(typeof ad.id === 'number' ? ad.id : parseInt(String(ad.id)))
                          ? '2px solid #1947E5'
                          : '2px solid #18191f',
                        background: selectedNumbers.includes(typeof ad.id === 'number' ? ad.id : parseInt(String(ad.id)))
                          ? '#f0f4ff'
                          : '#fff',
                      }}
                    >
                      <div className="geco-strategy-item-body">
                        <h1 className="geco-strategy-item-name">{ad.title}</h1>
                        <div className="geco-strategy-item-info">
                          <p>{getDateString(ad.create_date)}</p>
                        </div>
                      </div>
                      <input
                        className="geco-checkbox"
                        type="checkbox"
                        id={`strategy-${ad.id}`}
                        checked={selectedNumbers.includes(
                          typeof ad.id === 'string' ? parseInt(ad.id) : ad.id
                        )}
                        onChange={(e) =>
                          handleAdsSelection(
                            e,
                            typeof ad.id === 'string' ? parseInt(ad.id) : ad.id,
                            ad.firestoreId || String(ad.id)
                          )
                        }
                      />
                    </label>
                  ))}
                  {error.show && (
                    <span
                      className="span-error"
                      style={{ display: 'block', marginTop: '8px' }}
                    >
                      {error.message}
                    </span>
                  )}
                </div>
              ) : (
                <div className="geco-strategy-empty">
                  <Link to={'/ad'}>
                    <div className="geco-strategys-empty">
                      <p>{NewStrategyAdsEmpty}</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Panel derecho: Preview del carrusel */}
          <div className="content-builder-preview desktop-sticky">
            <div
              className="config-section"
              style={{ padding: '16px', background: '#f9fafc' }}
            >
              <h3
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                👁️ Vista previa
              </h3>

              {selectedAds.length === 0 ? (
                <div
                  style={{
                    border: '2px dashed #cfd3dc',
                    borderRadius: '8px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#9FA4B4',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '8px' }}>📸</div>
                  <div style={{ fontSize: '14px' }}>
                    Seleccioná publicidades para ver la previsualización
                  </div>
                </div>
              ) : (
                <Box
                  sx={{
                    border: '2px solid #18191f',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#fff',
                    boxShadow: '0 2px 0 #18191f',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Carrusel principal */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      mb: 2,
                    }}
                  >
                    {/* Botón anterior */}
                    {selectedAds.length > 1 && (
                      <IconButton
                        onClick={prevAd}
                        sx={{
                          position: 'absolute',
                          left: 0,
                          zIndex: 2,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          border: '2px solid #18191f',
                          width: 36,
                          height: 36,
                          '&:hover': {
                            bgcolor: '#FFD21E',
                          },
                        }}
                      >
                        <ArrowBackIosIcon sx={{ fontSize: 16, ml: 0.5 }} />
                      </IconButton>
                    )}

                    {/* Contenido de la publicidad actual */}
                    <Card
                      sx={{
                        width: '100%',
                        maxWidth: 300,
                        height: 'auto',
                        maxHeight: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '2px solid #18191f',
                        borderRadius: '8px',
                        boxShadow: 'none',
                      }}
                    >
                      {/* Imagen */}
                      {(() => {
                        const currentAd = selectedAds[currentAdIndex];
                        if (!currentAd) return null;
                        const adId: number = typeof currentAd.id === 'number' ? currentAd.id : parseInt(String(currentAd.id));
                        const imageUrl = adImages[adId];
                        return imageUrl ? (
                          <CardMedia
                            component="img"
                            image={imageUrl}
                            alt={currentAd?.title || 'Publicidad'}
                            sx={{
                              height: 240,
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 240,
                              background: 'repeating-linear-gradient(-45deg,#e5e7eb,#e5e7eb 10px,#f3f4f6 10px,#f3f4f6 20px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: 'Montserrat',
                                color: '#9fa4b4',
                                fontSize: '1rem',
                              }}
                            >
                              Cargando...
                            </Typography>
                          </Box>
                        );
                      })()}

                      {/* Contenido */}
                      <CardContent
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          textAlign: 'center',
                          p: 2,
                          overflow: 'auto',
                          maxHeight: 260,
                        }}
                      >
                        {selectedAds[currentAdIndex]?.title && (
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: 'Montserrat',
                              fontWeight: 700,
                              color: '#18191f',
                              mb: 1,
                              fontSize: '1rem',
                              wordWrap: 'break-word',
                            }}
                          >
                            {selectedAds[currentAdIndex].title}
                          </Typography>
                        )}
                        {selectedAds[currentAdIndex]?.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'Montserrat',
                              fontWeight: 500,
                              color: '#666',
                              lineHeight: 1.4,
                              fontSize: '0.85rem',
                              wordWrap: 'break-word',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {selectedAds[currentAdIndex].description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>

                    {/* Botón siguiente */}
                    {selectedAds.length > 1 && (
                      <IconButton
                        onClick={nextAd}
                        sx={{
                          position: 'absolute',
                          right: 0,
                          zIndex: 2,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          border: '2px solid #18191f',
                          width: 36,
                          height: 36,
                          '&:hover': {
                            bgcolor: '#FFD21E',
                          },
                        }}
                      >
                        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    )}
                  </Box>

                  {/* Indicadores (dots) */}
                  {selectedAds.length > 1 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      {selectedAds.map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => goToAd(index)}
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor:
                              index === currentAdIndex ? '#1947E5' : '#ccc',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            '&:hover': {
                              bgcolor:
                                index === currentAdIndex ? '#1947E5' : '#999',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Contador */}
                  {selectedAds.length > 1 && (
                    <Typography
                      variant="caption"
                      sx={{
                        textAlign: 'center',
                        color: '#666',
                        mt: 1,
                        fontFamily: 'Montserrat',
                        fontSize: '0.75rem',
                      }}
                    >
                      {currentAdIndex + 1} de {selectedAds.length}
                    </Typography>
                  )}
                </Box>
              )}
            </div>
          </div>
        </div>

        {/* Botón de submit */}
        <div style={{ marginTop: '24px' }}>
          <GSubmitButton
            label="Siguiente"
            colorBackground={GYellow}
            colorFont={GBlack}
            icon={GChevronRightBlackIcon}
            disabled={adsList.length === 0}
          />
        </div>
      </form>
    </div>
  );
};
