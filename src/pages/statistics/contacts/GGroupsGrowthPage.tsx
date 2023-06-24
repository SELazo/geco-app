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
import { Months, StatisticsSectionTitle } from '../../../constants/wording';
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/gstatisticsContacts.css';
import { GLineChart } from '../../../components/GLineChart';
import { IGroupsGrowthLastXMonthsResponse } from '../../../interfaces/IContactsStatistics';

type ContactGrowthChartProps = {
  data: { label: string; values: number[]; color: string }[];
};

type ChartProps = {
  type?: string;
  label: string;
  data: number[];
  fill: boolean;
  borderDash?: [number, number];
  borderColor: string;
  backgroundColor: string;
};

export const GGroupsGrowthPage = () => {
  const infoGrowthGroups: IGroupsGrowthLastXMonthsResponse = {
    groupsInfo: [
      {
        label: 'Base de contactos 1',
        quantityPerMonth: [100, 150, 200, 250, 270],
      },
      {
        label: 'Base de contactos 2',
        quantityPerMonth: [50, 75, 120, 180, 170],
      },
      {
        label: 'Base de contactos 3',
        quantityPerMonth: [20, 40, 70, 40, 150],
      },
      {
        label: 'Base de contactos 5',
        quantityPerMonth: [80, 25, 43, 75, 210],
      },
    ],
    generalInfo: {
      label: 'Base de contactos 4',
      quantityPerMonth: [25, 60, 90, 40, 300],
    },
    strategiesInfo: {
      label: 'Cantidad de estrategias',
      quantityPerMonth: [20, 60, 40, 140, 230],
    },
  };

  const contactData: ChartProps[] = [];

  const getRotatingColor = (() => {
    const colors = [GPink, GBlue, GRed, GGreen];
    let index = 0;

    return () => {
      const color = colors[index];

      index = (index + 1) % colors.length;

      return color;
    };
  })();

  const generateChartContactData = (): ChartProps[] => {
    infoGrowthGroups.groupsInfo.map((group) => {
      const color = getRotatingColor();
      contactData.push({
        label: group.label,
        data: group.quantityPerMonth,
        fill: false,
        borderColor: color,
        backgroundColor: color,
      });
    });
    contactData.push({
      label: infoGrowthGroups.generalInfo.label,
      data: infoGrowthGroups.generalInfo.quantityPerMonth,
      fill: false,
      borderDash: [5, 5],
      borderColor: GYellow,
      backgroundColor: GYellow,
    });
    contactData.push({
      type: 'bar',
      label: infoGrowthGroups.strategiesInfo.label,
      data: infoGrowthGroups.strategiesInfo.quantityPerMonth,
      fill: true,
      backgroundColor: GGray,
      borderColor: GGray,
    });

    return contactData;
  };

  const getLastFiveMonths = (): string[] => {
    const months = Months;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastFiveMonths = [];

    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];

      lastFiveMonths.push(monthName);
    }

    return lastFiveMonths;
  };

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
        <GLineChart
          data={generateChartContactData()}
          labels={getLastFiveMonths()}
        />
      </div>
    </>
  );
};
