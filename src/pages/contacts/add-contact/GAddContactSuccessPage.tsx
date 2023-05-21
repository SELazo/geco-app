import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { ContactAdded } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GAddContactSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={ContactAdded.title}
        subtitle={ContactAdded.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={ContactAdded.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={ContactAdded.buttonPath}
      />
    </div>
  );
};
