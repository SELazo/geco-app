import { FC } from 'react';

import('../styles/ggroupItem.css');

import { GIcon } from './GIcon';
import { IButtonIcon } from '../interfaces/components/IButtonIcon';
import { IGroup } from '../interfaces/dtos/external/IGroups';

interface IGroupItemProps {
  group: IGroup;
  color: string;
  icon: IButtonIcon;
  iconBackgroundColor: string;
  onClickAction: () => void;
}

export const GGroupItem: FC<IGroupItemProps> = (props: IGroupItemProps) => {
  return (
    <>
      <div
        className="geco-group-item-card"
        style={{ backgroundColor: props.color }}
      >
        <div className="geco-group-body">
          <h1 className="geco-group-item-name">{props.group.name}</h1>
          <div className="geco-group-item-info">
            <p>{props.group.description}</p>
          </div>
        </div>
        <button
          className="geco-see-more-group-btn"
          onClick={props.onClickAction}
        >
          <GIcon
            color={props.icon['color']}
            icon-type={props.icon['icon-type']}
          />
        </button>
      </div>
    </>
  );
};
