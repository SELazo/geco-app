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
import { IContactData } from '../../../interfaces/IContact';

export const GListContactsToImportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<IContactItem[]>(() => {
    const stateContacts = location.state?.contacts || [];
    let parseContacts: IContactItem[] = [];
    stateContacts.map((c: IContactData, index: number) => {
      parseContacts.push({
        id: index,
        name: c.name,
        mail: c.email ? c.email : undefined,
        number: c.cellphone,
      });
    });
    return parseContacts;
  });

  const deleteContact = (id: number) => {
    const newContacts = contacts.filter((c) => c.id !== id);
    setContacts(newContacts);
  };

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const addContacts = () => {
    console.log(contacts);
    if (contacts.length > 0) {
      const storedContacts: IContactItem[] = JSON.parse(
        localStorage.getItem('contacts') || '[]'
      );

      let newContacts: IContactItem[] = [...storedContacts];

      contacts.map((c) => {
        const id = getRandomNumber(1, 999);

        const newContact: IContactItem = {
          id: id,
          name: c.name,
          mail: c.mail ? c.mail : undefined,
          number: c.number,
        };

        newContacts = [...newContacts, newContact];
      });
      console.log(newContacts);

      localStorage.setItem('contacts', JSON.stringify(newContacts));
      navigate('/contacts/success-add-contacts-excel');
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
