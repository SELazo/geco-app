import { GFeedback } from '../../components/GFeedback';
import { GSuccessIcon } from '../../constants/buttons';
import { GBlack, GWhite } from '../../constants/palette';
import { CommentSended } from '../../constants/wording';

export const GSuccessSendCommentPage = () => {
  return (
    <>
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
    </>
  );
};
