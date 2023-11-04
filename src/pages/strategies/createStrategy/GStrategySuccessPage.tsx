import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { PostAdSuccessfull } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GAdSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={PostAdSuccessfull.title}
        subtitle={PostAdSuccessfull.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={PostAdSuccessfull.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={PostAdSuccessfull.buttonPath}
      />
    </div>
  );
};
