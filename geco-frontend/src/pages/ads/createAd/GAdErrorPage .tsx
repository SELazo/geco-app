import { GFeedback } from '../../../components/GFeedback';
import { GDeletetIcon } from '../../../constants/buttons';
import { GBlack, GRed, GWhite } from '../../../constants/palette';
import { AdError } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GAdErrorPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={AdError.title}
        subtitle={AdError.subtitle}
        colorFont={GBlack}
        colorBackgroundCircularBtn={GRed}
        icon={GDeletetIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={AdError.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={AdError.buttonPath}
      />
    </div>
  );
};
