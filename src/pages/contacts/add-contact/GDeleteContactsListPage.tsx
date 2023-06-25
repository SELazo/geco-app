import('../../../styles/gcontactsList.css');

import { GCircularButton } from '../../../components/GCircularButton';
import { GDeletetIcon, GIconButtonBack } from '../../../constants/buttons';
import { GBlack, GRed, GWhite } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { ContactsService } from '../../../services/external/contactsService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../../constants/wording';
import { GContactItem, IContactItem } from '../../../components/GContactItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IContactResponse } from '../../../interfaces/dtos/external/IContacts';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';

const { getContacts, deleteContact } = ContactsService;

export const GDeleteContactsListPage = () => {
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

  const handleDeleteContact = async (id: number) => {
    await deleteContact(id)
      .then(() => {
        setContacts(contacts);
      })
      .catch(e => console.log(e)) // TODO: Mostrar error en pantalla
  };

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
                  onClickAction={() => handleDeleteContact(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
