import('../../../styles/gcontactsList.css');

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, CircularProgress, Box } from '@mui/material';

import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack, GStrategyIcon } from '../../../constants/buttons';
import { GBlack, GRed, GWhite, GYellow } from '../../../constants/palette';
import { NavigationService } from '../../../services/internal/navigationService';
import { GHeadCenterTitle } from '../../../components/GHeadCenterTitle';
import { StrategyHeadCenterTitle } from '../../../constants/wording';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { Link } from 'react-router-dom';
import { ApiResponse } from '../../../interfaces/dtos/external/IResponse';
import { ROUTES } from '../../../constants/routes';
import { IStrategyResponse } from '../../../interfaces/dtos/external/IStrategies';
import { StrategiesFirestoreService } from '../../../services/external/strategiesFirestoreService';
import { IStrategy } from '../../../interfaces/dtos/external/IFirestore';
import { RootState } from '../../../redux/gecoStore';
import { GStrategyCard } from '../../../components/GStrategyCard';

export const GStrategiesListPage = () => {
  const [strategies, setStrategies] = useState<IStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Obtener usuario desde Redux
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Obtener usuario de Redux o localStorage (igual que publicidades)
        let currentUser = user;
        
        if (!currentUser || (!currentUser.id && !currentUser.email)) {
          console.log('⏳ Usuario no disponible en Redux, cargando desde localStorage...');
          const storedUser = localStorage.getItem('user');
          
          if (!storedUser) {
            console.error('❌ No hay usuario en localStorage');
            setError('No hay sesión activa');
            setLoading(false);
            return;
          }
          
          currentUser = JSON.parse(storedUser);
          console.log('✅ Usuario cargado desde localStorage:', currentUser);
        }
        
        const userId = currentUser.id || currentUser.email;
        if (!userId) {
          console.error('❌ Usuario inválido');
          setError('Usuario inválido');
          setLoading(false);
          return;
        }
        
        console.log('🔍 Cargando estrategias para usuario:', userId);
        
        // Obtener estrategias del usuario desde Firestore
        const userStrategies = await StrategiesFirestoreService.getUserStrategies(String(userId));
        console.log(`✅ ${userStrategies.length} estrategias cargadas`);
        console.log('📊 Estrategias:', userStrategies);
        
        // Eliminar duplicados por ID (por si acaso)
        const uniqueStrategies = Array.from(
          new Map(userStrategies.map(s => [s.id, s])).values()
        );
        
        if (uniqueStrategies.length !== userStrategies.length) {
          console.warn(`⚠️ Se encontraron duplicados: ${userStrategies.length} → ${uniqueStrategies.length}`);
        }
        
        setStrategies(uniqueStrategies);
        
      } catch (error) {
        console.error('❌ Error cargando estrategias:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []); // ✅ Sin dependencias - solo se ejecuta una vez

  return (
    <>
      <div className="geco-contacts-list">
        <div className="geco-contacts-list-head">
          <div className="geco-contacts-list-head-nav-bar">
            <Link className="geco-contacts-head-nav-bar-logo" to="/home">
              <GLogoLetter />
            </Link>
            <Link className="geco-contacts-list-nav-bar-section" to="/strategy">
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
        </div>
        <div className="geco-contacts-list-title">
          <GHeadCenterTitle title={StrategyHeadCenterTitle} color={GBlack} />
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
            Error al cargar estrategias: {error}
          </Alert>
        )}

        {/* Mostrar estrategias */}
        {!loading && !error && strategies.length > 0 && (
          <div className="geco-contacts-list-container">
            <div className="geco-contacts-list-ul">
              <div className="geco-contacts-list-item">
                {strategies.map((item) => (
                  <div key={`strategyCard${item.id}`}>
                    <GStrategyCard
                      id={item.id ? parseInt(item.id.slice(-6), 16) : Math.random()} // Convertir string a number
                      firestoreId={item.id} // ✅ Pasar ID de Firestore para operaciones
                      name={item.title} // Usar title en lugar de name
                      start_date={item.startDate instanceof Date ? item.startDate.toISOString().split('T')[0] : item.startDate as any}
                      end_date={item.endDate instanceof Date ? item.endDate.toISOString().split('T')[0] : item.endDate as any}
                      periodicity={item.periodicity}
                      schedule={item.schedule}
                      ads={item.ads} // ✅ Pasar IDs de Firestore como strings
                      groups={item.groups} // ✅ Pasar IDs como strings
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mostrar mensaje cuando no hay estrategias */}
        {!loading && !error && strategies.length === 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Alert severity="info">
              No tienes estrategias creadas aún. ¡Crea tu primera estrategia!
            </Alert>
          </Box>
        )}
      </div>
    </>
  );
};
