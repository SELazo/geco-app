import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, CircularProgress, Box } from '@mui/material';

import('../../../styles/gcontactsList.css');

import { NavigationService } from '../../../services/internal/navigationService';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GContactsIcon,
  GDeletetIcon,
  GIconButtonBack,
} from '../../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../../constants/palette';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { ContactsSectionTitle } from '../../../constants/wording';
import { GContactItem, IContactItem } from '../../../components/GContactItem';
import { GContactImportItem } from '../../../components/GContactImportItem';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { IContactResponse } from '../../../interfaces/dtos/external/IContacts';
import { ContactsService } from '../../../services/external/contactsService';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';
import { IContact } from '../../../interfaces/dtos/external/IFirestore';
import { RootState } from '../../../redux/gecoStore';

const { newContact } = ContactsService;

export const GListContactsToImportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Obtener usuario desde Redux
  const user = useSelector((state: RootState) => state.user);
  
  // Estados para manejo de la importación
  const [contacts, setContacts] = useState<IContactResponse[]>(
    () => location.state.contacts
  );
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string>('');
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<Map<number, { isDuplicate: boolean; existingContact?: IContact }>>(new Map());

  const deleteContact = async (id: number) => {
    const newContacts = contacts.filter((c) => c.id !== id);
    
    // Actualizar la lista de contactos
    setContacts(newContacts);
    
    // Limpiar completamente la información de duplicados
    setDuplicateInfo(new Map());
    
    // Re-verificar inmediatamente con la nueva lista de contactos
    if (newContacts.length > 0 && user && user.id) {
      // Pasar explícitamente la nueva lista para evitar problemas de closure
      await checkForDuplicates(newContacts);
    }
  };

  // Función para verificar duplicados con lista específica de contactos
  const checkForDuplicates = async (contactsToCheck?: IContactResponse[]) => {
    if (!user || !user.id || user.id === -1) {
      console.warn('⚠️ Usuario no disponible para verificar duplicados');
      return;
    }

    // Usar la lista proporcionada o la del estado actual
    const currentContacts = contactsToCheck || contacts;
    
    if (currentContacts.length === 0) {
      setDuplicateInfo(new Map());
      return;
    }

    try {
      setCheckingDuplicates(true);

      // Limpiar información de duplicados anterior
      setDuplicateInfo(new Map());

      // Obtener todos los contactos existentes del usuario
      const existingContacts = await ContactsFirestoreService.getUserContacts(user.id.toString());
      
      // VERIFICACIÓN CRÍTICA: Si no hay contactos en base, NO DEBE HABER DUPLICADOS
      if (existingContacts.length === 0) {
        const duplicateMap = new Map<number, { isDuplicate: boolean; existingContact?: IContact }>();
        currentContacts.forEach((contact) => {
          duplicateMap.set(contact.id, {
            isDuplicate: false,
            existingContact: undefined
          });
        });
        
        setDuplicateInfo(duplicateMap);
        return;
      }

      const duplicateMap = new Map<number, { isDuplicate: boolean; existingContact?: IContact }>();

      currentContacts.forEach((contact) => {
        // Verificar duplicados por email
        const isDuplicateByEmail = contact.email && existingContacts.find(existing => 
          existing.email && existing.email.toLowerCase() === contact.email.toLowerCase()
        );
        
        // Verificar duplicados por teléfono
        const isDuplicateByPhone = contact.phone && existingContacts.find(existing => 
          existing.phone && existing.phone.replace(/\D/g, '') === contact.phone.toString().replace(/\D/g, '')
        );

        const existingContact = isDuplicateByEmail || isDuplicateByPhone;
        const isDuplicate = !!existingContact;

        duplicateMap.set(contact.id, {
          isDuplicate,
          existingContact: existingContact || undefined
        });
      });

      setDuplicateInfo(duplicateMap);
      
      const duplicatesCount = Array.from(duplicateMap.values()).filter(info => info.isDuplicate).length;

    } catch (error) {
      console.error('❌ Error verificando duplicados:', error);
      // En caso de error, limpiar la información de duplicados
      setDuplicateInfo(new Map());
    } finally {
      setCheckingDuplicates(false);
    }
  };

  // Verificar duplicados al cargar la página
  useEffect(() => {
    if (user && user.id && contacts.length > 0) {
      checkForDuplicates();
    }
  }, [user]); // Solo depende del usuario, no de contacts para evitar loops

  const addContacts = async () => {
    try {
      setImporting(true);
      setImportError('');

      console.log('📥 Iniciando importación de contactos:', contacts.length);
      console.log('👤 Usuario actual:', user);

      // Validar que tenemos un usuario válido
      if (!user || !user.id || user.id === -1) {
        setImportError('Usuario no encontrado. Por favor, inicia sesión nuevamente.');
        console.error('❌ Usuario no disponible:', user);
        return;
      }

      if (contacts.length === 0) {
        setImportError('No hay contactos para importar.');
        return;
      }

      // Importar TODOS los contactos, incluyendo duplicados
      const contactsToImport = contacts;
      
      console.log(`📥 Importando ${contactsToImport.length} contacto${contactsToImport.length !== 1 ? 's' : ''} (incluyendo posibles duplicados)`);

      // Crear contactos en Firestore (todos los contactos)
      const importPromises = contactsToImport.map(async (contact) => {
        try {
          // Convertir formato de IContactResponse a IContact para Firestore
          const contactData: Omit<IContact, 'id' | 'createdAt' | 'updatedAt'> = {
            name: contact.name.trim(),
            email: contact.email?.trim() || undefined,
            phone: contact.phone?.toString().trim() || undefined,
            groups: [], // Sin grupos inicialmente
            tags: ['importado-excel'], // Tag para identificar contactos importados
            userId: user.id.toString(),
            status: 'active',
          };

          console.log('💾 Creando contacto:', contactData.name);
          const contactId = await ContactsFirestoreService.createContact(contactData);
          console.log('✅ Contacto creado con ID:', contactId);
          
          return { success: true, name: contactData.name, id: contactId };
        } catch (error) {
          console.error('❌ Error creando contacto:', contact.name, error);
          return { success: false, name: contact.name, error: error instanceof Error ? error.message : 'Error desconocido' };
        }
      });

      // Esperar a que se procesen todos los contactos
      const results = await Promise.all(importPromises);
      
      // Contar éxitos y errores
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      console.log(`📊 Importación completada: ${successful} éxitos, ${failed} errores`);
      
      if (failed > 0) {
        const failedContacts = results.filter(r => !r.success);
        console.warn('⚠️ Contactos que fallaron:', failedContacts);
        setImportError(`Se importaron ${successful} contactos correctamente, pero ${failed} contactos fallaron.`);
      }
      
      if (successful > 0) {
        // Navegar a página de éxito si al menos algunos contactos se importaron
        navigate('/contacts/success-add-contacts-excel', {
          state: { 
            imported: successful, 
            failed: failed,
            total: contacts.length,
            skippedDuplicates: 0, // Ya no omitimos duplicados
            originalTotal: contacts.length
          }
        });
      } else {
        setImportError('No se pudo importar ningún contacto. Verifica los datos e intenta nuevamente.');
      }
      
    } catch (error) {
      console.error('❌ Error general en importación:', error);
      setImportError(error instanceof Error ? error.message : 'Error desconocido durante la importación');
    } finally {
      setImporting(false);
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
              onClickAction={NavigationService.goBack}
            />
          </div>
        </div>
        <div className="geco-contacts-list-title">
          <GHeadCenterTitle title={ContactsSectionTitle} color={GBlack} />
        </div>
        <div className="geco-contacts-list-container">
          <div className="geco-contacts-list-ul">
            <div className="geco-contacts-list-item">
              {contacts.map((item) => {
                const duplicateData = duplicateInfo.get(item.id);
                return (
                  <GContactImportItem
                    key={item.id}
                    contact={item}
                    icon={GDeletetIcon}
                    iconBackgroundColor={GRed}
                    onClickAction={() => deleteContact(item.id)}
                    isDuplicate={duplicateData?.isDuplicate}
                    existingContact={duplicateData?.existingContact}
                    isCheckingDuplicates={checkingDuplicates}
                  />
                );
              })}
            </div>
          </div>
          
          {/* Mostrar error si existe */}
          {importError && (
            <Alert severity="error" sx={{ m: 2 }}>
              Error en la importación: {importError}
            </Alert>
          )}
          
          {/* Mostrar estado de verificación de duplicados */}
          {checkingDuplicates && (
            <Box sx={{ m: 2 }}>
              <Alert severity="info" icon={<CircularProgress size={20} />}>
                Verificando contactos duplicados...
              </Alert>
            </Box>
          )}

          {/* Mostrar resumen de duplicados */}
          {!checkingDuplicates && duplicateInfo.size > 0 && (
            <Box sx={{ m: 2 }}>
              {(() => {
                const duplicatesCount = Array.from(duplicateInfo.values()).filter(info => info.isDuplicate).length;
                const newContactsCount = contacts.length - duplicatesCount;
                
                if (duplicatesCount > 0) {
                  return (
                    <Alert severity="info">
                      <strong>Resumen de verificación:</strong>
                      <br />
                      • {newContactsCount} contacto{newContactsCount !== 1 ? 's' : ''} nuevo{newContactsCount !== 1 ? 's' : ''}
                      <br />
                      • {duplicatesCount} contacto{duplicatesCount !== 1 ? 's' : ''} posiblemente duplicado{duplicatesCount !== 1 ? 's' : ''}
                      <br />
                      <br />
                      <strong>Nota:</strong> Todos los contactos se importarán, incluyendo los posibles duplicados.
                      <br />
                      <button
                        onClick={() => {
                          const nonDuplicates = contacts.filter(contact => {
                            const duplicateData = duplicateInfo.get(contact.id);
                            return !duplicateData?.isDuplicate;
                          });
                          setContacts(nonDuplicates);
                        }}
                        style={{
                          marginTop: '8px',
                          padding: '4px 8px',
                          backgroundColor: GYellow,
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        🗑️ Eliminar duplicados de la lista (opcional)
                      </button>
                    </Alert>
                  );
                } else {
                  return (
                    <Alert severity="success">
                      ✅ {contacts.length} contacto{contacts.length !== 1 ? 's' : ''} listo{contacts.length !== 1 ? 's' : ''} para importar.
                      No se encontraron duplicados.
                    </Alert>
                  );
                }
              })()}
            </Box>
          )}

          {/* Mostrar información de contactos si no se han verificado duplicados */}
          {!checkingDuplicates && duplicateInfo.size === 0 && contacts.length > 0 && (
            <Box sx={{ m: 2 }}>
              <Alert severity="info">
                {contacts.length} contacto{contacts.length !== 1 ? 's' : ''} listo{contacts.length !== 1 ? 's' : ''} para importar.
                Puedes eliminar contactos individuales antes de importar.
              </Alert>
            </Box>
          )}
          
          <form onSubmit={(e) => { e.preventDefault(); addContacts(); }} style={{ position: 'relative', margin: '16px' }}>
            <GSubmitButton
              label={importing ? "Importando..." : `Importar ${contacts.length} Contacto${contacts.length !== 1 ? 's' : ''}`}
              colorBackground={importing ? '#ccc' : GYellow}
              colorFont={GBlack}
              disabled={importing || contacts.length === 0}
            />
            {importing && (
              <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                <CircularProgress size={24} />
                <span style={{ marginLeft: '8px' }}>Guardando contactos en la base de datos...</span>
              </Box>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
