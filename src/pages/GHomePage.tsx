import { useNavigate } from 'react-router-dom';

import '../styles/ghome.css';
import { GLogoLetter } from '../components/GLogoLetter';
import { BlueYelowPalette, GRed, GWhite, GYellow } from '../constants/palette';

import emailCampaign from '../assets/images/email_campaign_bro.svg';
import { GIcon } from '../components/GIcon';
import { IButtonIcon } from '../interfaces/IButtonIcon';
import { GCircularButton } from '../components/GCircularButton';
import {
  GAdIcon,
  GContactsIcon,
  GStatisticsIcon,
  GStrategyIcon,
  GUserIcon,
} from '../constants/buttons';
import { GLogoWord } from '../components/GLogoWord';
import { GHeadCenterTitle } from '../components/GHeadCenterTitle';
import {
  AdHeadCenterTitle,
  ContactsHeadCenterTitle,
  HomeHeadCenterTitle,
  StatisticsHeadCenterTitle,
  StrategyHeadCenterTitle,
} from '../constants/wording';

export const GHomePage = () => {
  const premiumStarIcon: IButtonIcon = {
    color: GYellow,
    'icon-type': 'star-fa',
  };

  const navigate = useNavigate();

  const handleUserNavigate = () => {
    navigate('/user');
  };

  const handleAdNavigate = () => {
    navigate('/ad');
  };

  const handleStrategyNavigate = () => {
    navigate('/strategy');
  };

  const handleContactsNavigate = () => {
    navigate('/contacts');
  };

  const handleStatisticsNavigate = () => {
    navigate('/statistics');
  };

  return (
    <div
      style={{
        background: BlueYelowPalette.backgroundColor,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          background: GRed,
          width: '100vw',
          height: '250px',
          overflow: 'hidden',
        }}
      >
        <div className="geco-nav-bar">
          <GLogoWord />
          <div className="geco-nav-bar-right">
            <button className="geco-without-background-btn">
              <GIcon
                color={premiumStarIcon.color}
                icon-type={premiumStarIcon['icon-type']}
              />
            </button>
            <GCircularButton
              icon={GUserIcon}
              size="1.5em"
              width="50px"
              height="50px"
              onClickAction={handleUserNavigate}
            />
          </div>
        </div>
        <img
          src={emailCampaign}
          alt="SVG"
          style={{
            width: '100%',
          }}
        />
      </div>
      <GHeadCenterTitle title={HomeHeadCenterTitle} color={GWhite} />
      <div className="geco-services">
        <div className="geco-services-column">
          <div className="geco-services-icon">
            <GCircularButton
              icon={GAdIcon}
              size="2em"
              width="70px"
              height="70px"
              onClickAction={handleAdNavigate}
            />
            <p>{AdHeadCenterTitle}</p>
          </div>
          <div className="geco-services-icon">
            <GCircularButton
              icon={GStrategyIcon}
              size="2em"
              width="70px"
              height="70px"
              onClickAction={handleStrategyNavigate}
            />
            <p>{StrategyHeadCenterTitle}</p>
          </div>
        </div>
        <div className="geco-services-column">
          <div className="geco-services-icon">
            <GCircularButton
              icon={GContactsIcon}
              size="2em"
              width="70px"
              height="70px"
              onClickAction={handleContactsNavigate}
            />
            <p>{ContactsHeadCenterTitle}</p>
          </div>
          <div className="geco-services-icon">
            <GCircularButton
              icon={GStatisticsIcon}
              size="2em"
              width="70px"
              height="70px"
              onClickAction={handleStatisticsNavigate}
            />
            <p>{StatisticsHeadCenterTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
