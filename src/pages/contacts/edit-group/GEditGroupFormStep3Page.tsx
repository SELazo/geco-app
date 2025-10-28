import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GroupsServiceFirestore } from '../../../services/external/groupsServiceFirestore';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';
import { IContact } from '../../../interfaces/dtos/external/IFirestore';
import { Alert, CircularProgress } from '@mui/material';

const { getGroup } = GroupsServiceFirestore;

interface IContactWithSelection extends IContact {
  isSelected: boolean;
}

export const GEditGroupFormStep3Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allContacts, setAllContacts] = useState<IContactWithSelection[]>([]);
  const [groupContactIds, setGroupContactIds] = useState<string[]>([]);
  const [targetFirestoreId, setTargetFirestoreId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  if (!id) {
    navigate('/contacts/groups');
    return null;
  }

  const numericId = parseInt(id);

  useEffect(() => {
    const fetchContactsAndGroup = async () => {
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
        
        // 1. Obtener datos del grupo para saber qué contactos ya están
        const groupData = await getGroup(numericId);
        const currentGroupContactIds = (groupData?.contacts || [])
          .map(contact => contact.id ? contact.id.toString() : null)
          .filter(id => id !== null) as string[];
        
        console.log('🔍 Debug Paso 3 - Contactos actuales del grupo:', currentGroupContactIds);
        setGroupContactIds(currentGroupContactIds);
        
        
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
        
        // 3. Obtener todos los contactos del usuario
        const userContacts = await ContactsFirestoreService.getUserContacts(userIdStr);
        
        // 4. Filtrar contactos que NO están en el grupo y marcarlos como no seleccionados
        console.log('🔍 Debug Paso 3 - Todos los contactos del usuario:', userContacts.map(c => ({ id: c.id, name: c.name })));
        
        const availableContacts: IContactWithSelection[] = userContacts
          .filter(contact => {
            const contactId = contact.id || '';
            const isInGroup = currentGroupContactIds.includes(contactId);
            console.log(`🔍 Debug Paso 3 - Contacto ${contact.name} (${contactId}) - En grupo: ${isInGroup}`);
            return !isInGroup;
          })
          .map(contact => ({
            ...contact,
            isSelected: false
          }));
        
        console.log('🔍 Debug Paso 3 - Contactos disponibles para agregar:', availableContacts.map(c => ({ id: c.id, name: c.name })));
        setAllContacts(availableContacts);
        
      } catch (error) {
        console.error('Error fetching contacts and group:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los contactos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchContactsAndGroup();
  }, [numericId]);

  // Función para manejar selección/deselección de contactos
  const handleContactSelection = (contactId: string, isSelected: boolean) => {
    setAllContacts(prevContacts => {
      const updatedContacts = prevContacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isSelected }
          : contact
      );
      
      // Actualizar contador
      setSelectedCount(updatedContacts.filter(c => c.isSelected).length);
      
      return updatedContacts;
    });
  };

  const handleAddContacts = async () => {
    if (!targetFirestoreId) {
      setError('No se pudo identificar el grupo');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const selectedContacts = allContacts.filter(contact => contact.isSelected);
      
      if (selectedContacts.length === 0) {
        setError('Selecciona al menos un contacto para agregar');
        return;
      }

      // Agregar cada contacto seleccionado al grupo
      for (const contact of selectedContacts) {
        if (contact.id) {
          await ContactsFirestoreService.addContactToGroup(contact.id, targetFirestoreId);
        }
      }

      // Navegar de vuelta a la lista de grupos con mensaje de éxito
      navigate('/contacts/groups', { 
        state: { message: `Se agregaron ${selectedContacts.length} contacto(s) al grupo exitosamente` }
      });

    } catch (error) {
      console.error('Error adding contacts to group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al agregar contactos al grupo';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // Finalizar sin agregar contactos
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
            title="Editar Grupo - Paso 3"
            subtitle="Cargando contactos disponibles..."
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
          title="Agregar miembros"
          subtitle="Selecciona contactos para agregar al grupo. ➕ \n Elige los contactos que quieres incluir en este grupo. ✅"
        />
      </div>

      <div className="geco-form">
        <div className="input-group">
          <h3 style={{ color: GBlack, marginBottom: '1rem', fontSize: '1.1rem' }}>
            Contactos Disponibles ({selectedCount} seleccionados)
          </h3>
          
          {allContacts.length === 0 ? (
            <div className="geco-contacts-empty">
              <p>Todos tus contactos ya están en este grupo.</p>
              <p style={{ fontSize: '0.9em', color: '#666' }}>
                No hay contactos disponibles para agregar.
              </p>
            </div>
          ) : (
            <div className="geco-input-group" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
              {allContacts.map((contact, index) => (
                <div key={`available-contact-${index}-${contact.name || 'unknown'}`} className="geco-contact-item-card">
                  <div className="geco-contact-body">
                    <h4 className="geco-contact-item-name">{contact.name}</h4>
                    <div className="geco-contact-item-info">
                      <p>{contact.phone}</p>
                      {contact.email && <p>{contact.email}</p>}
                    </div>
                  </div>
                  <input
                    className="geco-checkbox"
                    type="checkbox"
                    id={`contact-${contact.id}`}
                    checked={contact.isSelected}
                    onChange={(e) => contact.id && handleContactSelection(contact.id, e.target.checked)}
                    disabled={saving}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mostrar errores */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Botones de acción */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={handleAddContacts}
              disabled={saving}
              style={{
                backgroundColor: saving ? '#ccc' : GYellow,
                color: GBlack,
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '180px'
              }}
            >
              {saving ? (
                <>
                  <CircularProgress size={16} sx={{ color: GBlack }} />
                  Agregando...
                </>
              ) : (
                `Agregar ${selectedCount} contacto(s)`
              )}
            </button>
          )}
          <button
            type="button"
            onClick={handleSkip}
            disabled={saving}
            style={{
              backgroundColor: GBlack,
              color: GWhite,
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1
            }}
          >
            {allContacts.length === 0 ? 'Finalizar' : 'Omitir'}
          </button>
        </div>
      </div>
    </div>
  );
};
