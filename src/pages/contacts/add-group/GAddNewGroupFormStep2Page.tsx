import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  INewGoupInfo,
  INewGroupForm,
  clearNewGroupForm,
  setNewFormGroupInfo,
  setNewGroupContacts,
} from '../../../redux/sessionSlice';

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
import {
  AddNewGroupStep2SectionTitle,
  NewGroupContactsEmpty,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';
import { IContactResponse } from '../../../interfaces/dtos/external/IContacts';
import { IContact, IGroup } from '../../../interfaces/dtos/external/IFirestore';
import { RootState } from '../../../redux/gecoStore';
import { ROUTES } from '../../../constants/routes';
import { Alert, CircularProgress } from '@mui/material';

export const GAddNewGroupFormStep2Page = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [contactsList, setContactsList] = useState<IContact[]>([]);
  const [error, setError] = useState({ show: false, message: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Obtener datos del usuario y grupo desde Redux
  const { user, formNewGroup } = useSelector((state: RootState) => ({
    user: state.user,
    formNewGroup: state.formNewGroup,
  }));

  useEffect(() => {
    const previousPath = location.state?.from;

    if (
      previousPath === `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_SUCCESS}`
    ) {
      navigate(ROUTES.GROUPS.ROOT);
    }
  }, [location]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // Obtener contactos del usuario desde Firestore
        const contactsData = await ContactsFirestoreService.getUserContacts(
          user.id.toString()
        );
        setContactsList(contactsData);
      } catch (error) {
        console.error('Error cargando contactos:', error);
        setError({
          show: true,
          message: 'Error al cargar contactos',
        });
      }
    };

    if (user.id) {
      fetchContacts();
    }
  }, [user.id]);

  const validationSchema = Yup.object().shape({});

  const onSubmit = async () => {
    if (selectedNumbers.length === 0) {
      setError({
        show: true,
        message: 'Selecciona al menos un contacto',
      });
      return;
    }

    try {
      setSaving(true);
      setSaveError('');
      setError({ show: false, message: '' });

      // Crear objeto de grupo para Firestore
      const groupData: Omit<IGroup, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formNewGroup.groupInfo?.name || 'Nuevo Grupo',
        description: formNewGroup.groupInfo?.description || '',
        contactIds: selectedNumbers.map(String), // Convertir a strings
        userId: user.id.toString(),
        color: '#007bff', // Color por defecto
        tags: [],
      };

      // Guardar grupo en Firestore
      const groupId = await ContactsFirestoreService.createGroup(groupData);

      console.log('✅ Grupo creado con ID:', groupId);

      // Agregar contactos al grupo
      for (const contactId of selectedNumbers) {
        await ContactsFirestoreService.addContactToGroup(contactId, groupId);
      }

      // Limpiar Redux y navegar
      dispatch(clearNewGroupForm());
      reset();
      navigate(`${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_SUCCESS}`);
    } catch (error) {
      console.error('❌ Error creando grupo:', error);
      setSaveError(
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleContactSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const isChecked = e.target.checked;
    setSelectedNumbers((prevSelectedNumbers) => {
      if (isChecked) {
        return [...prevSelectedNumbers, id];
      } else {
        return prevSelectedNumbers.filter((contactId) => contactId !== id);
      }
    });
  };

  const { handleSubmit, reset } = useForm<INewGoupInfo | {}>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-add-group-main">
      <div className="geco-add-group-nav-bar">
        <Link className="geco-add-group-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-add-group-nav-bar-section" to="/contacts/info">
          <div style={{ marginRight: '1vw' }}>
            <GCircularButton
              icon={GContactsIcon}
              size="1.5em"
              width="50px"
              height="50px"
              colorBackground={GWhite}
            />
          </div>
        </Link>
        <GCircularButton
          icon={GIconButtonBack}
          size="1.5em"
          width="50px"
          height="50px"
          colorBackground={GWhite}
          onClickAction={NavigationService.handleNavigationWithState(
            `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_INFO}`,
            { from: `${ROUTES.GROUPS.ROOT}${ROUTES.GROUPS.ADD_GROUP_MEMBERS}` }
          )}
        />
      </div>
      <div className="geco-add-group-header-title">
        <GHeadSectionTitle
          title={AddNewGroupStep2SectionTitle.title}
          subtitle={AddNewGroupStep2SectionTitle.subtitle}
        />
      </div>

      <form className="geco-form " onSubmit={handleSubmit(onSubmit)}>
        {contactsList.length !== 0 ? (
          <div className="geco-input-group">
            {contactsList.map((contact) => (
              <div key={contact.id}>
                <div className="geco-contact-item-card">
                  <div className="geco-contact-body">
                    <h1 className="geco-contact-item-name">{contact.name}</h1>
                    <div className="geco-contact-item-info">
                      <p>{contact.phone}</p>
                      {contact.email && <p>{contact.email}</p>}
                    </div>
                  </div>
                  <input
                    className="geco-checkbox"
                    type="checkbox"
                    id={`contact-${contact.id}`}
                    checked={
                      contact.id ? selectedNumbers.includes(contact.id) : false
                    }
                    onChange={(e) =>
                      contact.id && handleContactSelection(e, contact.id)
                    }
                  />
                </div>
              </div>
            ))}
            {error.show && <span className="span-error">{error.message}</span>}
          </div>
        ) : (
          <Link to={'/contacts/list'}>
            <div className="geco-contacts-empty">
              <p>{NewGroupContactsEmpty}</p>
            </div>
          </Link>
        )}

        {/* Mostrar error si existe */}
        {saveError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error al crear grupo: {saveError}
          </Alert>
        )}

        {/* Botón de submit con indicador de carga */}
        <div style={{ position: 'relative', marginTop: '16px' }}>
          <GSubmitButton
            label={saving ? 'Creando grupo...' : 'Siguiente'}
            colorBackground={saving ? '#ccc' : GYellow}
            colorFont={GBlack}
            icon={GChevronRightBlackIcon}
            disabled={contactsList.length === 0 || saving}
          />
          {saving && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </div>
      </form>
    </div>
  );
};
