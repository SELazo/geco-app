import('../../styles/gcontactsGroups.css');

import { GCircularButton } from '../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GContactsIcon,
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
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link, useNavigate } from 'react-router-dom';
import { GDropdownMenu, IMenuItem } from '../../components/GDropdownMenu';
import { GGroupItem } from '../../components/GGroupItem';
import { GroupsServiceFirestore } from '../../services/external/groupsServiceFirestore';
import { useEffect, useState } from 'react';
import { IGroup } from '../../interfaces/dtos/external/IGroups';
import { ROUTES } from '../../constants/routes';
import { useLocation } from 'react-router-dom';

const { getGroups } = GroupsServiceFirestore;

export const GContactsGroupPage = () => {
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const groupsData = await getGroups();
        setGroupsList(groupsData ?? []);
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

  // Efecto para recargar grupos cuando se navega desde página de éxito
  useEffect(() => {
    const previousPath = location.state?.from;
    console.log('📍 Navegación detectada desde:', previousPath);
    
    if (previousPath === `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_SUCCESS}`) {
      console.log('🔄 Recargando grupos después de creación exitosa...');
      // Forzar recarga de grupos
      const fetchGroups = async () => {
        try {
          setLoading(true);
          const groupsData = await getGroups();
          console.log('✅ Grupos recargados:', groupsData);
          setGroupsList(groupsData ?? []);
        } catch (error) {
          console.error('❌ Error recargando grupos:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchGroups();
    }
  }, [location]);

  const menuGroups: IMenuItem[] = [
    {
      label: 'Agregar grupo',
      route: '/contacts/groups/add-group/info',
      color: GYellow,
    },
    {
      label: 'Editar grupo',
      route: `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.EDIT_GROUP_SELECT}`,
      color: GBlue,
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

  const seeMoreGroup = (id: number | string) => {
    const idStr = typeof id === 'number' ? id.toString() : id;
    console.log('🔗 Navegando a grupo con ID:', idStr);
    navigate(
      `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.GROUP_SEE_MORE.replace(
        ':id',
        idStr
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
            className="geco-contacts-groups-head-nav-bar-right"
          >
            <GDropdownMenu menu={menuGroups} />
          </div>
        </div>
        <div className="geco-contacts-groups-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>

        {loading && (
          <div className="geco-contacts-groups-empty">
            <p>Cargando grupos...</p>
          </div>
        )}

        {error && (
          <div className="geco-contacts-groups-empty">
            <p style={{ color: 'red' }}>Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && groupsList.length > 0 && (
          <div className="geco-contacts-groups-container">
            <div className="geco-contacts-groups-ul">
              <div className="geco-contacts-groups-item">
                {groupsList.map((item) => {
                  const rotatingColor = getRotatingColor(); // Invocar la función y almacenar el resultado en una variable
                  // Usar firestoreId si está disponible, sino usar id numérico
                  const groupId = (item as any).firestoreId || item.id;
                  return (
                    <GGroupItem
                      key={item.id}
                      group={item}
                      color={rotatingColor} // Usar el resultado almacenado como el valor de la prop "color"
                      icon={GChevronRightBlackIcon}
                      iconBackgroundColor={GBlack}
                      onClickAction={() => seeMoreGroup(groupId)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && groupsList.length === 0 && (
          <div className="geco-contacts-groups-empty">
            <p>No tiene grupos aún.</p>
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
              Puede crear un nuevo grupo usando el menú superior.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
