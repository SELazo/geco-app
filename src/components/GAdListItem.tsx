import { FC } from 'react';

import('../styles/gads.css');

import { GIcon } from './GIcon';
import { IButtonIcon } from '../interfaces/components/IButtonIcon';
import { IGetAdResponse } from '../interfaces/dtos/external/IAds';
import { DateService } from '../services/internal/dateService';

const { getDateString } = DateService;

export interface IAdListItem {
  id: number;
  description: string;
  title: string;
}

interface IAdItemnProps {
  ad: IGetAdResponse;
  icon: IButtonIcon;
  iconBackgroundColor: string;
  onClickAction: () => void;
  icon2: IButtonIcon;
  iconBackgroundColor2: string;
  onClickAction2: () => void;
}

export const GAdListItem: FC<IAdItemnProps> = (props: IAdItemnProps) => {
  return (
    <>
      <div className="geco-ads-item-card">
        <div className="geco-ads-body">
          <h1 className="geco-ads-item-name">{props.ad.title}</h1>
          <div className="geco-ads-item-info">
            <p>{props.ad.description}</p>
            <p className="geco-ads-item-date-info">
              {getDateString(props.ad.create_date)}
            </p>
          </div>
        </div>
        <div>
          <button
            className="geco-ads-item-btn "
            style={{ backgroundColor: props.iconBackgroundColor }}
            onClick={props.onClickAction}
          >
            <GIcon
              color={props.icon['color']}
              icon-type={props.icon['icon-type']}
            />
          </button>
          <button
            className="geco-ads-item-btn "
            style={{ backgroundColor: props.iconBackgroundColor2 }}
            onClick={props.onClickAction2}
          >
            <GIcon
              color={props.icon2['color']}
              icon-type={props.icon2['icon-type']}
            />
          </button>
        </div>
      </div>
    </>
  );
};
