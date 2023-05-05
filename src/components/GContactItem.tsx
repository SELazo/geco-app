import { FC } from 'react';

import('../styles/gcontactItem.css');

import { GBlack, GWhite } from '../constants/palette';
import { NavigationService } from '../services/navigationService';
import { GSubmitButton } from './GSubmitButton';
import { GIcon } from './GIcon';

export interface IContactItem {
  id: number;
  name: string;
  number: string;
  mail: string;
  route: string;
}

interface IContactItemnProps {
  contact: IContactItem;
}

export const GContactItem: FC<IContactItemnProps> = (
  props: IContactItemnProps
) => {
  return (
    <>
      <div
        className="geco-contact-item-card"
        onClick={NavigationService.handleNavigation(props.contact.route)}
      >
        <div className="geco-contact-body">
          <h1 className="geco-contact-item-name">{props.contact.name}</h1>
          <div className="geco-contact-item-info">
            <p>{props.contact.number}</p>
            <p>{props.contact.mail}</p>
          </div>
        </div>
        <button className="geco-edit-btn">
          <GIcon color={GBlack} icon-type="edit" />
        </button>
      </div>
    </>
  );
};
