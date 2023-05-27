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
import {
  DatasetPolarArea,
  GPolarAreaChart,
} from '../../../components/GPolarAreaChart';

type ContactGrowthChartProps = {
  data: { label: string; values: number[]; color: string }[];
};

export const GRedCompositionPage = () => {
  const contacts = { count: 500, min: 0, max: 500 };

  const labels = ['Mamás', 'Papás', 'Universitarios', 'Niños', 'Jubilados'];
  const data: DatasetPolarArea[] = [
    {
      label: 'Contactos',
      data: [50, 60, 70, 40, 70],
      backgroundColor: [
        `${GPink}99`,
        `${GBlue}99`,
        `${GRed}99`,
        `${GGreen}99`,
        `${GYellow}99`,
      ],
    },
  ];
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
        <GPolarAreaChart datasets={data} labels={labels} />
      </div>
    </>
  );
};
