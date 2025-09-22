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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { GroupsService } from '../../../services/external/groupsService';
import { IGroup } from '../../../interfaces/dtos/external/IGroups';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { PacmanLoader } from 'react-spinners';
import dayjs from 'dayjs';
import { StrategyService } from '../../../services/internal/strategyService';
import { StrategiesService } from '../../../services/external/strategiesService';
import { IStrategyProps } from '../../../components/GStrategyCard';

const { getGroups } = GroupsService;
const { getAds } = AdsService;
const { getPeriodicity } = StrategyService;
const { editStrategy } = StrategiesService;

export const GStrategyEditResumePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const strategyToEdit: IStrategyProps = location && location.state;

  useEffect(() => {
    console.log(strategyToEdit);
    if (!strategyToEdit) {
      navigate(`${ROUTES.STRATEGY.ROOT}`);
    }
    const fetchGroups = async () => {
      setLoading(true);
      if (strategyToEdit) {
        try {
          const groups: IGroup[] = [];
          const groupsData = await getGroups();
          const ads: IGetAdResponse[] = [];
          const adsData = await getAds();

          if (
            strategyToEdit.ads &&
            strategyToEdit.ads.length > 0 &&
            adsData.data
          ) {
            adsData.data.map((ad) => {
              const findAd = strategyToEdit.ads.find((adId) => adId === ad.id);

              if (findAd) {
                ads.push(ad);
              }
            });
          }
          if (strategyToEdit.groups && strategyToEdit.groups.length > 0) {
            groupsData.map((group) => {
              const findGroup = strategyToEdit.groups.find(
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
  }, [strategyToEdit]);

  const handleSubmit = async () => {
    setLoading(true);
    console.log('Editando estrategia (antes de payload):', {
      id: strategyToEdit.id,
      name: strategyToEdit.name,
      start_date: strategyToEdit.start_date,
      end_date: strategyToEdit.end_date,
      periodicity: strategyToEdit.periodicity,
      schedule: strategyToEdit.schedule,
      groups: strategyToEdit.groups,
      ads: strategyToEdit.ads,
      formTypeUI: (strategyToEdit as any)?.formType,
      formConfigUI: (strategyToEdit as any)?.formConfig,
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
    const form_type = (strategyToEdit as any)?.enableForm ? mapFormType((strategyToEdit as any)?.formType) : undefined;
    const form_config = (strategyToEdit as any)?.formConfig;
    console.log('Payload a enviar (editStrategy):', {
      id: strategyToEdit.id,
      name: strategyToEdit.name,
      start_date: strategyToEdit.start_date,
      end_date: strategyToEdit.end_date,
      periodicity: strategyToEdit.periodicity,
      schedule: strategyToEdit.schedule,
      groups: strategyToEdit.groups,
      ads: strategyToEdit.ads,
      form_type,
      form_config,
    });
    await editStrategy(strategyToEdit.id, {
      name: strategyToEdit.name,
      start_date: strategyToEdit.start_date,
      end_date: strategyToEdit.end_date,
      periodicity: strategyToEdit.periodicity,
      schedule: strategyToEdit.schedule,
      groups: strategyToEdit.groups,
      ads: strategyToEdit.ads,
      form_type,
      form_config,
    })
      .then((response) => {
        if (response.success) {
          navigate(
            `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.SUCCESS}`
          );
        }
      })
      .catch(() => {
        navigate(`${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.ERROR}`);
      });

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
        <div className="geco-form">
          <div className="geco-strategy-resume">
            <h3 className="geco-strategy-resume-title">
              {strategyToEdit.name.toUpperCase()}
            </h3>
            <div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Publicidades:</p>
                {adsList.map((ad) => (
                  <p
                    key={`ad${ad.id}`}
                    className="geco-strategy-resume-item-list"
                  >
                    • {ad.title}
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
                    • {group.name}
                  </p>
                ))}
              </div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Duración:</p>
                <p className="geco-strategy-resume-item">
                  {dayjs(strategyToEdit.start_date).format('DD/MM/YYYY')}
                  {' - '}
                  {dayjs(strategyToEdit.end_date).format('DD/MM/YYYY')}
                </p>
              </div>
              <div>
                <p className="geco-strategy-resume-item-title">Difusión:</p>
                <p className="geco-strategy-resume-item">
                  {strategyToEdit.schedule}
                </p>
              </div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Periodicidad:</p>
                <p className="geco-strategy-resume-item">
                  {getPeriodicity(strategyToEdit.periodicity)}
                </p>
              </div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Formulario:</p>
                <p className="geco-strategy-resume-item">
                  {(strategyToEdit as any)?.enableForm ? 'Sí' : 'No'}
                </p>
              </div>
              {(strategyToEdit as any)?.enableForm ? (
                <div className="geco-strategy-resume-item">
                  <p className="geco-strategy-resume-item-title">Tipo de formulario:</p>
                  <p className="geco-strategy-resume-item">{(strategyToEdit as any)?.formType || 'No especificado'}</p>
                  {(strategyToEdit as any)?.formType === 'Reservas / turnos' && (strategyToEdit as any)?.formConfig ? (
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">Configuración de reservas:</p>
                      <p className="geco-strategy-resume-item">Días hacia adelante: {(strategyToEdit as any).formConfig.allow_days_ahead ?? '-'}</p>
                      <p className="geco-strategy-resume-item">Duración turno (min): {(strategyToEdit as any).formConfig.time_slot_minutes ?? '-'}</p>
                      <p className="geco-strategy-resume-item">Requerir nombre: {(strategyToEdit as any).formConfig.require_name ? 'Sí' : 'No'}</p>
                      <p className="geco-strategy-resume-item">Requerir teléfono: {(strategyToEdit as any).formConfig.require_phone ? 'Sí' : 'No'}</p>
                      {Array.isArray((strategyToEdit as any).formConfig.services) && (strategyToEdit as any).formConfig.services.length > 0 ? (
                        <div>
                          <p className="geco-strategy-resume-item-title">Servicios:</p>
                          {(strategyToEdit as any).formConfig.services.map((s: string, idx: number) => (
                            <p key={`service-${idx}`} className="geco-strategy-resume-item">• {s}</p>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {(strategyToEdit as any)?.formType === 'Catálogo' && (strategyToEdit as any)?.formConfig ? (
                    <div className="geco-strategy-resume-item">
                      <p className="geco-strategy-resume-item-title">Configuración de catálogo:</p>
                      {Array.isArray((strategyToEdit as any).formConfig.categories) && (strategyToEdit as any).formConfig.categories.length > 0 ? (
                        <div>
                          <p className="geco-strategy-resume-item-title">Categorías:</p>
                          {(strategyToEdit as any).formConfig.categories.map((c: string, idx: number) => (
                            <p key={`cat-${idx}`} className="geco-strategy-resume-item">• {c}</p>
                          ))}
                        </div>
                      ) : (
                        <p className="geco-strategy-resume-item">Sin categorías</p>
                      )}
                      <p className="geco-strategy-resume-item">Permitir cantidad: {(strategyToEdit as any).formConfig.allow_quantity ? 'Sí' : 'No'}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
          <div onClick={handleSubmit}>
            <GSubmitButton
              label="Editar estrategia! ✨"
              colorBackground={GYellow}
              colorFont={GBlack}
            />
          </div>
        </div>
      )}
    </div>
  );
};
