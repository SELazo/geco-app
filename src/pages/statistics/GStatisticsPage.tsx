import('../../styles/gstatistics.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import {
  AdminListContacts,
  FeedbackContactsStatistics,
  FeedbackStrategiesStatistics,
  GroupsContacts,
  StatisticsSectionTitle,
} from '../../constants/wording';
import { GMenuOption } from '../../components/GMenuOption';
import { Link } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';

export const GStatisticsPage = () => {
  return (
    <div className="geco-statistics">
      <div className="geco-statistics-head">
        <div className="geco-statistics-head-nav-bar">
          <Link className="geco-statistics-head-nav-bar-logo" to="/home">
            <GLogoLetter />
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
      <div className="geco-statistics-title">
        <GHeadCenterTitle title={StatisticsSectionTitle} color={GBlack} />
      </div>
      <div className="geco-statistics-body">
        <div className="geco-statistics-options">
          <GMenuOption option={FeedbackStrategiesStatistics} />
          <GMenuOption option={FeedbackContactsStatistics} />
        </div>
      </div>
    </div>
  );
};
