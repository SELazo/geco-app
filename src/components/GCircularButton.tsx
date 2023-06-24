import React from 'react';

import '../styles/gcircularButton.css';
import { IButtonIcon } from '../interfaces/components/IButtonIcon';
import { GIcon } from './GIcon';

interface ICircularButton {
  icon: IButtonIcon;
  size: string;
  width: string;
  height: string;
  colorBackground: string;
  onClickAction?: () => void;
}

export const GCircularButton: React.FC<ICircularButton> = (
  props: ICircularButton
) => {
  return (
    <div
      className="geco-circular-btn"
      style={{
        width: props.width,
        height: props.height,
        fontSize: props.size,
        backgroundColor: props.colorBackground,
      }}
      onClick={props.onClickAction ? props.onClickAction : undefined}
    >
      <span>
        <GIcon icon-type={props.icon['icon-type']} color={props.icon.color} />
      </span>
    </div>
  );
};
