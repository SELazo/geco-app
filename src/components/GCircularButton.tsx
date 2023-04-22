import React from 'react';

import '../styles/gcircularButton.css';
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GIcon } from './GIcon';
import { Link } from 'react-router-dom';

interface ICircularButton {
  icon: IButtonIcon;
  onClickAction: () => void;
}

export const GCircularButton: React.FC<ICircularButton> = (
  props: ICircularButton
) => {
  return (
    <button className="geco-circular-btn" onClick={props.onClickAction}>
      <GIcon icon-type={props.icon['icon-type']} color={props.icon.color} />
    </button>
  );
};
