import { Link } from 'react-router-dom';

import '../styles/ghome.css';
import { BlueYelowPalette, GRed, GWhite, GYellow } from '../constants/palette';

import emailCampaign from '../assets/images/email_campaign_bro.svg';
import { GIcon } from '../components/GIcon';
import { GCircularButton } from '../components/GCircularButton';
import {
  GAdIcon,
  GContactsIcon,
  GPremiumStarIcon,
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
import { NavigationService } from '../services/navigationService';

export const GHomePage = () => {
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
          height: '280px',
          overflow: 'hidden',
          borderRadius: '0 0 1.2em 1.2em',
        }}
      >
        <div className="geco-nav-bar">
          <GLogoWord />
          <div className="geco-nav-bar-right">
            <button className="geco-without-background-btn">
              <Link to={'/user/pricing'}>
                <GIcon
                  color={GPremiumStarIcon.color}
                  icon-type={GPremiumStarIcon['icon-type']}
                />
              </Link>
            </button>

            <GCircularButton
              icon={GUserIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
              onClickAction={NavigationService.navigate('/user')}
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
              colorBackground={GWhite}
              onClickAction={NavigationService.navigate('/ad')}
            />
            <p>{AdHeadCenterTitle}</p>
          </div>
          <div className="geco-services-icon">
            <GCircularButton
              icon={GStrategyIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.navigate('/strategy')}
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
              colorBackground={GWhite}
              onClickAction={NavigationService.navigate('/contacts')}
            />
            <p>{ContactsHeadCenterTitle}</p>
          </div>
          <div className="geco-services-icon">
            <GCircularButton
              icon={GStatisticsIcon}
              size="2em"
              width="70px"
              height="70px"
              colorBackground={GWhite}
              onClickAction={NavigationService.navigate('/statistics')}
            />
            <p>{StatisticsHeadCenterTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
