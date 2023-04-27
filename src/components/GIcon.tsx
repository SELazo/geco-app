import { FC } from 'react';

import '../styles/gicon.css';
import { Icons } from '../constants/icons';
import { IButtonIcon } from '../interfaces/IButtonIcon';

export const GIcon: FC<IButtonIcon> = (props: IButtonIcon) => {
  function getIcon(value: string): JSX.Element {
    return Icons[value];
  }

  return (
    <>
      <div className="geco-icon" style={{ color: props.color }}>
        {getIcon(props['icon-type'])}
      </div>
    </>
  );
};
