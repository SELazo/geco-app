import { useDispatch, useSelector } from 'react-redux';
import {
  INewStrategyForm,
  clearNewStrategyForm,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import('../../../styles/gstrategyItem.css');
import '../../../styles/gcreatead.css';
import '../../../styles/gpublic-strategy.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack, GStrategyIcon } from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { CreateStrategyResumeTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState, useRef } from 'react';
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
import { GroupsService } from '../../../services/external/groupsService';
import { IGroup } from '../../../interfaces/dtos/external/IGroups';
import { RootState } from '../../../redux/gecoStore';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { PacmanLoader } from 'react-spinners';
import dayjs from 'dayjs';
import { StrategyService } from '../../../services/internal/strategyService';
import { StrategiesService } from '../../../services/external/strategiesService';
import { StrategiesFirestoreService } from '../../../services/external/strategiesFirestoreService';
import { FirestoreService } from '../../../services/external/firestoreService';
import { SessionService } from '../../../services/internal/sessionService';
import { AdsFirestoreService } from '../../../services/external/adsFirestoreService';
import { IAd } from '../../../interfaces/dtos/external/IFirestore';

const { getGroups } = GroupsService;
const { getAds } = AdsService;
const { getPeriodicity } = StrategyService;
const { newStrategy } = StrategiesService;

export const GStrategyResumePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState<number>(0);
  const [adImages, setAdImages] = useState<Record<string, string>>({});
  const isSubmitting = useRef(false); // ✅ Flag para prevenir doble-click
  const navigate = useNavigate();

  const strategyForm: INewStrategyForm = useSelector(
    (state: RootState) => state.formNewStrategy
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (strategyForm) {
        try {
          console.log('🔍 Cargando datos para resumen...');
          console.log('📋 IDs de publicidades:', strategyForm.ads);
          console.log('📋 IDs de grupos:', strategyForm.groups);

          const groups: IGroup[] = [];
          const groupsData = await getGroups();
          const ads: IGetAdResponse[] = [];

          // Cargar publicidades desde Firestore usando los firestoreIds
          if (strategyForm.ads && strategyForm.ads.length > 0) {
            const adsPromises = strategyForm.ads.map((adId) =>
              AdsFirestoreService.getAd(String(adId))
            );
            const firestoreAds = await Promise.all(adsPromises);

            // Mapear a formato esperado
            firestoreAds.forEach((ad: any) => {
              if (ad) {
                let dateString = new Date().toISOString();
                if (ad.createdAt) {
                  if (
                    typeof ad.createdAt === 'object' &&
                    'seconds' in ad.createdAt
                  ) {
                    dateString = new Date(
                      (ad.createdAt as any).seconds * 1000
                    ).toISOString();
                  } else if (ad.createdAt instanceof Date) {
                    dateString = ad.createdAt.toISOString();
                  }
                }

                // 🔍 BUSCAR IMAGEN EN MÚLTIPLES UBICACIONES
                let imageUrl = '';
                if (ad.ad_image) {
                  imageUrl = ad.ad_image;
                } else if (ad.content?.imageUrl) {
                  imageUrl = ad.content.imageUrl;
                } else if (ad.imageUrl) {
                  imageUrl = ad.imageUrl;
                }

                ads.push({
                  id: ad.id || '',
                  firestoreId: ad.id || '',
                  firestoreData: ad,
                  title: ad.ad_title || ad.title || '', // ✅ Leer ad_title
                  description: ad.ad_description || ad.description || '', // ✅ Leer ad_description
                  size: ad.ad_size || ad.size || '1080x1080',
                  create_date: dateString,
                  deleted_date: null,
                  account_id: parseInt(
                    ad.userId || ad.accounts_account_id || '0'
                  ),
                  ad_template: {
                    id: 1,
                    type:
                      ad.ad_template?.disposition_pattern || ad.template || '',
                    disposition_pattern:
                      ad.ad_template?.disposition_pattern || ad.template || '',
                    color_text:
                      ad.ad_template?.color_text || ad.palette || '#000000',
                  },
                  imageUrl: imageUrl,
                });
              }
            });

            console.log(`✅ ${ads.length} publicidades cargadas para resumen`);
          }

          // Cargar grupos
          if (strategyForm.groups && strategyForm.groups.length > 0) {
            groupsData.map((group) => {
              const findGroup = strategyForm.groups.find(
                (groupId) => groupId === group.id
              );

              if (findGroup) {
                groups.push(group);
              }
            });

            console.log(`✅ ${groups.length} grupos cargados para resumen`);
          }

          setGroupsList(groups);
          setAdsList(ads);
          setLoading(false);
        } catch (error) {
          console.error('❌ Error cargando datos para resumen:', error);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [strategyForm]);

  // Cargar imágenes de publicidades
  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string> = {};

      for (const ad of adsList) {
        if ((ad as any).imageUrl) {
          images[String(ad.id)] = (ad as any).imageUrl;
        }
      }

      setAdImages(images);
    };

    if (adsList.length > 0) {
      loadImages();
    }
  }, [adsList]);

  // Funciones del carrusel
  const nextAd = () => {
    if (adsList.length > 0) {
      setCurrentAdIndex((prev) => (prev + 1) % adsList.length);
    }
  };

  const prevAd = () => {
    if (adsList.length > 0) {
      setCurrentAdIndex((prev) => (prev - 1 + adsList.length) % adsList.length);
    }
  };

  const goToAd = (index: number) => {
    setCurrentAdIndex(index);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 🔒 SOLUCIÓN DEFINITIVA: Usar sessionStorage como barrera global
    const submissionKey = `strategy_submit_${Date.now()}`;
    const lastSubmission = sessionStorage.getItem('last_strategy_submission');

    if (lastSubmission) {
      const timeSinceLastSubmit = Date.now() - parseInt(lastSubmission);
      if (timeSinceLastSubmit < 3000) {
        // Menos de 3 segundos
        console.log(
          '⏳ Bloqueo de seguridad: Ya se creó una estrategia hace',
          timeSinceLastSubmit,
          'ms'
        );
        return;
      }
    }

    // Marcar inmediatamente en sessionStorage
    sessionStorage.setItem('last_strategy_submission', String(Date.now()));

    // Prevenir múltiples clicks con useRef
    if (isSubmitting.current) {
      console.log('⏳ Ya hay una creación en proceso, ignorando...');
      return;
    }

    isSubmitting.current = true;

    // Desactivar el botón INMEDIATAMENTE
    const submitButton = event.currentTarget.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.style.pointerEvents = 'none';
      submitButton.style.opacity = '0.6';
    }

    setLoading(true);

    try {
      console.log('📝 Iniciando creación de estrategia...');

      // Obtener usuario de localStorage
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        console.error('❌ No hay usuario disponible');
        navigate('/login');
        return;
      }

      const user = JSON.parse(storedUser);
      if (!user || (!user.id && !user.email)) {
        console.error('❌ Usuario inválido');
        navigate('/login');
        return;
      }

      const userId = user.id || user.email;
      console.log('👤 Usuario ID:', userId);

      const startDate = new Date(strategyForm.startDate);
      const endDate = new Date(strategyForm.endDate);

      console.log('📋 Datos de la estrategia:', {
        title: strategyForm.title,
        startDate,
        endDate,
        periodicity: strategyForm.periodicity,
        schedule: strategyForm.schedule,
        ads: strategyForm.ads,
        groups: strategyForm.groups,
        formType: strategyForm.formType,
      });

      // 1. Crear estrategia en Firestore (DIRECTO - igual que publicidades)
      // Construir objeto base SIN formType ni formConfig
      const baseStrategyData: any = {
        title: strategyForm.title || 'Sin título',
        description: '',
        ads: (strategyForm.ads || []).map((id: any) => String(id)),
        groups: (strategyForm.groups || []).map((id: any) => String(id)),
        startDate,
        endDate,
        periodicity: strategyForm.periodicity || 'Única vez',
        schedule: strategyForm.schedule || '09:00',
        enableForm: Boolean(strategyForm.enableForm),
        status: 'active',
        userId: String(userId),
      };

      // SOLO si enableForm es true Y formType tiene valor, agregar campos de formulario
      if (strategyForm.enableForm && strategyForm.formType) {
        baseStrategyData.formType = strategyForm.formType;

        // SOLO si formConfig existe y tiene contenido, agregarlo
        if (
          strategyForm.formConfig &&
          Object.keys(strategyForm.formConfig).length > 0
        ) {
          baseStrategyData.formConfig = strategyForm.formConfig;
        } else {
          // Si no hay formConfig, poner un objeto vacío
          baseStrategyData.formConfig = {};
        }
      }

      console.log('🔍 enableForm:', strategyForm.enableForm);
      console.log('🔍 formType:', strategyForm.formType);
      console.log('🔍 formConfig:', strategyForm.formConfig);

      // Limpieza final con JSON para asegurar no hay undefined
      const finalData = JSON.parse(JSON.stringify(baseStrategyData));

      console.log('💾 Guardando estrategia en Firestore...');
      console.log('💾 Datos limpios:', finalData);
      console.log('💾 Datos en JSON:', JSON.stringify(finalData, null, 2));

      const strategyId = await StrategiesFirestoreService.createStrategy(
        finalData
      );
      console.log('✅ Estrategia creada con ID:', strategyId);

      // 2. Crear relaciones en ads_by_strategy
      if (strategyForm.ads && strategyForm.ads.length > 0) {
        console.log('🔗 Creando relaciones con publicidades...');
        console.log('📋 IDs de publicidades a relacionar:', strategyForm.ads);
        const adsPromises = strategyForm.ads
          .filter((adId: any) => adId) // Filtrar valores falsy
          .map((adId: any) =>
            FirestoreService.create('ads_by_strategy', {
              strategies_strategy_id: strategyId || '', // Guardar como string
              ads_ad_id: String(adId), // Asegurar que sea string
              add_date: new Date(),
              deleted_date: null,
            })
          );
        await Promise.all(adsPromises);
        console.log(
          `✅ ${adsPromises.length} relaciones con publicidades creadas`
        );
      }

      // 3. Crear relaciones en groups_by_strategy
      if (strategyForm.groups && strategyForm.groups.length > 0) {
        console.log('🔗 Creando relaciones con grupos...');
        const groupsPromises = strategyForm.groups
          .filter((groupId: any) => groupId) // Filtrar valores falsy
          .map((groupId: any) =>
            FirestoreService.create('groups_by_strategy', {
              strategies_strategy_id: strategyId || '', // Guardar como string
              groups_group_id: String(groupId), // Asegurar que sea string
              add_date: new Date(),
              deleted_date: null,
            })
          );
        await Promise.all(groupsPromises);
        console.log(
          `✅ ${groupsPromises.length} relaciones con grupos creadas`
        );
      }

      console.log('✅ Estrategia creada exitosamente');

      // Limpiar formulario y navegar a éxito
      dispatch(clearNewStrategyForm());
      navigate(`/strategy/create/success`);
    } catch (error) {
      console.error('❌ Error creando estrategia:', error);
      navigate(`/strategy/create/error`);
    } finally {
      setLoading(false);
      isSubmitting.current = false; // ✅ Resetear flag al finalizar
    }
  };

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
          title={CreateStrategyResumeTitle.title}
          subtitle={CreateStrategyResumeTitle.subtitle}
        />
      </div>
      {loading ? (
        <div
          style={{
            textAlign: 'start',
            marginTop: '25vh',
          }}
        >
          <PacmanLoader color={GYellow} />
        </div>
      ) : (
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
            {/* Panel izquierdo: Resumen de configuración */}
            <div className="content-builder-settings">
              <div className="config-section">
                <h3
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                  }}
                >
                  📋 Resumen de estrategia
                </h3>
                <div className="geco-strategy-resume">
                  <h3 className="geco-strategy-resume-title">
                    {strategyForm?.title?.toUpperCase() ||
                      'ESTRATEGIA SIN NOMBRE'}
                  </h3>
                  <div style={{ textAlign: 'left' }}>
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">
                        Publicidades:
                      </p>
                      {adsList.map((ad) => (
                        <p
                          key={`ad${ad.id}`}
                          className="geco-strategy-resume-item-list"
                        >
                          {ad.title}
                        </p>
                      ))}
                    </div>
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">Grupos:</p>

                      {groupsList.map((group) => (
                        <p
                          key={`group${group.id}`}
                          className="geco-strategy-resume-item-list"
                        >
                          {group.name}
                        </p>
                      ))}
                    </div>
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">
                        Duración:
                      </p>
                      <p className="geco-strategy-resume-item">
                        {strategyForm?.startDate
                          ? dayjs(strategyForm.startDate).format('DD/MM/YYYY')
                          : 'Fecha no definida'}
                        {' - '}
                        {strategyForm?.endDate
                          ? dayjs(strategyForm.endDate).format('DD/MM/YYYY')
                          : 'Fecha no definida'}
                      </p>
                    </div>
                    <div>
                      <p className="geco-strategy-resume-item-title">
                        Difusión:
                      </p>
                      <p className="geco-strategy-resume-item">
                        {strategyForm?.schedule || 'Horario no definido'}
                      </p>
                    </div>
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">
                        Periodicidad:
                      </p>
                      <p className="geco-strategy-resume-item">
                        {strategyForm?.periodicity
                          ? getPeriodicity(strategyForm.periodicity)
                          : 'Periodicidad no definida'}
                      </p>
                    </div>
                    {strategyForm?.enableForm ? (
                      <div className="geco-strategy-resume-item">
                        <p className="geco-strategy-resume-item-title">
                          Tipo de formulario:
                        </p>
                        <p className="geco-strategy-resume-item">
                          {strategyForm?.formType || 'No especificado'}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel derecho: Preview */}
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

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Carrusel de publicidades */}
                  {adsList.length > 0 && (
                    <Box
                      sx={{
                        border: '2px solid #18191f',
                        borderRadius: '12px',
                        padding: '16px',
                        background: '#fff',
                        boxShadow: '0 2px 0 #18191f',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Montserrat',
                          fontWeight: 700,
                          mb: 2,
                          textAlign: 'center',
                        }}
                      >
                        Publicidades
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          mb: 2,
                        }}
                      >
                        {adsList.length > 1 && (
                          <IconButton
                            onClick={prevAd}
                            sx={{
                              position: 'absolute',
                              left: -8,
                              zIndex: 2,
                              bgcolor: 'rgba(255,255,255,0.9)',
                              border: '2px solid #18191f',
                              width: 32,
                              height: 32,
                              '&:hover': { bgcolor: '#FFD21E' },
                            }}
                          >
                            <ArrowBackIosIcon sx={{ fontSize: 14, ml: 0.5 }} />
                          </IconButton>
                        )}
                        <Card
                          sx={{
                            width: '100%',
                            maxWidth: 260,
                            height: 'auto',
                            maxHeight: 400,
                            display: 'flex',
                            flexDirection: 'column',
                            border: '2px solid #18191f',
                            borderRadius: '8px',
                            boxShadow: 'none',
                          }}
                        >
                          {adImages[String(adsList[currentAdIndex]?.id)] ? (
                            <CardMedia
                              component="img"
                              image={
                                adImages[String(adsList[currentAdIndex]?.id)]
                              }
                              alt={
                                adsList[currentAdIndex]?.title || 'Publicidad'
                              }
                              sx={{ height: 200, objectFit: 'cover' }}
                            />
                          ) : (
                            <Box
                              sx={{
                                height: 200,
                                background:
                                  'repeating-linear-gradient(-45deg,#e5e7eb,#e5e7eb 10px,#f3f4f6 10px,#f3f4f6 20px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography sx={{ color: '#9fa4b4' }}>
                                Imagen
                              </Typography>
                            </Box>
                          )}
                          <CardContent
                            sx={{ p: 2, overflow: 'auto', maxHeight: 200 }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontFamily: 'Montserrat',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                mb: 0.5,
                                wordWrap: 'break-word',
                              }}
                            >
                              {adsList[currentAdIndex]?.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'Montserrat',
                                fontSize: '0.75rem',
                                color: '#666',
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {adsList[currentAdIndex]?.description}
                            </Typography>
                          </CardContent>
                        </Card>
                        {adsList.length > 1 && (
                          <IconButton
                            onClick={nextAd}
                            sx={{
                              position: 'absolute',
                              right: -8,
                              zIndex: 2,
                              bgcolor: 'rgba(255,255,255,0.9)',
                              border: '2px solid #18191f',
                              width: 32,
                              height: 32,
                              '&:hover': { bgcolor: '#FFD21E' },
                            }}
                          >
                            <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        )}
                      </Box>
                      {adsList.length > 1 && (
                        <>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              gap: 0.5,
                              mt: 1,
                            }}
                          >
                            {adsList.map((_, index) => (
                              <Box
                                key={index}
                                onClick={() => goToAd(index)}
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor:
                                    index === currentAdIndex
                                      ? '#1947E5'
                                      : '#ccc',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s',
                                }}
                              />
                            ))}
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              textAlign: 'center',
                              display: 'block',
                              mt: 0.5,
                              color: '#666',
                              fontSize: '0.7rem',
                            }}
                          >
                            {currentAdIndex + 1} de {adsList.length}
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}

                  {/* Formulario */}
                  {strategyForm?.enableForm && strategyForm?.formType ? (
                    <div
                      className="public-form"
                      style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px solid #18191f',
                        boxShadow: '0 2px 0 #18191f',
                      }}
                    >
                      <h3 className="public-form-title">
                        {strategyForm.formType}
                      </h3>
                      <div className="public-form-group">
                        <label>Nombre</label>
                        <input
                          className="public-form-input"
                          placeholder="Tu nombre"
                          disabled
                          style={{ cursor: 'not-allowed', opacity: 0.7 }}
                        />
                      </div>
                      <div className="public-form-group">
                        <label>Teléfono</label>
                        <div className="public-phone-row">
                          <select
                            className="public-form-input"
                            disabled
                            style={{ cursor: 'not-allowed', opacity: 0.7 }}
                          >
                            <option>+54 (AR)</option>
                          </select>
                          <input
                            className="public-form-input"
                            placeholder="Tu teléfono"
                            disabled
                            style={{ cursor: 'not-allowed', opacity: 0.7 }}
                          />
                        </div>
                      </div>
                      {strategyForm.formType === 'Reservas / turnos' &&
                        strategyForm.formConfig?.services &&
                        Array.isArray(strategyForm.formConfig.services) &&
                        strategyForm.formConfig.services.length > 0 && (
                          <div className="public-form-group">
                            <label>Servicio</label>
                            <select
                              className="public-form-input"
                              disabled
                              style={{ cursor: 'not-allowed', opacity: 0.7 }}
                            >
                              <option>Elegí un servicio</option>
                              {strategyForm.formConfig.services.map(
                                (s: string, idx: number) => (
                                  <option key={idx}>{s}</option>
                                )
                              )}
                            </select>
                          </div>
                        )}
                      {strategyForm.formType === 'Catálogo' &&
                        strategyForm.formConfig?.categories &&
                        Array.isArray(strategyForm.formConfig.categories) &&
                        strategyForm.formConfig.categories.length > 0 && (
                          <div className="public-form-group">
                            <label>Categoría</label>
                            <select
                              className="public-form-input"
                              disabled
                              style={{ cursor: 'not-allowed', opacity: 0.7 }}
                            >
                              <option>Elegí una categoría</option>
                              {strategyForm.formConfig.categories.map(
                                (c: string, idx: number) => (
                                  <option key={idx}>{c}</option>
                                )
                              )}
                            </select>
                          </div>
                        )}
                      <div className="public-form-group">
                        <label>Mensaje</label>
                        <textarea
                          className="public-form-input"
                          rows={3}
                          placeholder="Escribí tu mensaje"
                          disabled
                          style={{
                            cursor: 'not-allowed',
                            opacity: 0.7,
                            resize: 'none',
                          }}
                        />
                      </div>
                      <div className="public-form-note">
                        Formulario demostrativo
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        border: '2px dashed #cfd3dc',
                        borderRadius: '8px',
                        padding: '20px',
                        textAlign: 'center',
                        color: '#9FA4B4',
                        fontSize: '14px',
                      }}
                    >
                      Sin formulario
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de submit */}
          <div>
            <GSubmitButton
              label={loading ? 'Creando...' : 'Crear estrategia! ✨'}
              colorBackground={GYellow}
              colorFont={GBlack}
              disabled={loading}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default GStrategyResumePage;
