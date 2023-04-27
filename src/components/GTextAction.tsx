import { FC } from 'react';
import { Link } from 'react-router-dom';

import '../styles/gtextAction.css';
import { ITextAction } from '../interfaces/ITextAction';

interface ISubmitTextActionProps {
  textAction: ITextAction;
}

export const GTextAction: FC<ISubmitTextActionProps> = (
  props: ISubmitTextActionProps
) => {
  return (
    <>
      <div className="geco-text-action">
        <p className="geco-text-label">{props.textAction.label}</p>
        <Link to={props.textAction.route}>
          <p className="geco-text-link">{props.textAction.action}</p>
        </Link>
      </div>
    </>
  );
};
