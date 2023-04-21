import { FC } from 'react';

import '../styles/gtextAction.css';
import { TextAction } from '../interfaces/textAction';

interface SubmitTextActionProps {
  onClick: () => void;
  textAction: TextAction;
}

export const GTextAction: FC<SubmitTextActionProps> = (
  props: SubmitTextActionProps
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
