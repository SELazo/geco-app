import { GFeedback } from '../components/GFeedback';
import { GSuccessIcon } from '../constants/buttons';
import { GBlack, GWhite } from '../constants/palette';
import {
  Okay,
  SuccessResetPasswordSubtitle,
  SuccessResetPasswordTitle,
} from '../constants/wording';

export const GFeedbackSuccessResetPassword = () => {
  return (
    <>
      <GFeedback
        title={SuccessResetPasswordTitle}
        subtitle={SuccessResetPasswordSubtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={Okay}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={'/login'}
      />
    </>
  );
};
