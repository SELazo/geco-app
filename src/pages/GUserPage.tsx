import { Link, useNavigate } from 'react-router-dom';

import '../styles/guser.css';
import { GWhite } from '../constants/palette';

import { GCircularButton } from '../components/GCircularButton';
import {
  GCommentIcon,
  GEditIcon,
  GPremiumStarIcon,
  GUserIcon,
} from '../constants/buttons';
import {
  CommentsTitle,
  EditUserInfoTitle,
  PricingTitle,
} from '../constants/wording';

export const GUserPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    return () => navigate(route);
  };

  return (
    <div className="geco-user-page">
      <div className="geco-user-header">
        <GCircularButton
          icon={GUserIcon}
          size="5em"
          width="150px"
          height="150px"
          colorBackground={GWhite}
        />
      </div>
      <p className="geco-user-options-title">Opciones de usuario</p>
      <div className="geco-user-options">
        <div className="geco-options-column">
          <div className="geco-option-icon">
            <GCircularButton
              icon={GEditIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={handleNavigation('/user/edit')}
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
              onClickAction={handleNavigation('/user/pricing')}
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
              onClickAction={handleNavigation('/user/comments')}
            />
            <p>{CommentsTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
