import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { PostStrategySuccessfull } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GStrategySuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={PostStrategySuccessfull.title}
        subtitle={PostStrategySuccessfull.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={PostStrategySuccessfull.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={PostStrategySuccessfull.buttonPath}
      />
    </div>
  );
};
