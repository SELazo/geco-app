import('../../styles/gcontactsGroups.css');

import { GCircularButton } from '../../components/GCircularButton';
import {
  GChevronLeftIcon,
  GChevronRightBlackIcon,
  GChevronRightIcon,
  GContactsIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../constants/buttons';
import { GBlack, GGreen, GRed, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../constants/wording';
import { GContactItem, IContactItem } from '../../components/GContactItem';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { GDropdownMenu, IMenuItem } from '../../components/GDropdownMenu';
import { GGroupItem, IGroupItem } from '../../components/GGroupItem';

export const GContactsGroupPage = () => {
  const contacts: IGroupItem[] = [
    {
      id: 1,
      name: 'Mamás',
      description: 'Grupo integrados por mamás',
      color: GGreen,
    },
    {
      id: 2,
      name: 'Papás',
      description: 'Grupo integrados por papás',
      color: GRed,
    },
    {
      id: 3,
      name: 'Jovénes',
      description: 'Grupo integrados por jovénes',
      color: GYellow,
    },
  ];

  const menuGroups: IMenuItem[] = [
    {
      label: 'Agregar grupo',
      route: '/contacts/groups/add-group/info',
      color: GYellow,
    },
    {
      label: 'Eliminar grupo',
      route: '/contacts/delete-group',
      color: GRed,
    },
  ];

  const seeMoreGroup = (id: number) => {
    console.log(id);
  };

  return (
    <>
      <div className="geco-contacts-groups">
        <div className="geco-contacts-groups-head">
          <div className="geco-contacts-groups-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link
              className="geco-contacts-groups-nav-bar-section"
              to="/contacts/info"
            >
              <GCircularButton
                icon={GContactsIcon}
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
          <div
            className="geco-contacts-groups-head-nav-bar-right
          "
          >
            <GDropdownMenu menu={menuGroups} />
          </div>
        </div>
        <div className="geco-contacts-groups-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>
        {contacts.length > 0 && (
          <div className="geco-contacts-groups-container">
            <div className="geco-contacts-groups-ul">
              <div className="geco-contacts-groups-item">
                {contacts.map((item) => (
                  <GGroupItem
                    key={item.id}
                    group={item}
                    icon={GChevronRightBlackIcon}
                    iconBackgroundColor={GBlack}
                    onClickAction={() => seeMoreGroup(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {contacts.length === 0 && (
          <div className="geco-contacts-groups-empty">
            <p>No tiene contactos aún.</p>
          </div>
        )}
      </div>
    </>
  );
};
