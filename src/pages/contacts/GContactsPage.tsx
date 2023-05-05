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

export const GContactsPage = () => {
  return (
    <>
      <div className="geco-contacts">
        <div className="geco-contacts-head">
          <div className="geco-contacts-header">
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
