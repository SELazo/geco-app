import('../../styles/gcontactsGroups.css');

import { GCircularButton } from '../../components/GCircularButton';
import {
  GChevronLeftIcon,
  GChevronRightBlackIcon,
  GChevronRightIcon,
  GContactsIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../constants/buttons';
import {
  GBlack,
  GBlue,
  GGreen,
  GPink,
  GRed,
  GWhite,
  GYellow,
} from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../constants/wording';
import { GContactItem, IContactItem } from '../../components/GContactItem';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link, useNavigate } from 'react-router-dom';
import { GDropdownMenu, IMenuItem } from '../../components/GDropdownMenu';
import { GGroupItem } from '../../components/GGroupItem';
import { GroupsService } from '../../services/external/groupsService';
import { useEffect, useState } from 'react';
import { IGroup } from '../../interfaces/dtos/external/IGroups';
import { ROUTES } from '../../constants/routes';

const { getGroups } = GroupsService;

export const GContactsGroupPage = () => {
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const groupsData = await getGroups();
        setGroupsList(groupsData ?? []);
      } catch (error) {
        console.log(error); // TODO: Mostrar error en pantalla
      }
    };

    fetchContacts();
  }, []);

  const menuGroups: IMenuItem[] = [
    {
      label: 'Agregar grupo',
      route: '/contacts/groups/add-group/info',
      color: GYellow,
    },
    {
      label: 'Eliminar grupo',
      route: '/contacts/delete-group',
      color: GRed,
    },
  ];

  const getRotatingColor = (() => {
    const colors = [GYellow, GPink, GBlue, GRed, GGreen];
    let index = 0;

    return () => {
      const color = colors[index];

      index = (index + 1) % colors.length;

      return color;
    };
  })();

  const seeMoreGroup = (id: number) => {
    navigate(
      `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.GROUP_SEE_MORE.replace(
        ':id',
        id.toString()
      )}`
    );
  };

  return (
    <>
      <div className="geco-contacts-groups">
        <div className="geco-contacts-groups-head">
          <div className="geco-contacts-groups-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link
              className="geco-contacts-groups-nav-bar-section"
              to="/contacts/info"
            >
              <GCircularButton
                icon={GContactsIcon}
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
          <div
            className="geco-contacts-groups-head-nav-bar-right
          "
          >
            <GDropdownMenu menu={menuGroups} />
          </div>
        </div>
        <div className="geco-contacts-groups-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>
        {groupsList.length > 0 && (
          <div className="geco-contacts-groups-container">
            <div className="geco-contacts-groups-ul">
              <div className="geco-contacts-groups-item">
                {groupsList.map((item) => {
                  const rotatingColor = getRotatingColor(); // Invocar la función y almacenar el resultado en una variable
                  return (
                    <GGroupItem
                      key={item.id}
                      group={item}
                      color={rotatingColor} // Usar el resultado almacenado como el valor de la prop "color"
                      icon={GChevronRightBlackIcon}
                      iconBackgroundColor={GBlack}
                      onClickAction={() => seeMoreGroup(item.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {groupsList.length === 0 && (
          <div className="geco-contacts-groups-empty">
            <p>No tiene grupos aún.</p>
          </div>
        )}
      </div>
    </>
  );
};
