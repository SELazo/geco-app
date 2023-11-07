import { useDispatch, useSelector } from 'react-redux';
import { INewStrategyForm } from '../../../redux/sessionSlice';

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

const { getGroups } = GroupsService;
const { getAds } = AdsService;
const { getPeriodicity } = StrategyService;

export const GStrategyResumePage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [adsList, setAdsList] = useState<IGetAdResponse[]>([]);
  const navigate = useNavigate();

  const strategyForm: INewStrategyForm = useSelector(
    (state: RootState) => state.auth.formNewStrategy
  );

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

  const handleSubmit = async () => {
    setLoading(true);
    //request
    setLoading(false);
    navigate(
      `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.SUCCESS}`
    );
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
              {strategyForm.title.toUpperCase()}
            </h3>
            <div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Publicidades:</p>
                {adsList.map((ad) => (
                  <p className="geco-strategy-resume-item-list">• {ad.title}</p>
                ))}
              </div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Grupos:</p>

                {groupsList.map((group) => (
                  <p className="geco-strategy-resume-item-list">
                    • {group.name}
                  </p>
                ))}
              </div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Duración:</p>
                <p className="geco-strategy-resume-item">
                  {dayjs(strategyForm.startDate).format('DD/MM/YYYY')}
                  {' - '}
                  {dayjs(strategyForm.endDate).format('DD/MM/YYYY')}
                </p>
              </div>
              <div>
                <p className="geco-strategy-resume-item-title">Difusión:</p>
                <p className="geco-strategy-resume-item">
                  {strategyForm.schedule}
                </p>
              </div>
              <div className="geco-strategy-resume-item">
                <p className="geco-strategy-resume-item-title">Periodicidad:</p>
                <p className="geco-strategy-resume-item">
                  {getPeriodicity(strategyForm.periodicity)}
                </p>
              </div>
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
