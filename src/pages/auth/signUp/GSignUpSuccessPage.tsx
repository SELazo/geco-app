import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { SignUpSuccessfull } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GSignUpSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={SignUpSuccessfull.title}
        subtitle={SignUpSuccessfull.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={SignUpSuccessfull.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={SignUpSuccessfull.buttonPath}
      />
    </div>
  );
};
