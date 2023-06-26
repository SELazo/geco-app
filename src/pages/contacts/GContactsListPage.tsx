import('../../styles/gcontactsList.css');

import { useEffect, useState } from 'react';

import { GCircularButton } from '../../components/GCircularButton';
import {
  GContactsIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../constants/buttons';
import { GBlack, GGreen, GRed, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { ContactsService } from '../../services/external/contactsService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../constants/wording';
import { GContactItem } from '../../components/GContactItem';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { GDropdownMenu, IMenuItem } from '../../components/GDropdownMenu';
import { IContactResponse } from '../../interfaces/dtos/external/IContacts';
import { ApiResponse } from '../../interfaces/dtos/external/IResponse';
import { ROUTES } from '../../constants/routes';

const { getContacts } = ContactsService;

export const GContactsListPage = () => {
  const [contacts, setContacts] = useState<IContactResponse[]>([]);

  useEffect( () => {
    const fetchContacts = async () => {
      try {
        const response = await getContacts();
        const contactsData = response as ApiResponse<IContactResponse[]>;
        setContacts(contactsData.data ?? []);
      } catch (error) {
        console.error(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchContacts();
  }, [contacts])

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
              onClickAction={NavigationService.handleNavigation(ROUTES.CONTACTS.OPTIONS)}
            />
          </div>
          <div
            className="geco-contacts-list-head-nav-bar-right"
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
