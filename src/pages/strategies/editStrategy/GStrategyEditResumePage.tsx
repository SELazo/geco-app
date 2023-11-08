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
    console.log(strategyToEdit);
    setLoading(true);
    await editStrategy(strategyToEdit.id, {
      name: strategyToEdit.name,
      start_date: strategyToEdit.start_date,
      end_date: strategyToEdit.end_date,
      periodicity: strategyToEdit.periodicity,
      schedule: strategyToEdit.schedule,
      groups: strategyToEdit.groups,
      ads: strategyToEdit.ads,
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
