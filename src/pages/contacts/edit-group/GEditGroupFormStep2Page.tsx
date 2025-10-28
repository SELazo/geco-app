import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddgroup.css';
import('../../../styles/gcontactItem.css');

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GContactsIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import { GBlack, GWhite, GYellow, GRed } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GroupsServiceFirestore } from '../../../services/external/groupsServiceFirestore';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';
import { IContact } from '../../../interfaces/dtos/external/IFirestore';
import { Alert, CircularProgress } from '@mui/material';

const { getGroup } = GroupsServiceFirestore;

export const GEditGroupFormStep2Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupContacts, setGroupContacts] = useState<IContact[]>([]);
  const [targetFirestoreId, setTargetFirestoreId] = useState<string | null>(null);
  const [removingContact, setRemovingContact] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!id) {
    navigate('/contacts/groups');
    return null;
  }

  const numericId = parseInt(id);

  useEffect(() => {
    // Mostrar mensaje de éxito si viene del paso anterior
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    }

    const fetchGroupContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener usuario actual
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('Usuario no autenticado');
        }
        
        const user = JSON.parse(userStr);
        const userIdStr = user.id.toString();
        
        // 1. Obtener datos del grupo
        const groupData = await getGroup(numericId);
        
        if (groupData && groupData.group) {
          console.log('🔍 Debug - Datos originales del grupo:', groupData.contacts);
          
          // Convertir contactos del grupo
          const convertedContacts: IContact[] = (groupData.contacts || []).map((contact, index) => {
            console.log(`🔍 Debug - Contacto original:`, contact);
            const convertedContact = {
              id: contact.id ? contact.id.toString() : `temp-contact-${index}`,
              name: contact.name,
              email: contact.email || undefined,
              phone: contact.phone?.toString() || undefined,
              groups: [],
              userId: contact.account_id ? contact.account_id.toString() : 'unknown',
              status: 'active' as const,
              tags: []
            };
            console.log(`🔍 Debug - Contacto convertido:`, convertedContact);
            return convertedContact;
          });
          setGroupContacts(convertedContacts);
        }
        
        // 2. Encontrar el ID real de Firestore
        const allGroups = await ContactsFirestoreService.getUserGroups(userIdStr);
        let firestoreId: string | null = null;
        
        for (const group of allGroups) {
          const groupFirestoreId = group.id || '0';
          const numericIdCalc = groupFirestoreId === '0' ? 0 : Math.abs(groupFirestoreId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0));
          
          if (numericIdCalc === numericId) {
            firestoreId = groupFirestoreId;
            break;
          }
        }
        
        setTargetFirestoreId(firestoreId);
        
      } catch (error) {
        console.error('Error fetching group contacts:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los contactos del grupo';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupContacts();
  }, [numericId]);

  const handleRemoveContact = async (contactId: string) => {
    if (!targetFirestoreId) {
      setError('No se pudo identificar el grupo');
      return;
    }

    if (!contactId || contactId.startsWith('temp-contact-')) {
      setError('ID de contacto no válido');
      return;
    }

    try {
      setRemovingContact(contactId);
      setError(null);

      // Remover contacto del grupo en Firestore
      await ContactsFirestoreService.removeContactFromGroup(contactId, targetFirestoreId);

      // Actualizar estado local
      setGroupContacts(prevContacts => 
        prevContacts.filter(contact => contact.id !== contactId)
      );

    } catch (error) {
      console.error('Error removing contact from group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el contacto del grupo';
      setError(errorMessage);
    } finally {
      setRemovingContact(null);
    }
  };

  const handleContinue = () => {
    // Navegar al paso 3 (agregar nuevos contactos)
    navigate(`/contacts/groups/edit-group/${id}/add-members`);
  };

  const handleFinish = () => {
    // Finalizar edición y regresar a la lista
    navigate('/contacts/groups', { 
      state: { message: 'Grupo actualizado exitosamente' }
    });
  };

  if (loading) {
    return (
      <div className="geco-add-group-main">
        <div className="geco-add-group-nav-bar">
          <Link className="geco-add-group-nav-bar-logo" to="/home">
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
        <div className="geco-add-group-header-title">
          <GHeadSectionTitle
            title="Editar Grupo - Paso 2"
            subtitle="Cargando miembros del grupo..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="geco-add-group-main">
        <div className="geco-add-group-nav-bar">
          <Link className="geco-add-group-nav-bar-logo" to="/home">
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
        <div className="geco-add-group-header-title">
          <GHeadSectionTitle
            title="Error"
            subtitle={error}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="geco-add-group-main">
      <div className="geco-add-group-nav-bar">
        <Link className="geco-add-group-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-add-group-nav-bar-section" to="/contacts/info">
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
      <div className="geco-add-group-header-title">
        <GHeadSectionTitle
          title="Gestionar miembros"
          subtitle="Administra los contactos del grupo. 👥 \n Elimina miembros que ya no necesites en este grupo. ❌"
        />
      </div>

      <div className="geco-form">
        <div className="input-group">
          <h3 style={{ color: GBlack, marginBottom: '1rem', fontSize: '1.1rem' }}>
            Miembros Actuales ({groupContacts.length})
          </h3>
          
          {groupContacts.length === 0 ? (
            <div className="geco-contacts-empty">
              <p>Este grupo no tiene miembros actualmente.</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                Puedes agregar contactos en el siguiente paso.
              </p>
            </div>
          ) : (
            <div className="geco-input-group">
              {groupContacts.map((contact, index) => (
                <div key={`group-contact-${index}-${contact.name || 'unknown'}`} className="geco-contact-item-card">
                  <div className="geco-contact-body">
                    <h4 className="geco-contact-item-name">{contact.name}</h4>
                    <div className="geco-contact-item-info">
                      <p>{contact.phone}</p>
                      {contact.email && <p>{contact.email}</p>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => contact.id && !contact.id.startsWith('temp-contact-') && handleRemoveContact(contact.id)}
                    disabled={removingContact === contact.id || contact.id?.startsWith('temp-contact-')}
                    style={{
                      backgroundColor: GRed,
                      color: GWhite,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '0.9rem',
                      cursor: removingContact === contact.id ? 'not-allowed' : 'pointer',
                      opacity: removingContact === contact.id ? 0.6 : 1,
                      minWidth: '80px'
                    }}
                  >
                    {removingContact === contact.id ? (
                      <CircularProgress size={16} sx={{ color: 'white' }} />
                    ) : (
                      'Eliminar'
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mostrar mensajes de éxito */}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Mostrar errores */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Botones de navegación */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={handleContinue}
            style={{
              backgroundColor: GYellow,
              color: GBlack,
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Agregar Miembros
          </button>
          <button
            type="button"
            onClick={handleFinish}
            style={{
              backgroundColor: GBlack,
              color: GWhite,
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};
