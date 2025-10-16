import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gaddgroup.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GContactsIcon,
  GIconButtonBack,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  NewGroupDescriptionPlaceholder,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { GroupsServiceFirestore } from '../../../services/external/groupsServiceFirestore';
import { ContactsFirestoreService } from '../../../services/external/contactsFirestoreService';

const { getGroup } = GroupsServiceFirestore;

interface IEditGroupForm {
  name: string;
  description: string;
}

export const GEditGroupFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalGroup, setOriginalGroup] = useState<any>(null);

  if (!id) {
    navigate('/contacts/groups');
    return null;
  }

  const numericId = parseInt(id);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string()
      .required('La descripción es requerida')
      .max(45, 'La descripción no puede tener más de 45 caracteres'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IEditGroupForm>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        setError(null);
        const groupData = await getGroup(numericId);
        
        if (groupData && groupData.group) {
          setOriginalGroup(groupData.group);
          setValue('name', groupData.group.name);
          setValue('description', groupData.group.description || '');
        }
      } catch (error) {
        console.error('Error fetching group:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar el grupo';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [numericId, setValue]);

  const onSubmit = async (data: IEditGroupForm) => {
    try {
      if (!originalGroup) {
        throw new Error('No se pudo cargar la información del grupo');
      }

      // Obtener el usuario actual
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('Usuario no autenticado');
      }
      
      const user = JSON.parse(userStr);
      const userIdStr = user.id.toString();
      
      // Encontrar el ID real de Firestore
      const allGroups = await ContactsFirestoreService.getUserGroups(userIdStr);
      let targetFirestoreId: string | null = null;
      
      for (const group of allGroups) {
        const firestoreId = group.id || '0';
        const numericIdCalc = firestoreId === '0' ? 0 : Math.abs(firestoreId.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0));
        
        if (numericIdCalc === numericId) {
          targetFirestoreId = firestoreId;
          break;
        }
      }

      if (!targetFirestoreId) {
        throw new Error('No se pudo encontrar el grupo a editar');
      }

      // Actualizar el grupo en Firestore
      await ContactsFirestoreService.updateGroup(targetFirestoreId, {
        name: data.name,
        description: data.description,
      });

      // Navegar de vuelta a la lista de grupos
      navigate('/contacts/groups', { 
        state: { message: 'Grupo actualizado exitosamente' }
      });

    } catch (error) {
      console.error('Error updating group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el grupo';
      setError(errorMessage);
    }
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
            title="Editar Grupo"
            subtitle="Cargando información del grupo..."
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
          title="Editar Grupo"
          subtitle="Modifica la información del grupo"
        />
      </div>
      <form className="geco-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <input
            type="text"
            {...register('name')}
            placeholder="Nombre del grupo"
            className={`input-box form-control ${
              errors.name ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.name?.message}</span>
        </div>
        <div className="input-group">
          <textarea
            {...register('description')}
            placeholder={NewGroupDescriptionPlaceholder}
            className={`input-box form-control ${
              errors.description ? 'is-invalid' : ''
            }`}
          />
          <span className="span-error">{errors.description?.message}</span>
        </div>
        {error && (
          <div className="span-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        <GSubmitButton
          label={isSubmitting ? "Guardando..." : "Guardar Cambios"}
          colorBackground={GYellow}
          colorFont={GBlack}
          disabled={isSubmitting}
          icon={GChevronRightBlackIcon}
        />
      </form>
    </div>
  );
};
