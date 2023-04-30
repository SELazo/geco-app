import { useSelector } from 'react-redux';

import '../styles/guser.css';
import { GWhite } from '../constants/palette';

import { GCircularButton } from '../components/GCircularButton';
import {
  GCommentIcon,
  GEditIcon,
  GIconButtonBack,
  GPremiumStarIcon,
  GUserIcon,
} from '../constants/buttons';
import {
  CommentsTitle,
  EditUserInfoTitle,
  PricingTitle,
  UserOptionsSubtitle,
} from '../constants/wording';
import { NavigationService } from '../services/navigationService';
import { GHeadCenterTitle } from '../components/GHeadCenterTitle';

export const GUserPage = () => {
  const user = useSelector((state: any) => state.user);
  return (
    <div className="geco-user-page">
      <div className="geco-user-header">
        <div className="geco-user-nav">
          <GCircularButton
            icon={GIconButtonBack}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
            onClickAction={NavigationService.goBack}
          />
        </div>
        <GCircularButton
          icon={GUserIcon}
          size="3em"
          width="100px"
          height="100px"
          colorBackground={GWhite}
        />
        <GHeadCenterTitle title="some name" color={GWhite} />
        <p className="geco-user-email">someemail@email.com</p>
      </div>
      <p className="geco-user-options-title">{UserOptionsSubtitle}</p>
      <div className="geco-user-options">
        <div className="geco-options-column">
          <div className="geco-option-icon">
            <GCircularButton
              icon={GEditIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation('/user/edit')}
            />
            <p className="geco-option-title">{EditUserInfoTitle}</p>
          </div>
          <div className="geco-option-icon">
            <GCircularButton
              icon={GPremiumStarIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation(
                '/user/pricing'
              )}
            />
            <p>{PricingTitle}</p>
          </div>
        </div>
        <div className="geco-options-column">
          <div className="geco-option-icon">
            <GCircularButton
              icon={GCommentIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation(
                '/user/comments'
              )}
            />
            <p>{CommentsTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
