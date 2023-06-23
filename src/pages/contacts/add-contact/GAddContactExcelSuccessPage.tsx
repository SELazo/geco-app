import { GFeedback } from '../../../components/GFeedback';
import { GSuccessIcon } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { ContactsExcelAdded } from '../../../constants/wording';

import '../../../styles/gsuccesssendmessage.css';

export const GAddContactsExcelSuccessPage = () => {
  return (
    <div className="success-send-message-main">
      <GFeedback
        title={ContactsExcelAdded.title}
        subtitle={ContactsExcelAdded.subtitle}
        colorFont={GBlack}
        icon={GSuccessIcon}
        iconWidth="160px"
        iconHeight="160px"
        buttonLabel={ContactsExcelAdded.buttonLabel}
        colorButtonFont={GWhite}
        colorButtonBackground={GBlack}
        route={ContactsExcelAdded.buttonPath}
      />
    </div>
  );
};
