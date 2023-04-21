import { FC } from 'react';

import '../styles/gbutton.css';
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GIcon } from './GIcon';

interface ISubmitButtonProps {
  onClick: () => void;
  label: string;
  icon?: IButtonIcon;
}

export const GSubmitButton: FC<ISubmitButtonProps> = (
  props: ISubmitButtonProps
) => {
  return (
    <button className="submit-btn" type="button" onClick={props.onClick}>
      {props.label}
      {props.icon != undefined ? (
        <GIcon icon-type={props.icon['icon-type']} color={props.icon.color} />
      ) : null}
    </button>
  );
};
