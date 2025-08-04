import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import {
  AIImgType,
  CreateAdSectionTitle,
  OwnImgType,
} from '../../../constants/wording';
import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { ROUTES } from '../../../constants/routes';

export const GAdImgTypePage = () => {
  const types = [AIImgType, OwnImgType];

  const navigate = useNavigate();

  const handleTypeChange = (event: string) => {
    if (event === AIImgType.code) {
      navigate(
        `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.IMAGE_AI}`
      );
    }
    if (event === OwnImgType.code) {
      navigate(
        `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.IMAGE_OWN}`
      );
    }
  };

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link className="geco-add-contact-excel-nav-bar-section" to="/ad">
            <GCircularButton
              icon={GAdIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
            />
          </Link>
          <GCircularButton
            icon={GIconButtonBack}
            size="1.5em"
            width="50px"
            height="50px"
            colorBackground={GWhite}
            onClickAction={NavigationService.goBack}
          />
        </div>
      </div>
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title={CreateAdSectionTitle.title}
          subtitle={CreateAdSectionTitle.subtitle}
        />
      </div>
      <form className="geco-form">
        {types.length > 0 && (
          <div className="geco-create-ad-container">
            <div className="geco-create-ad-list-ul">
              {types.map((item) => (
                <div
                  key={`type-${item.code}`}
                  className="geco-create-ad-list-item"
                  onClick={() => handleTypeChange(item.code)}
                >
                  {item.wording}
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
