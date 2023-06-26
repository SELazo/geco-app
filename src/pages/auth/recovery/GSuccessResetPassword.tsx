import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { PasswordChange } from '../../../constants/wording';

import '../../../styles/gsuccessreset.css';

export const GFeedbackSuccessResetPassword = () => {
  return (
    <div className='successreset-main'>
      <GFeedback
        title={PasswordChange.title}
        subtitle={PasswordChange.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={PasswordChange.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={PasswordChange.buttonPath}
      />
    </div>
  );
};
