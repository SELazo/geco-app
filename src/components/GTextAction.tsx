import { FC } from 'react';

import '../styles/gtextAction.css';
import { ITextAction } from '../interfaces/ITextAction';

interface ISubmitTextActionProps {
  onClick: () => void;
  textAction: ITextAction;
}

export const GTextAction: FC<ISubmitTextActionProps> = (
  props: ISubmitTextActionProps
) => {
  return (
    <>
      <div className="geco-text-action">
        <p className="geco-text-label">{props.textAction.label}</p>
        <a className="geco-text-link" onClick={props.onClick}>
          {props.textAction.action}
        </a>
      </div>
    </>
  );
};
