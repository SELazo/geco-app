import { GFeedback } from '../../components/GFeedback';
import { GSuccessIcon } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { UserEdited } from '../../constants/wording';

import '../../styles/gsuccesssendmessage.css';

export const GEditUserInfoSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={UserEdited.title}
        subtitle={UserEdited.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={UserEdited.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={UserEdited.buttonPath}
      />
    </div>
  );
};
