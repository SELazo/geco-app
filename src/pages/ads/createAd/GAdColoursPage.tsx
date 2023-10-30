import { Link, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdPallette } from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import { CreateAdColoursTitle } from '../../../constants/wording';
import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { IAdColours } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { ROUTES } from '../../../constants/routes';

const { getAdColours } = AdsService;

export const GAdColoursPage = () => {
  const [colours, setColours] = useState<IAdColours[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColours = async () => {
      try {
        const response = await getAdColours();
        const coloursData = response as ApiResponse<IAdColours[]>;
        setColours(coloursData.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchColours();
  }, []);

  const handlePatternChange = (event: string) => {
    dispatch(setNewAdPallette(event));
    navigate(
      `${ROUTES.AD.ROOT}${ROUTES.AD.CREATE.ROOT}${ROUTES.AD.CREATE.CONTENT}`
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
          title={CreateAdColoursTitle.title}
          subtitle={CreateAdColoursTitle.subtitle}
        />
      </div>
      <form className="geco-form">
        {colours.length > 0 ? (
          <div className="geco-create-ad-container">
            <div className="geco-create-ad-list-img">
              {colours.map((item) => (
                <div
                  key={`colour-${item.id.toString()}`}
                  style={{
                    width: '75px',
                    height: '150px',
                    marginBottom: '10px',
                    backgroundColor: item.hex,
                  }}
                  onClick={() => handlePatternChange(item.hex)}
                ></div>
              ))}
            </div>
          </div>
        ) : (
          <p>No colours available.</p>
        )}
      </form>
    </div>
  );
};
