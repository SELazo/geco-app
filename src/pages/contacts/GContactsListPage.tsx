import('../../styles/gcontactsList.css');

import { GCircularButton } from '../../components/GCircularButton';
import {
  GContactsIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../constants/buttons';
import { GBlack, GGreen, GRed, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/navigationService/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../constants/wording';
import { GContactItem, IContactItem } from '../../components/GContactItem';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { GDropdownMenu, IMenuItem } from '../../components/GDropdownMenu';

export const GContactsListPage = () => {
  const contacts: IContactItem[] = JSON.parse(
    localStorage.getItem('contacts') || '[]'
  );

  const menuContacts: IMenuItem[] = [
    {
      label: 'Agregar contacto',
      route: '/contacts/add-contact',
      color: GYellow,
    },
    {
      label: 'Agregar contactos desde Excel',
      route: '/contacts/add-contacts-excel',
      color: GGreen,
    },
    {
      label: 'Eliminar contactos',
      route: '/contacts/delete-contact',
      color: GRed,
    },
  ];

  const editContact = (id: number) => {
    console.log(contacts.find((c) => c.id === id));
  };

  return (
    <>
      <div className="geco-contacts-list">
        <div className="geco-contacts-list-head">
          <div className="geco-contacts-list-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link
              className="geco-contacts-list-nav-bar-section"
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
            className="geco-contacts-list-head-nav-bar-right
          "
          >
            <GDropdownMenu menu={menuContacts} />
          </div>
        </div>
        <div className="geco-contacts-list-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>
        {contacts.length > 0 && (
          <div className="geco-contacts-list-container">
            <div className="geco-contacts-list-ul">
              <div className="geco-contacts-list-item">
                {contacts.map((item) => (
                  <GContactItem
                    key={item.id}
                    contact={item}
                    icon={GEditIcon}
                    iconBackgroundColor={GYellow}
                    onClickAction={() => editContact(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {contacts.length === 0 && (
          <div className="geco-contacts-empty">
            <p>No tiene contactos aún.</p>
          </div>
        )}
      </div>
    </>
  );
};
