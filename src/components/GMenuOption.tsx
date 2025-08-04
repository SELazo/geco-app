import { FC } from 'react';

import('../styles/gmenuOption.css');

import { GBlack, GWhite } from '../constants/palette';
import { NavigationService } from '../services/internal/navigationService';

export interface IMenuOption {
  mainTitle: string;
  description: string;
  route: string;
}

interface IMenuOptionProps {
  option: IMenuOption;
}

export const GMenuOption: FC<IMenuOptionProps> = (props: IMenuOptionProps) => {
  return (
    <>
      <div
        className="geco-option-card"
        onClick={NavigationService.handleNavigation(props.option.route)}
      >
        <h1 className="geco-option-card-title">{props.option.mainTitle}</h1>
        <p className="geco-option-card-description">
          {props.option.description}
        </p>
      </div>
    </>
  );
};
