import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import('../../../styles/gcontactsList.css');

import { NavigationService } from '../../../services/internal/navigationService';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GContactsIcon,
  GDeletetIcon,
  GIconButtonBack,
} from '../../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../../constants/palette';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../../constants/wording';
import { GContactItem, IContactItem } from '../../../components/GContactItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { IContactResponse } from '../../../interfaces/dtos/external/IContacts';
import { ContactsService } from '../../../services/external/contactsService';

const { newContact } = ContactsService;

export const GListContactsToImportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<IContactResponse[]>(
    () => location.state.contacts
  );

  const deleteContact = (id: number) => {
    const newContacts = contacts.filter((c) => c.id !== id);
    setContacts(newContacts);
  };

  const addContacts = () => {
    if (contacts.length > 0) {
      contacts.map((contact) => { // TODO: cambiar por servicio que cree múltiples contactos
        newContact(contact.name, contact.email, contact.phone.toString());
      });
      navigate('/contacts/success-add-contacts-excel');
      return;
    }
    navigate('/contacts/list');
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
        </div>
        <div className="geco-contacts-list-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>
        <div className="geco-contacts-list-container">
          <div className="geco-contacts-list-ul">
            <div className="geco-contacts-list-item">
              {contacts.map((item) => (
                <GContactItem
                  key={item.id}
                  contact={item}
                  icon={GDeletetIcon}
                  iconBackgroundColor={GRed}
                  onClickAction={() => deleteContact(item.id)}
                />
              ))}
            </div>
          </div>
          <form onSubmit={addContacts}>
            <GSubmitButton
              label="Aceptar"
              colorBackground={GYellow}
              colorFont={GBlack}
            />
          </form>
        </div>
      </div>
    </>
  );
};
