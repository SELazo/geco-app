import { Link } from 'react-router-dom';
import { GCircularButton } from '../../../components/GCircularButton';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GIconButtonBack, GStatisticsIcon } from '../../../constants/buttons';
import { GBlack, GRed, GWhite } from '../../../constants/palette';
import {
  ContactsHeadCenterTitle,
  GroupGrowthSectionTitle,
  RedCompositionSectionTitle,
  StatisticsSectionTitle,
} from '../../../constants/wording';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/gstatisticsContacts.css';

type ContactGrowthChartProps = {
  data: { label: string; values: number[]; color: string }[];
};

export const GStatisticsContactsPage = () => {
  return (
    <>
      <div className="geco-statistics-contacts">
        <div className="geco-statistics-contacts-head">
          <div className="geco-statistics-contacts-head-nav-bar">
            <Link
              className="geco-statistics-contacts-head-nav-bar-logo"
              to="/home"
            >
              <GLogoLetter />
            </Link>
            <Link
              className="geco-statistics-contacts-nav-bar-section"
              to="/statistics/info"
            >
              <GCircularButton
                icon={GStatisticsIcon}
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
        <div className="geco-statistics-contacts-title">
          <GHeadCenterTitle title={StatisticsSectionTitle} color={GBlack} />
        </div>
        <div className="geco-statistics-contacts-subtitle">
          <p>{ContactsHeadCenterTitle}</p>
        </div>
        <div className="geco-statistics-contacts-body">
          <div className="geco-statistics-contacts-icon">
            <GCircularButton
              icon={{ 'icon-type': 'chart-line', color: GRed }}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation(
                '/statistics/contacts/groups-growth'
              )}
            />
            <p>{GroupGrowthSectionTitle}</p>
          </div>
          <div className="geco-statistics-contacts-icon">
            <GCircularButton
              icon={{ 'icon-type': 'chart-pie', color: GRed }}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation(
                '/statistics/contacts/red-composition'
              )}
            />
            <p>{RedCompositionSectionTitle}</p>
          </div>
        </div>
      </div>
    </>
  );
};
