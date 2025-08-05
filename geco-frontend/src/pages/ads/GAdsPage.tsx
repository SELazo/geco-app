import('../../styles/gads.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { AdHeadCenterTitle, CreateAd, ListAds } from '../../constants/wording';
import { GMenuOption } from '../../components/GMenuOption';
import { Link } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';
import { ROUTES } from '../../constants/routes';

export const GAdsPage = () => {
  return (
    <div className="geco-ads">
      <div className="geco-ads-head">
        <div className="geco-ads-head-nav-bar">
          <Link className="geco-ads-head-nav-bar-logo" to="/home">
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
          <GHeadCenterTitle title={AdHeadCenterTitle} color={GBlack} />
        </div>
      </div>
      <div className="geco-ads-body">
        <div className="geco-ads-options">
          <GMenuOption option={CreateAd} />
          <GMenuOption option={ListAds} />
        </div>
      </div>
    </div>
  );
};
