import { FC } from 'react';

import('../styles/gfeedback.css');
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GHeadCenterTitle } from './GHeadCenterTitle';
import { GSubmitButton } from './GSubmitButton';
import { GCircularButton } from './GCircularButton';
import { Link } from 'react-router-dom';
import { GGreen } from '../constants/palette';

interface IGFeedbackProps {
  title: string;
  subtitle: string;
  colorFont: string;
  //icon
  icon: IButtonIcon;
  iconWidth: string;
  iconHeight: string;
  //button
  buttonLabel: string;
  iconButton?: IButtonIcon;
  colorButtonFont: string;
  colorButtonBackground: string;
  route: string;
}

export const GFeedback: FC<IGFeedbackProps> = (props: IGFeedbackProps) => {
  return (
    <>
      <div className="geco-feedback">
        <GCircularButton
          icon={props.icon}
          size="3em"
          width="100px"
          height="100px"
          colorBackground={GGreen}
        />
        <GHeadCenterTitle title={props.title} color={props.colorFont} />
        <p>{props.subtitle}</p>
        <Link to={props.route}>
          <GSubmitButton
            label={props.buttonLabel}
            icon={props.iconButton ? props.iconButton : null}
            colorBackground={props.colorButtonBackground}
            colorFont={props.colorButtonFont}
          />
        </Link>
      </div>
    </>
  );
};
