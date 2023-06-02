import { Link } from 'react-router-dom';
import { GCircularButton } from '../../../components/GCircularButton';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GIconButtonBack, GStatisticsIcon } from '../../../constants/buttons';
import {
  GBlack,
  GBlue,
  GGreen,
  GPink,
  GRed,
  GWhite,
  GYellow,
} from '../../../constants/palette';
import {
  ContactsHeadCenterTitle,
  StatisticsSectionTitle,
} from '../../../constants/wording';
import { NavigationService } from '../../../services/navigationService';

import '../../../styles/gstatisticsContacts.css';
import {
  DatasetPolarArea,
  GPolarAreaChart,
} from '../../../components/GPolarAreaChart';
import { IContactsCompositionResponse } from '../../../interfaces/IContactsStatistics';

type ContactGrowthChartProps = {
  data: { label: string; values: number[]; color: string }[];
};

export const GRedCompositionPage = () => {
  const labels: string[] = [];
  const data: DatasetPolarArea[] = [];

  const infoContactsComposition: IContactsCompositionResponse = {
    groups: [
      { label: 'Mamás', quantity: 50 },
      { label: 'Papás', quantity: 60 },
      { label: 'Universitarios', quantity: 70 },
      { label: 'Niños', quantity: 40 },
      { label: 'Jubilados', quantity: 90 },
    ],
    total: 500,
  };

  const generateColorList = (count: number): string[] => {
    const colors = [
      `${GPink}99`,
      `${GBlue}99`,
      `${GRed}99`,
      `${GGreen}99`,
      `${GYellow}99`,
    ];
    const colorList = [];

    for (let i = 0; i < count; i++) {
      const color = colors[i % colors.length];

      colorList.push(color);
    }

    return colorList;
  };

  const generateChartContactData = (): DatasetPolarArea[] => {
    const compositions: number[] = [];

    infoContactsComposition.groups.map((group) => {
      compositions.push(group.quantity);
    });

    data.push({
      label: ContactsHeadCenterTitle,
      data: compositions,
      backgroundColor: generateColorList(infoContactsComposition.groups.length),
    });

    return data;
  };

  const generateChartLabels = (): string[] => {
    infoContactsComposition.groups.map((group) => {
      labels.push(group.label);
    });

    return labels;
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
        <div className="geco-statistics-contacts-total">
          <p>Total de contactos: {infoContactsComposition.total}</p>
        </div>
        <GPolarAreaChart
          datasets={generateChartContactData()}
          labels={generateChartLabels()}
        />
      </div>
    </>
  );
};
