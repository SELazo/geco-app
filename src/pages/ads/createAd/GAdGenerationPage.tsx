import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdTemplate } from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import { CreateAdPatternTitle } from '../../../constants/wording';
import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { IAdPattern } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { ROUTES } from '../../../constants/routes';

const { getAdPatterns } = AdsService;

export const GAdGenerationPage = () => {
  const [patterns, setPatterns] = useState<IAdPattern[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const size: string = location && location.state;

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await getAdPatterns(size);
        const patternsData = response as ApiResponse<IAdPattern[]>;
        setPatterns(patternsData.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    if (size) {
      fetchPatterns();
    }
  }, [size]);

  const handlePatternChange = (event: string) => {
    dispatch(setNewAdTemplate(event));
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
          title={CreateAdPatternTitle.title}
          subtitle={CreateAdPatternTitle.subtitle}
        />
      </div>
      <form className="geco-form">
        {size ? (
          patterns.length > 0 ? (
            <div className="geco-create-ad-container">
              <div className="geco-create-ad-list-img">
                {patterns.map((item) => (
                  <img
                    key={`pattern-${item.id.toString()}`}
                    className="geco-create-ad-img"
                    onClick={() => handlePatternChange(item.id)}
                    src={item.url}
                    alt=""
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>No patterns available.</p>
          )
        ) : (
          <p>Loading...</p>
        )}
      </form>
    </div>
  );
};
