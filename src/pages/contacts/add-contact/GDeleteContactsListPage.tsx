import('../../../styles/gcontactsList.css');

import { GCircularButton } from '../../../components/GCircularButton';
import { GDeletetIcon, GIconButtonBack } from '../../../constants/buttons';
import { GBlack, GRed, GWhite } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../../constants/wording';
import { GContactItem } from '../../../components/GContactItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IContact } from '../../../interfaces/dtos/external/IFirestore';
import { RootState } from '../../../redux/gecoStore';
import { useSelector } from 'react-redux';
import { Alert, CircularProgress, Box } from '@mui/material';

export const GDeleteContactsListPage = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [deleting, setDeleting] = useState<string | null>(null);
  
  // Obtener usuario desde Redux
  const user = useSelector((state: RootState) => state.user);
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('👤 Usuario actual:', user);
        
        // Verificar que tenemos un usuario válido
        if (!user || !user.id || user.id === -1) {
          console.log('⚠️ Usuario no válido:', user);
          console.log('🔐 Estado de autenticación:', auth);
          setError('Usuario no encontrado. Verifica que hayas iniciado sesión.');
          return;
        }
        
        console.log('🔥 Obteniendo contactos para eliminar del usuario:', user.id);
        
        // Obtener contactos del usuario desde Firestore
        const userContacts = await ContactsFirestoreService.getUserContacts(user.id.toString());
        
        console.log('✅ Contactos obtenidos para eliminar:', userContacts);
        setContacts(userContacts);
        
      } catch (error) {
        console.error('❌ Error cargando contactos:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido al cargar contactos');
      } finally {
        setLoading(false);
      }
    };

    // Agregar un pequeño delay para asegurar que Redux esté inicializado
    const timer = setTimeout(() => {
      if (user && user.id) {
        fetchContacts();
      } else {
        console.warn('⚠️ Usuario no disponible en Redux:', user);
        setLoading(false);
        setError('Usuario no encontrado. Verifica que hayas iniciado sesión.');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, auth]);

  const handleDeleteContact = async (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el contacto "${contact.name}"? Esta acción no se puede deshacer.`
    );
    
    if (!confirmDelete) return;
    
    try {
      setDeleting(contactId);
      console.log('🗑️ Eliminando contacto:', contactId);
      
      await ContactsFirestoreService.deleteContact(contactId);
      
      // Actualizar la lista local removiendo el contacto eliminado
      setContacts(prevContacts => prevContacts.filter(c => c.id !== contactId));
      
      console.log('✅ Contacto eliminado exitosamente');
      
    } catch (error) {
      console.error('❌ Error eliminando contacto:', error);
      setError(error instanceof Error ? error.message : 'Error eliminando contacto');
    } finally {
      setDeleting(null);
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
          <GHeadCenterTitle title="Eliminar Contactos" color={GBlack} />
        </div>

        {/* Mostrar indicador de carga */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
            <span style={{ marginLeft: '16px' }}>Cargando contactos...</span>
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
                  <div key={item.id} style={{ position: 'relative' }}>
                    <GContactItem
                      contact={{
                        ...item,
                        account_id: 1, // Valor por defecto para compatibilidad
                        cellphone: item.phone || '', // Mapear phone a cellphone
                      } as any}
                      icon={GDeletetIcon}
                      iconBackgroundColor={deleting === item.id ? '#ccc' : GRed}
                      onClickAction={() => item.id && handleDeleteContact(item.id)}
                    />
                    {deleting === item.id && (
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        sx={{
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          borderRadius: '50%',
                          padding: '8px'
                        }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mostrar mensaje cuando no hay contactos */}
        {!loading && !error && contacts.length === 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Alert severity="info">
              No tienes contactos para eliminar.
            </Alert>
          </Box>
        )}
      </div>
    </>
  );
};
