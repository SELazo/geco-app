import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { PostEditAdSuccessfull } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GAdEditSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={PostEditAdSuccessfull.title}
        subtitle={PostEditAdSuccessfull.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={PostEditAdSuccessfull.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={PostEditAdSuccessfull.buttonPath}
      />
    </div>
  );
};
