import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gadimage.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GAdIcon,
  GDeletetIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { AdOwnImgHelp, CreateAdOwnImgTitle } from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { GIcon } from '../../../components/GIcon';
import { GDropdownHelp } from '../../../components/GDropdownHelp';
import { GErrorPopup } from '../../../components/GErrorPopup';
import { ROUTES } from '../../../constants/routes';
import { IGetAdResponse } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { GDropdownMenu, IMenuItem } from '../../../components/GDropdownMenu';

const { getAdImg } = AdsService;

export const GAdViewPage = () => {
  const [loading, setLoading] = useState(false);
  const [adFile, setAdFile] = useState<string | null>(null);
  const [errorImg, setErrorImg] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const ad: IGetAdResponse = location && location.state;

  useEffect(() => {
    setLoading(true);
    if (!ad || !ad.id || !ad.description || !ad.title) {
      navigate(`${ROUTES.AD.ROOT}`);
    }

    const fetchAd = async () => {
      try {
        const adImg = await getAdImg(ad.id);
        if (adImg) {
          setAdFile(adImg);
        }
      } catch (error) {
        setErrorImg('No se pudo cargar la imagen 😥');
      }
    };

    fetchAd();
    setLoading(false);
  }, []);

  const handleEditAction = () => {
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.EDIT.ROOT}${ROUTES.AD.EDIT.INFORMATION}`,
      {
        state: ad,
      }
    );
  };

  return (
    <>
      <div className="geco-contacts-list">
        <div className="geco-contacts-list-head">
          <div className="geco-contacts-list-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link className="geco-contacts-list-nav-bar-section" to="/ad">
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
          <div className="geco-contacts-list-head-nav-bar-right">
            <GCircularButton
              icon={GEditIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
              onClickAction={handleEditAction}
            />
          </div>
        </div>
        <div className="geco-ad-header-title">
          <GHeadSectionTitle title={ad.title} subtitle={ad.description} />
        </div>

        {adFile && (
          <div className="file-preview-ad-view">
            <img src={adFile} alt="Vista previa" />
          </div>
        )}
      </div>
    </>
  );
};
