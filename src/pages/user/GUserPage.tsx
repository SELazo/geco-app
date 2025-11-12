import { useSelector } from 'react-redux';

import '../../styles/guser.css';
import { GWhite } from '../../constants/palette';

import { GCircularButton } from '../../components/GCircularButton';
import {
  GCommentIcon,
  GEditIcon,
  GIconButtonBack,
  GPremiumStarIcon,
  GUserIcon,
} from '../../constants/buttons';
import {
  CommentsTitle,
  EditUserInfoTitle,
  PricingTitle,
  UserOptionsSubtitle,
} from '../../constants/wording';
import { NavigationService } from '../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { User } from '../../redux/sessionSlice';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const GUserPage = () => {
  const user: User = useSelector((state: any) => state.auth.user as User);
  return (
    <div className="user-main">
      <div className="user-head">
        <div className="user-head-nav-bar">
          <Link className="user-head-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <GCircularButton
            icon={GIconButtonBack}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
            onClickAction={NavigationService.handleNavigation(ROUTES.HOME)}
          />
        </div>
        <div className="user-head-user-info">
          <GCircularButton
            icon={GUserIcon}
            size="3em"
            width="100px"
            height="100px"
            colorBackground={GWhite}
          />
          <div className="user-head-user-info-foot-img">
            <GHeadCenterTitle title={user.name} color={GWhite} />
            <p className="geco-user-email">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="user-body">
        <div className="user-body-title">
          <p className="geco-user-options-title">{UserOptionsSubtitle}</p>
        </div>

        <div className="user-body-icons">
          <div className="user-body-icons-center">
            <GCircularButton
              icon={GEditIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation('/user/edit')}
            />
            <div className="user-body-icons-texts">
              <p className="geco-option-title">{EditUserInfoTitle}</p>
            </div>
          </div>

          <div className="user-body-icons-top">
            <GCircularButton
              icon={GPremiumStarIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.handleNavigation(
                '/premium'
              )}
            />
            <div className="user-body-icons-texts">
              <p>Cuenta Premium</p>
            </div>
          </div>

          <div className="user-body-icons-center">
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
            <div className="user-body-icons-texts">
              <p>{CommentsTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
