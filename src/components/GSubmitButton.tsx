import { FC } from 'react';

import '../styles/gbutton.css';
import { IButtonIcon } from '../interfaces/components/IButtonIcon';
import { GIcon } from './GIcon';
import { GGray } from '../constants/palette';

interface ISubmitButtonProps {
  label: string;
  icon?: IButtonIcon;
  colorBackground: string;
  colorFont: string;
  disabled?: boolean;
}

export const GSubmitButton: FC<ISubmitButtonProps> = (
  props: ISubmitButtonProps
) => {
  const btnStyle = !props.disabled
    ? {
        backgroundColor: props.colorBackground,
        color: props.colorFont,
      }
    : {
        backgroundColor: GGray,
        color: props.colorFont,
      };

  return (
    <button
      className="geco-submit-btn"
      style={btnStyle}
      type="submit"
      disabled={props.disabled}
    >
      {props.label}
      {props.icon != undefined ? (
        <GIcon icon-type={props.icon['icon-type']} color={props.icon.color} />
      ) : null}
    </button>
  );
};
