import('../../styles/gcontactsList.css');

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, CircularProgress, Box } from '@mui/material';

import { GCircularButton } from '../../components/GCircularButton';
import {
  GContactsIcon,
  GEditIcon,
  GIconButtonBack,
} from '../../constants/buttons';
import { GBlack, GGreen, GRed, GWhite, GYellow } from '../../constants/palette';
import { NavigationService } from '../../services/internal/navigationService';
import { ContactsFirestoreService } from '../../services/external/contactsFirestoreService';
import { GHeadCenterTitle } from '../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../constants/wording';
import { GContactItem } from '../../components/GContactItem';
import { GLogoLetter } from '../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { GDropdownMenu, IMenuItem } from '../../components/GDropdownMenu';
import { IContact } from '../../interfaces/dtos/external/IFirestore';
import { SessionState } from '../../redux/sessionSlice';
import { ROUTES } from '../../constants/routes';

export const GContactsListPage = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Obtener usuario desde Redux
  const user = useSelector((state: SessionState) => state.user);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Obtener contactos del usuario desde Firestore
        const userContacts = await ContactsFirestoreService.getUserContacts(user.id.toString());
        setContacts(userContacts);
        
      } catch (error) {
        console.error('Error cargando contactos:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchContacts();
    }
  }, [user.id]);

  const menuContacts: IMenuItem[] = [
    {
      label: 'Agregar contacto',
      route: '/contacts/add-contact',
      color: GYellow,
    },
    {
      label: 'Agregar contactos desde Excel',
      route: '/contacts/add-contacts-excel',
      color: GGreen,
    },
    {
      label: 'Eliminar contactos',
      route: '/contacts/delete-contact',
      color: GRed,
    },
  ];

  const editContact = (id: string | undefined) => {
    if (id) {
      console.log(contacts.find((c) => c.id === id));
    }
  };

  return (
    <>
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
              onClickAction={NavigationService.handleNavigation(
                ROUTES.CONTACTS.OPTIONS
              )}
            />
          </div>
          <div className="geco-contacts-list-head-nav-bar-right">
            <GDropdownMenu menu={menuContacts} />
          </div>
        </div>
        <div className="geco-contacts-list-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>

        {/* Mostrar indicador de carga */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        )}

        {/* Mostrar error si existe */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            Error al cargar contactos: {error}
          </Alert>
        )}

        {/* Mostrar contactos */}
        {!loading && !error && contacts.length > 0 && (
          <div className="geco-contacts-list-container">
            <div className="geco-contacts-list-ul">
              <div className="geco-contacts-list-item">
                {contacts.map((item) => (
                  <GContactItem
                    key={item.id}
                    contact={{
                      ...item,
                      account_id: 1, // Valor por defecto para compatibilidad
                      cellphone: item.phone || '', // Mapear phone a cellphone
                    } as any}
                    icon={GEditIcon}
                    iconBackgroundColor={GYellow}
                    onClickAction={() => editContact(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mostrar mensaje cuando no hay contactos */}
        {!loading && !error && contacts.length === 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Alert severity="info">
              No tienes contactos aún. ¡Agrega tu primer contacto!
            </Alert>
          </Box>
        )}
      </div>
    </>
  );
};
