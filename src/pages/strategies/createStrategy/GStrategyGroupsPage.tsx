import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  INewGoupInfo,
  INewStrategyForm,
  setNewStrategyGroups,
} from '../../../redux/sessionSlice';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import('../../../styles/gstrategyItem.css');

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import {
  GChevronRightBlackIcon,
  GIconButtonBack,
  GStrategyIcon,
} from '../../../constants/buttons';

import { GSubmitButton } from '../../../components/GSubmitButton';
import {
  CreateStrategyGroupsTitle,
  NewStrategyGroupsEmpty,
} from '../../../constants/wording';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { Link, useNavigate } from 'react-router-dom';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { useEffect, useState } from 'react';
import { ROUTES } from '../../../constants/routes';
import { DateService } from '../../../services/internal/dateService';
import { GroupsService } from '../../../services/external/groupsService';
import { IGroup } from '../../../interfaces/dtos/external/IGroups';
import { GroupsServiceFirestore } from '../../../services/external/groupsServiceFirestore';

const { getGroups } = GroupsService;

export const GStrategyGroupsPage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedFirestoreIds, setSelectedFirestoreIds] = useState<string[]>([]);
  const [groupsList, setGroupsList] = useState<IGroup[]>([]);
  const [error, setError] = useState({ show: false, message: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const strategyForm: INewStrategyForm = useSelector(
    (state: any) => state.formNewStrategy
  );

  // Precargar grupos ya seleccionados
  useEffect(() => {
    if (strategyForm?.groups && strategyForm.groups.length > 0 && groupsList.length > 0) {
      console.log('🔄 Precargando grupos seleccionados:', strategyForm.groups);
      
      // Buscar los grupos correspondientes y agregar sus IDs numéricos y de Firestore
      const selectedGroupsData = groupsList.filter((group) => 
        strategyForm.groups.includes((group as any).firestoreId || String(group.id))
      );
      
      const numericIds = selectedGroupsData.map(group => 
        typeof group.id === 'number' ? group.id : parseInt(String(group.id))
      );
      
      const firestoreIds = selectedGroupsData.map(group => 
        (group as any).firestoreId || String(group.id)
      );
      
      setSelectedNumbers(numericIds);
      setSelectedFirestoreIds(firestoreIds);
      
      console.log('✅ Precargados:', { numericIds, firestoreIds });
    }
  }, [groupsList, strategyForm?.groups]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log('🔍 Cargando grupos desde Firestore...');
        
        // Obtener usuario
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('❌ No hay usuario');
          setGroupsList([]);
          return;
        }
        
        const user = JSON.parse(storedUser);
        const userId = user.id || user.email;
        
        console.log('👤 Buscando grupos para userId:', userId);
        
        // Cargar grupos desde Firestore (usa getGroups que ya filtra por usuario)
        const firestoreGroups = await GroupsServiceFirestore.getGroups();
        console.log(`✅ ${firestoreGroups.length} grupos cargados desde Firestore`);
        console.log('📦 Datos de Firestore:', firestoreGroups);
        
        // Mapear a formato esperado (con ID numérico para UI)
        const mappedGroups = firestoreGroups.map((group: any, index: number) => ({
          id: index + 1,
          firestoreId: group.id,
          name: group.name || 'Sin nombre',
          description: group.description || '',
          contacts: group.contactIds || group.contacts || [],
          created: group.createdAt || group.created || new Date(),
          account_id: parseInt(group.userId || '0')
        }));
        
        console.log('📊 Grupos mapeados:', mappedGroups);
        setGroupsList(mappedGroups);
        
      } catch (error) {
        console.error('❌ Error cargando grupos:', error);
        setGroupsList([]);
      }
    };

    fetchGroups();
  }, []);

  const validationSchema = Yup.object().shape({});

  const onSubmit = async () => {
    if (selectedFirestoreIds.length === 0) {
      setError({
        show: true,
        message:
          'Selecciona al menos un grupo para que reciba las comunicaciones de tu estrategia.',
      });
    } else {
      // Guardar los firestoreIds en lugar de los IDs numéricos
      console.log('💾 Guardando IDs de grupos:', selectedFirestoreIds);
      dispatch(setNewStrategyGroups(selectedFirestoreIds as any));
      navigate(
        `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.PERIOD}`
      );
      reset();
    }
  };

  const handleGroupSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    firestoreId: string
  ) => {
    const isChecked = e.target.checked;
    
    // Actualizar IDs numéricos (para UI)
    setSelectedNumbers((prevSelectedNumbers) => {
      if (isChecked) {
        return [...prevSelectedNumbers, id];
      } else {
        return prevSelectedNumbers.filter((number) => number !== id);
      }
    });
    
    // Actualizar firestoreIds (para guardar en estrategia)
    setSelectedFirestoreIds((prevIds) => {
      if (isChecked) {
        return [...prevIds, firestoreId];
      } else {
        return prevIds.filter((fid) => fid !== firestoreId);
      }
    });
  };

  const { handleSubmit, reset } = useForm<INewGoupInfo | {}>({
    resolver: yupResolver(validationSchema),
  });

  return (
    <div className="geco-strategy-main">
      <div className="geco-strategy-nav-bar">
        <Link className="geco-strategy-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-strategy-nav-bar-section" to="/strategy">
          <GCircularButton
            icon={GStrategyIcon}
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
      <div className="geco-strategy-header-title">
        <GHeadSectionTitle
          title={CreateStrategyGroupsTitle.title}
          subtitle={CreateStrategyGroupsTitle.subtitle}
        />
      </div>

      <form className="geco-form " onSubmit={handleSubmit(onSubmit)}>
        {groupsList.length !== 0 ? (
          <div className="geco-input-group">
            {groupsList.map((group) => (
              <div key={group.id}>
                <div className="geco-strategy-item-card">
                  <div className="geco-strategy-item-body">
                    <h1 className="geco-strategy-item-name">{group.name}</h1>
                    <div className="geco-strategy-item-info">
                      <p>{group.description}</p>
                    </div>
                  </div>
                  <input
                    className="geco-checkbox"
                    type="checkbox"
                    id={`strategy-${group.id}`}
                    checked={selectedNumbers.includes(group.id)}
                    onChange={(e) => handleGroupSelection(e, group.id, (group as any).firestoreId || String(group.id))}
                  />
                </div>
              </div>
            ))}
            {error.show && <span className="span-error">{error.message}</span>}
          </div>
        ) : (
          <div className="geco-strategy-empty">
            <Link to={'/contacts/groups'}>
              <div className="geco-strategys-empty">
                <p>{NewStrategyGroupsEmpty}</p>
              </div>
            </Link>
          </div>
        )}

        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
          icon={GChevronRightBlackIcon}
          disabled={groupsList.length === 0}
        />
      </form>
    </div>
  );
};
