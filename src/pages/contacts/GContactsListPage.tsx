import('../../styles/gcontactsList.css');

import { GCircularButton } from '../../components/GCircularButton';
import { GIconButtonBack, GMoreInfoIcon } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import {
  AdminListContacts,
  ContactsSectionTitle,
  GroupsContacts,
} from '../../constants/wording';
import { GContactItem, IContactItem } from '../../components/GContactItem';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link } from 'react-router-dom';

export const GContactsListPage = () => {
  const contacts: IContactItem[] = [
    {
      id: 1,
      name: 'Jessica Altenburger',
      number: '+123456789',
      mail: 'nelson.loto@geco.com',
      route: `/contacts/edit/1`,
    },
    {
      id: 2,
      name: 'Maximiliano Vergara',
      number: '+123456789',
      mail: 'maximiliano.vergara@geco.com',
      route: `/contacts/edit/2`,
    },
    {
      id: 3,
      name: 'Nelson Loto',
      number: '+123456789',
      mail: 'nelson.loto@geco.com',
      route: `/contacts/edit/3`,
    },
    {
      id: 4,
      name: 'San Loto',
      number: '+123456789',
      mail: 'nelson.loto@geco.com',
      route: `/contacts/edit/4`,
    },
  ];
  return (
    <>
      <div className="geco-contacts-list">
        <div className="geco-contacts-list-head">
          <div className="geco-contacts-list-head-nav-bar">
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
          <div
            className="geco-contacts-list-head-nav-bar-right
          "
          >
            <GCircularButton
              icon={GMoreInfoIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
              onClickAction={NavigationService.goBack}
            />
          </div>
        </div>
        <div className="geco-contacts-list-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>
        <div className="geco-contacts-list-container">
          <div className="geco-contacts-list-ul">
            <div className="geco-contacts-list-item">
              {contacts.map((item) => (
                <GContactItem key={item.id} contact={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
