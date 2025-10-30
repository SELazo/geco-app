import { useDispatch, useSelector } from 'react-redux';
import {
  INewStrategyForm,
  clearNewStrategyForm,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import('../../../styles/gstrategyItem.css');

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
            const adsPromises = strategyForm.ads.map(adId => 
              AdsFirestoreService.getAd(String(adId))
            );
            const firestoreAds = await Promise.all(adsPromises);
            
            // Mapear a formato esperado
            firestoreAds.forEach((ad: any) => {
              if (ad) {
                let dateString = new Date().toISOString();
                if (ad.createdAt) {
                  if (typeof ad.createdAt === 'object' && 'seconds' in ad.createdAt) {
                    dateString = new Date((ad.createdAt as any).seconds * 1000).toISOString();
                  } else if (ad.createdAt instanceof Date) {
                    dateString = ad.createdAt.toISOString();
                  }
                }
                
                ads.push({
                  id: ad.id || '',
                  firestoreId: ad.id || '',
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
                  }
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // 🔒 SOLUCIÓN DEFINITIVA: Usar sessionStorage como barrera global
    const submissionKey = `strategy_submit_${Date.now()}`;
    const lastSubmission = sessionStorage.getItem('last_strategy_submission');
    
    if (lastSubmission) {
      const timeSinceLastSubmit = Date.now() - parseInt(lastSubmission);
      if (timeSinceLastSubmit < 3000) { // Menos de 3 segundos
        console.log('⏳ Bloqueo de seguridad: Ya se creó una estrategia hace', timeSinceLastSubmit, 'ms');
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
    const submitButton = event.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
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
        userId: String(userId)
      };
      
      // SOLO si enableForm es true Y formType tiene valor, agregar campos de formulario
      if (strategyForm.enableForm && strategyForm.formType) {
        baseStrategyData.formType = strategyForm.formType;
        
        // SOLO si formConfig existe y tiene contenido, agregarlo
        if (strategyForm.formConfig && Object.keys(strategyForm.formConfig).length > 0) {
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
      
      const strategyId = await StrategiesFirestoreService.createStrategy(finalData);
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
              deleted_date: null
            })
          );
        await Promise.all(adsPromises);
        console.log(`✅ ${adsPromises.length} relaciones con publicidades creadas`);
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
              deleted_date: null
            })
          );
        await Promise.all(groupsPromises);
        console.log(`✅ ${groupsPromises.length} relaciones con grupos creadas`);
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
        <form className="geco-form" onSubmit={handleSubmit}>
          <div className="geco-strategy-resume">
            <h3 className="geco-strategy-resume-title">
              {strategyForm?.title?.toUpperCase() || 'ESTRATEGIA SIN NOMBRE'}
            </h3>
            <div style={{ textAlign: 'left' }}>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Publicidades:</p>
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
                <p className="geco-strategy-resume-item-title">Duración:</p>
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
                <p className="geco-strategy-resume-item-title">Difusión:</p>
                <p className="geco-strategy-resume-item">
                  {strategyForm?.schedule || 'Horario no definido'}
                </p>
              </div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Periodicidad:</p>
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
                  {/* Configuración detallada */}
                  {strategyForm?.formType === 'Reservas / turnos' &&
                  strategyForm?.formConfig ? (
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">
                        Configuración de reservas:
                      </p>
                      <p className="geco-strategy-resume-item">
                        Días hacia adelante:{' '}
                        {strategyForm.formConfig.allow_days_ahead ?? '-'}
                      </p>
                      <p className="geco-strategy-resume-item">
                        Duración turno (min):{' '}
                        {strategyForm.formConfig.time_slot_minutes ?? '-'}
                      </p>
                      <p className="geco-strategy-resume-item">
                        Requerir nombre:{' '}
                        {strategyForm.formConfig.require_name ? 'Sí' : 'No'}
                      </p>
                      <p className="geco-strategy-resume-item">
                        Requerir teléfono:{' '}
                        {strategyForm.formConfig.require_phone ? 'Sí' : 'No'}
                      </p>
                      {Array.isArray(strategyForm.formConfig.services) &&
                      strategyForm.formConfig.services.length > 0 ? (
                        <div>
                          <p className="geco-strategy-resume-item-title">
                            Servicios:
                          </p>
                          {strategyForm.formConfig.services.map(
                            (s: string, idx: number) => (
                              <p
                                key={`service-${idx}`}
                                className="geco-strategy-resume-item"
                              >
                                {s}
                              </p>
                            )
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {strategyForm?.formType === 'Catálogo' &&
                  strategyForm?.formConfig ? (
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">
                        Configuración de catálogo:
                      </p>
                      {Array.isArray(strategyForm.formConfig.categories) &&
                      strategyForm.formConfig.categories.length > 0 ? (
                        <div>
                          <p className="geco-strategy-resume-item-title">
                            Categorías:
                          </p>
                          {strategyForm.formConfig.categories.map(
                            (c: string, idx: number) => (
                              <p
                                key={`cat-${idx}`}
                                className="geco-strategy-resume-item"
                              >
                                • {c}
                              </p>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="geco-strategy-resume-item">
                          Sin categorías
                        </p>
                      )}
                      <p className="geco-strategy-resume-item">
                        Permitir cantidad:{' '}
                        {strategyForm.formConfig.allow_quantity ? 'Sí' : 'No'}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <GSubmitButton
            label={loading ? "Creando..." : "Crear estrategia! ✨"}
            colorBackground={GYellow}
            colorFont={GBlack}
            disabled={loading}
          />
        </form>
      )}
    </div>
  );
};
