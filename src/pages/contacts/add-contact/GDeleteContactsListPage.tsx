import('../../../styles/gcontactsList.css');

import { GCircularButton } from '../../../components/GCircularButton';
import { GDeletetIcon, GIconButtonBack } from '../../../constants/buttons';
import { GBlack, GRed, GWhite } from '../../../constants/palette';
import { NavigationService } from '../../../services/navigationService/navigationService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../../constants/wording';
import { GContactItem, IContactItem } from '../../../components/GContactItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export const GDeleteContactsListPage = () => {
  const [contacts, setContacts] = useState<IContactItem[]>(() => {
    const storedContacts = localStorage.getItem('contacts');
    return storedContacts ? JSON.parse(storedContacts) : [];
  });

  const deleteContact = (id: number) => {
    const newContacts = contacts.filter((c) => c.id !== id);
    setContacts(newContacts);

    localStorage.setItem('contacts', JSON.stringify(newContacts));
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
                  onClickAction={() => deleteContact(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
