import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdSize } from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import { CreateAdSectionTitle } from '../../../constants/wording';
import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { IAdSizes } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { ROUTES } from '../../../constants/routes';

const { getAdSizes } = AdsService;

export const GAdSizePage = () => {
  const [sizes, setSizes] = useState<IAdSizes[]>([]);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await getAdSizes();
        const sizesData = response as ApiResponse<IAdSizes[]>;
        setSizes(sizesData.data ?? []);
      } catch (error) {
        console.error(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchSizes();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSizeChange = (event: string) => {
    dispatch(setNewAdSize(event));
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.IMAGE}`,
      { state: event }
    );
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
        {sizes.length > 0 && (
          <div className="geco-create-ad-container">
            <div className="geco-create-ad-list-ul">
              {sizes.map((item) => (
                <div
                  key={`size-${item.id.toString()}`}
                  className="geco-create-ad-list-item"
                  onClick={() => handleSizeChange(item.id)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
