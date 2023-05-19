import('../../styles/gcontacts.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import {
  AdminListContacts,
  ContactsSectionTitle,
  GroupsContacts,
} from '../../constants/wording';
import { GMenuOption } from '../../components/GMenuOption';
import { Link } from 'react-router-dom';
import { GLogoLetter } from '../../components/GLogoLetter';

export const GContactsPage = () => {
  return (
    <>
      <div className="geco-contacts">
        <div className="geco-contacts-head">
          <div className="geco-contacts-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
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
          <div className="geco-pricing-title">
            <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
          </div>
        </div>
        <div className="geco-contacts-body">
          <div className="geco-contacts-options">
            <GMenuOption option={AdminListContacts} />
            <GMenuOption option={GroupsContacts} />
          </div>
        </div>
      </div>
    </>
  );
};
