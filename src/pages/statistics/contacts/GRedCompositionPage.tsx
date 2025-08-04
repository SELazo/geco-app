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
import { NavigationService } from '../../../services/internal/navigationService';

import '../../../styles/gstatisticsContacts.css';
import {
  DatasetPolarArea,
  GPolarAreaChart,
} from '../../../components/GPolarAreaChart';
import { IContactsCompositionResponse } from '../../../interfaces/IContactsStatistics';
import { GroupsService } from '../../../services/external/groupsService';
import { useEffect, useState } from 'react';
import { ContactsService } from '../../../services/external/contactsService';

type ContactGrowthChartProps = {
  data: { label: string; values: number[]; color: string }[];
};

const { getGroups, getGroup } = GroupsService;
const { getContacts } = ContactsService;

export const GRedCompositionPage = () => {
  const labels: string[] = [];
  const data: DatasetPolarArea[] = [];
  const [infoContactsComposition, setInfoContactsComposition] =
    useState<IContactsCompositionResponse>({
      groups: [],
      total: 0,
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contactsData = await getContacts();
        const groupsData = await getGroups();
        const updatedGroups = await Promise.all(
          groupsData.map(async (group) => {
            const g = await getGroup(group.id);
            return {
              label: g.group.name,
              quantity: g.contacts.length,
            };
          })
        );

        setInfoContactsComposition({
          groups: updatedGroups,
          total: contactsData.data?.length!,
        });
      } catch (error) {
        console.log(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchData();
  }, []);

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
