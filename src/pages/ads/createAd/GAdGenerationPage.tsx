import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavigationService } from '../../../services/internal/navigationService';
import { setNewAdTemplate } from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GAdIcon, GIconButtonBack } from '../../../constants/buttons';

import {
  CreateAdGeneratedTitle,
  CreateAdPatternTitle,
} from '../../../constants/wording';
import { GWhite } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { IAdPattern } from '../../../interfaces/dtos/external/IAds';
import { AdsService } from '../../../services/external/adsService';
import { ROUTES } from '../../../constants/routes';
import { RootState } from '../../../redux/gecoStore';
import { GCustomAd } from '../../../components/GCustomAd';

const { getGeneratedAd } = AdsService;

export const GAdGenerationPage = () => {
  const formNewAd = useSelector((state: RootState) => state.auth.formNewAd);

  const location = useLocation();

  const img: string = location && location.state;

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
          title={CreateAdGeneratedTitle.title}
          subtitle={CreateAdGeneratedTitle.subtitle}
        />
        <div></div>
        <GCustomAd
          titleAd={formNewAd.titleAd}
          textAd={formNewAd.textAd}
          pallette={formNewAd.pallette}
          template={formNewAd.template}
          img={img}
        ></GCustomAd>
      </div>
    </div>
  );
};
