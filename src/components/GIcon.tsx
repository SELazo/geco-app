import { FC } from 'react';

import '../styles/gicon.css';
import { Icons } from '../constants/icons';
import { ButtonIcon } from '../interfaces/buttonIcon';

export const GIcon: FC<ButtonIcon> = (props: ButtonIcon) => {
  function getIcon(value: string): JSX.Element {
    return Icons[value];
  }

  return (
    <>
      <div className="geco-icon" color={props.color}>
        {getIcon(props['icon-type'])}
      </div>
    </>
  );
};
