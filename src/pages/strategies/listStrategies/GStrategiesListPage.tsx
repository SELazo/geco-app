import('../../../styles/gcontactsList.css');

import { useEffect, useState } from 'react';

import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack, GStrategyIcon } from '../../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { StrategyHeadCenterTitle } from '../../../constants/wording';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { ROUTES } from '../../../constants/routes';
import { IStrategyResponse } from '../../../interfaces/dtos/external/IStrategies';
import { StrategiesService } from '../../../services/external/strategiesService';
import { GStrategyCard } from '../../../components/GStrategyCard';

const { getStrategies } = StrategiesService;

export const GStrategiesListPage = () => {
  const [strategies, setStrategies] = useState<IStrategyResponse[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getStrategies();
        const contactsData = response as ApiResponse<IStrategyResponse[]>;
        setStrategies(contactsData.data ?? []);
      } catch (error) {
        console.error(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchContacts();
  }, []);

  return (
    <>
      <div className="geco-contacts-list">
        <div className="geco-contacts-list-head">
          <div className="geco-contacts-list-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link className="geco-contacts-list-nav-bar-section" to="/strategy">
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
        </div>
        <div className="geco-contacts-list-title">
          <GHeadCenterTitle title={StrategyHeadCenterTitle} color={GBlack} />
        </div>
        {strategies.length > 0 && (
          <div className="geco-contacts-list-container">
            <div className="geco-contacts-list-ul">
              <div className="geco-contacts-list-item">
                {strategies.map((item) => (
                  <div key={`strategyCard${item.id}`}>
                    <GStrategyCard
                      id={item.id}
                      name={item.name}
                      start_date={item.start_date}
                      end_date={item.end_date}
                      periodicity={item.periodicity}
                      schedule={item.schedule}
                      ads={item.ads}
                      groups={item.groups}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {strategies.length === 0 && (
          <div className="geco-contacts-empty">
            <p>No tiene estrategias aún.</p>
          </div>
        )}
      </div>
    </>
  );
};
