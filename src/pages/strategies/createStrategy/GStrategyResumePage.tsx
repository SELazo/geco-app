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
import { useEffect, useState } from 'react';
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

const { getGroups } = GroupsService;
const { getAds } = AdsService;
const { getPeriodicity } = StrategyService;
const { newStrategy } = StrategiesService;

export const GStrategyResumePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);
  const navigate = useNavigate();

  const strategyForm: INewStrategyForm = useSelector(
    (state: RootState) => state.auth.formNewStrategy
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      if (strategyForm) {
        try {
          const groups: IGroup[] = [];
          const groupsData = await getGroups();
          const ads: IGetAdResponse[] = [];
          const adsData = await getAds();

          if (strategyForm.ads && strategyForm.ads.length > 0 && adsData.data) {
            adsData.data.map((ad) => {
              const findAd = strategyForm.ads.find((adId) => adId === ad.id);

              if (findAd) {
                ads.push(ad);
              }
            });
          }
          if (strategyForm.groups && strategyForm.groups.length > 0) {
            groupsData.map((group) => {
              const findGroup = strategyForm.groups.find(
                (groupId) => groupId === group.id
              );

              if (findGroup) {
                groups.push(group);
              }
            });
          }

          setGroupsList(groups);
          setAdsList(ads);
          setLoading(false);
        } catch (error) {
          console.log(error); // TODO: Mostrar error en pantalla
        }
      }
    };

    fetchGroups();
  }, [strategyForm]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const startDate = new Date(strategyForm.startDate);
    const endDate = new Date(strategyForm.endDate);
    console.log('Creando estrategia (antes de payload):', {
      name: strategyForm.title,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      periodicity: strategyForm.periodicity,
      schedule: strategyForm.schedule,
      ads: strategyForm.ads,
      groups: strategyForm.groups,
      formTypeUI: strategyForm.formType,
      formConfigUI: strategyForm.formConfig,
    });

    const mapFormType = (t?: string): string | undefined => {
      switch (t) {
        case 'Pedido rápido':
          return 'quick_order';
        case 'Contacto simple':
          return 'simple_contact';
        case 'Reservas / turnos':
          return 'booking';
        case 'Catálogo':
          return 'catalog';
        default:
          return undefined;
      }
    };
    const form_type = strategyForm?.enableForm ? mapFormType(strategyForm?.formType) : undefined;
    const form_config = strategyForm.formConfig;
    console.log('Payload a enviar (newStrategy):', {
      name: strategyForm.title,
      start_date: startDate,
      end_date: endDate,
      periodicity: strategyForm.periodicity,
      schedule: strategyForm.schedule,
      ads: strategyForm.ads,
      groups: strategyForm.groups,
      form_type,
      form_config,
    });
    try {
      const response = await newStrategy(
        strategyForm.title,
        startDate,
        endDate,
        strategyForm.periodicity,
        strategyForm.schedule,
        strategyForm.ads,
        strategyForm.groups,
        form_type,
        form_config
      );

      console.log('Respuesta del backend:', response);

      if (response && response.success) {
        dispatch(clearNewStrategyForm());
        navigate(
          `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.SUCCESS}`
        );
      } else {
        console.error('Error al crear estrategia:', response);
        navigate(
          `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.ERROR}`
        );
      }
    } catch (error) {
      console.error('Error en la creación de estrategia:', error);
      navigate(
        `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.ERROR}`
      );
    }
    setLoading(false);
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
            <div>
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
            label="Crear estrategia! ✨"
            colorBackground={GYellow}
            colorFont={GBlack}
          />
        </form>
      )}
    </div>
  );
};
