import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { ContactAdded, NewGroupAdded } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GNewGroupSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={NewGroupAdded.title}
        subtitle={NewGroupAdded.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={NewGroupAdded.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={NewGroupAdded.buttonPath}
      />
    </div>
  );
};
