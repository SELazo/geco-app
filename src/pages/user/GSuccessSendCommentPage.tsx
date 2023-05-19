import { GFeedback } from '../../components/GFeedback';
import { GSuccessIcon } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { CommentSended } from '../../constants/wording';

import '../../styles/gsuccesssendmessage.css';

export const GSuccessSendCommentPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={CommentSended.title}
        subtitle={CommentSended.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={CommentSended.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={CommentSended.buttonPath}
      />
    </div>
  );
};
