import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { PostStrategyEditSuccessfull } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GStrategyEditSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={PostStrategyEditSuccessfull.title}
        subtitle={PostStrategyEditSuccessfull.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={PostStrategyEditSuccessfull.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={PostStrategyEditSuccessfull.buttonPath}
      />
    </div>
  );
};
