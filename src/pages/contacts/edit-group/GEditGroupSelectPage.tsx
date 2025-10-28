import('../../../styles/gcontactsList.css');

import { useEffect, useState } from 'react';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack } from '../../../constants/buttons';
import { GBlack, GWhite } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link, useNavigate } from 'react-router-dom';
import { GroupsServiceFirestore } from '../../../services/external/groupsServiceFirestore';
import { IGroup } from '../../../interfaces/dtos/external/IGroups';
import { GGroupItem } from '../../../components/GGroupItem';
import { GChevronRightBlackIcon } from '../../../constants/buttons';

const { getGroups } = GroupsServiceFirestore;

export const GEditGroupSelectPage = () => {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const groupsData = await getGroups();
        setGroups(groupsData ?? []);
      } catch (error) {
        console.error('Error fetching groups:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los grupos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGroupSelect = (groupId: number) => {
    navigate(`/contacts/groups/edit-group/${groupId}`);
  };

  return (
    <>
      <div className="geco-contacts-list">
        <div className="geco-contacts-list-head">
          <div className="geco-contacts-list-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
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
          <GHeadCenterTitle title="Seleccionar Grupo a Editar" color={GBlack} />
        </div>

        {loading && (
          <div className="geco-contacts-list-empty">
            <p>Cargando grupos...</p>
          </div>
        )}

        {error && (
          <div className="geco-contacts-list-empty">
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <div className="geco-contacts-list-empty">
            <p>No tienes grupos creados aún.</p>
            <p>Crea tu primer grupo desde el menú principal.</p>
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="geco-contacts-list-content">
            {groups.map((group, index) => (
              <div key={group.id || `group-${index}`} onClick={() => handleGroupSelect(group.id)}>
                <GGroupItem
                  group={group}
                  color="#007bff"
                  icon={GChevronRightBlackIcon}
                  iconBackgroundColor={GWhite}
                  onClickAction={() => handleGroupSelect(group.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
