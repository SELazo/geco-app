import { FC } from 'react';

import '../styles/gbutton.css';
import { ButtonIcon } from '../interfaces/buttonIcon';
import { GIcon } from './GIcon';

interface SubmitButtonProps {
  onClick: () => void;
  label: string;
  icon?: ButtonIcon;
}

export const GSubmitButton: FC<SubmitButtonProps> = (
  props: SubmitButtonProps
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
