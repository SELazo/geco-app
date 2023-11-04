import('../../styles/gstrategy.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import {
  CreateStrategy,
  ListStrategies,
  StrategyHeadCenterTitle,
} from '../../constants/wording';
import { GMenuOption } from '../../components/GMenuOption';
import { Link } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';
import { ROUTES } from '../../constants/routes';

export const GStrategyPage = () => {
  return (
    <div className="geco-strategy">
      <div className="geco-strategy-head">
        <div className="geco-strategy-head-nav-bar">
          <Link className="geco-strategy-head-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <GCircularButton
            icon={GIconButtonBack}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
            onClickAction={NavigationService.handleNavigation(ROUTES.HOME)}
          />
        </div>
        <div className="geco-pricing-title">
          <GHeadCenterTitle title={StrategyHeadCenterTitle} color={GBlack} />
        </div>
      </div>
      <div className="geco-strategy-body">
        <div className="geco-strategy-options">
          <GMenuOption option={CreateStrategy} />
          <GMenuOption option={ListStrategies} />
        </div>
      </div>
    </div>
  );
};
