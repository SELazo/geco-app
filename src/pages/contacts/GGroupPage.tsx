import('../../styles/gcontactsList.css');

import { useEffect, useState } from 'react';

import { GCircularButton } from '../../components/GCircularButton';
import {
  GContactsIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../constants/buttons';
import { GBlack, GGreen, GRed, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { GroupsService } from '../../services/external/groupsService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { GContactItem } from '../../components/GContactItem';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { IGroupResponse } from '../../interfaces/dtos/external/IGroups';

const { getGroup } = GroupsService;

export const GGroupPage = () => {
  const [group, setGroup] = useState<IGroupResponse | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    navigate(ROUTES.GROUPS.ROOT);
    return null;
  }
  const numericId = parseInt(id); // Convertir el parámetro 'id' a un número

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getGroup(numericId);
        const groupData = response as IGroupResponse;
        setGroup(groupData ?? null);
      } catch (error) {
        console.error(error); // TODO: Mostrar error en pantalla
        navigate(ROUTES.GROUPS.ROOT);
      }
    };

    fetchContacts();
  }, []);

  const editContact = (id: number) => {
    console.log(group?.contacts.find((c) => c.id === id));
  };

  return (
    <div className="geco-contacts-list">
      <div className="geco-contacts-list-head">
        <div className="geco-contacts-list-head-nav-bar">
          <Link className="geco-contacts-head-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link
            className="geco-contacts-list-nav-bar-section"
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
      </div>
      <div className="geco-contacts-list-title">
        <GHeadCenterTitle title={group?.group.name!} color={GBlack} />
      </div>
      {group?.contacts.length! > 0 && (
        <div className="geco-contacts-list-container">
          <div className="geco-contacts-list-ul">
            <div className="geco-contacts-list-item">
              {group?.contacts.map((item) => (
                <GContactItem
                  key={item.id}
                  contact={item}
                  icon={GEditIcon}
                  iconBackgroundColor={GYellow}
                  onClickAction={() => editContact(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {group?.contacts.length === 0 && (
        <div className="geco-contacts-empty">
          <p>No tiene contactos aún.</p>
        </div>
      )}
    </div>
  );
};
