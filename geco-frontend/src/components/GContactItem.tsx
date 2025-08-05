import { FC } from 'react';

import('../styles/gcontactItem.css');

import { GIcon } from './GIcon';
import { IButtonIcon } from '../interfaces/components/IButtonIcon';
import { IContactResponse } from '../interfaces/dtos/external/IContacts';

export interface IContactItem {
  id: number;
  name: string;
  number: string;
  mail?: string;
}

interface IContactItemnProps {
  contact: IContactResponse;
  icon: IButtonIcon;
  iconBackgroundColor: string;
  onClickAction: () => void;
}

export const GContactItem: FC<IContactItemnProps> = (
  props: IContactItemnProps
) => {
  return (
    <>
      <div className="geco-contact-item-card">
        <div className="geco-contact-body">
          <h1 className="geco-contact-item-name">{props.contact.name}</h1>
          <div className="geco-contact-item-info">
            <p>{props.contact.phone}</p>
            {props.contact.email && <p>{props.contact.email}</p>}
          </div>
        </div>
        <button
          className="geco-edit-btn"
          style={{ backgroundColor: props.iconBackgroundColor }}
          onClick={props.onClickAction}
        >
          <GIcon
            color={props.icon['color']}
            icon-type={props.icon['icon-type']}
          />
        </button>
      </div>
    </>
  );
};
