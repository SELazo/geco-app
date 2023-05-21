import { FC } from 'react';

import '../styles/gbutton.css';
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GIcon } from './GIcon';

interface ISubmitButtonProps {
  label: string;
  icon?: IButtonIcon;
  colorBackground: string;
  colorFont: string;
}

export const GSubmitButton: FC<ISubmitButtonProps> = (
  props: ISubmitButtonProps
) => {
  return (
    <button
      className="geco-submit-btn"
      style={{ backgroundColor: props.colorBackground, color: props.colorFont }}
      type="submit"
    >
      {props.label}
      {props.icon != undefined ? (
        <GIcon icon-type={props.icon['icon-type']} color={props.icon.color} />
      ) : null}
    </button>
  );
};
