import { Link } from 'react-router-dom';
import { GCircularButton } from '../../../components/GCircularButton';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GIconButtonBack, GStatisticsIcon } from '../../../constants/buttons';
import {
  GBlack,
  GBlue,
  GGray,
  GGreen,
  GPink,
  GRed,
  GWhite,
  GYellow,
} from '../../../constants/palette';
import { StatisticsSectionTitle } from '../../../constants/wording';
import { NavigationService } from '../../../services/navigationService';

import '../../../styles/gstatisticsContacts.css';
import { GLineChart } from '../../../components/GLineChart';

type ContactGrowthChartProps = {
  data: { label: string; values: number[]; color: string }[];
};

export const GGroupsGrowthPage = () => {
  const contactData = [
    {
      label: 'Base de contactos 1',
      data: [100, 150, 200, 250, 270],
      fill: false,
      borderColor: GRed,
      backgroundColor: GRed,
    },
    {
      label: 'Base de contactos 2',
      data: [50, 75, 120, 180, 170],
      fill: false,
      borderColor: GGreen,
      backgroundColor: GGreen,
    },
    {
      label: 'Base de contactos 3',
      data: [20, 40, 70, 40, 150],
      fill: false,
      borderColor: GBlue,
      backgroundColor: GBlue,
    },
    {
      label: 'Base de contactos 4',
      data: [25, 60, 90, 40, 300],
      fill: false,
      borderDash: [5, 5],
      borderColor: GYellow,
      backgroundColor: GYellow,
    },
    {
      label: 'Base de contactos 5',
      data: [80, 25, 43, 75, 210],
      fill: false,
      borderColor: GPink,
      backgroundColor: GPink,
    },
    {
      type: 'bar',
      label: 'Cantidad de estrategias',
      data: [20, 60, 40, 140, 230],
      fill: true,
      backgroundColor: GGray,
      borderColor: GGray,
    },
    // Agrega más bases de contactos según sea necesario
  ];

  const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'];

  return (
    <>
      <div className="geco-statistics-contacts">
        <div className="geco-statistics-contacts-head">
          <div className="geco-statistics-contacts-head-nav-bar">
            <Link
              className="geco-statistics-contacts-head-nav-bar-logo"
              to="/home"
            >
              <GLogoLetter />
            </Link>
            <Link
              className="geco-statistics-contacts-nav-bar-section"
              to="/statistics/info"
            >
              <GCircularButton
                icon={GStatisticsIcon}
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
        <div className="geco-statistics-contacts-title">
          <GHeadCenterTitle title={StatisticsSectionTitle} color={GBlack} />
        </div>
        <GLineChart data={contactData} labels={labels} />
      </div>
    </>
  );
};
