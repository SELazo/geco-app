import { GFeedback } from '../../components/GFeedback';
import { GDeletetIcon } from '../../constants/buttons';
import { GBlack, GRed, GWhite } from '../../constants/palette';
import { StrategyError } from '../../constants/wording';

import '../../styles/gsuccesssendmessage.css';

export const GStrategyErrorPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={StrategyError.title}
        subtitle={StrategyError.subtitle}
        colorFont={GBlack}
        colorBackgroundCircularBtn={GRed}
        icon={GDeletetIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={StrategyError.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={StrategyError.buttonPath}
      />
    </div>
  );
};
