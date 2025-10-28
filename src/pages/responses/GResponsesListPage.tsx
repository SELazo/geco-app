import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box } from '@mui/material';
import { PacmanLoader } from 'react-spinners';

import '../../styles/gresponses.css';
import '../../styles/gform.css';

import { GHeadSectionTitle } from '../../components/GHeadSectionTitle';
import { GCircularButton } from '../../components/GCircularButton';
import { GResponsesIcon, GIconButtonBack } from '../../constants/buttons';
import { GBlack, GWhite, GYellow } from '../../constants/palette';
import { GLogoLetter } from '../../components/GLogoLetter';
import { ResponsesListTitle } from '../../constants/wording';
import { RootState } from '../../redux/gecoStore';
import { ROUTES } from '../../constants/routes';

// Interfaces temporales - estas deberían estar en un archivo de interfaces
interface IStrategy {
  id: string;
  name: string;
  description: string;
  hasForm: boolean;
  responseCount: number;
  createdAt: string;
}

export const GResponsesListPage = () => {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<IStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Obtener usuario desde Redux
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchStrategiesWithForms = async () => {
      try {
        setLoading(true);
        setError('');
        
        // TODO: Implementar servicio para obtener estrategias con formularios
        // Por ahora, datos de ejemplo
        const mockStrategies: IStrategy[] = [
          {
            id: '1',
            name: 'Promoción Día de la Madre - Pedidos Rápidos',
            description: 'Estrategia con formulario de pedido rápido para tortas especiales',
            hasForm: true,
            responseCount: 2,
            createdAt: '2023-05-01'
          },
          {
            id: '2',
            name: 'Consultas Nutricionales - Contacto Simple',
            description: 'Formulario de contacto para consultas sobre servicios nutricionales',
            hasForm: true,
            responseCount: 1,
            createdAt: '2023-06-15'
          },
          {
            id: '3',
            name: 'Reservas de Mesa - Fin de Semana',
            description: 'Sistema de reservas para mesas de restaurante los fines de semana',
            hasForm: true,
            responseCount: 2,
            createdAt: '2023-07-20'
          },
          {
            id: '4',
            name: 'Catálogo de Productos de Temporada',
            description: 'Formulario de catálogo para mostrar productos de temporada otoño-invierno',
            hasForm: true,
            responseCount: 2,
            createdAt: '2023-08-10'
          }
        ];

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStrategies(mockStrategies);
      } catch (error) {
        console.error('❌ Error cargando estrategias:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido al cargar estrategias');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStrategiesWithForms();
    } else {
      setLoading(false);
      setError('Usuario no encontrado. Verifica que hayas iniciado sesión.');
    }
  }, [user]);

  const handleViewResponses = (strategyId: string) => {
    navigate(`${ROUTES.RESPONSES.VIEW}/${strategyId}`);
  };

  const handleGoBack = () => {
    navigate('/home');
  };

  return (
    <div className="geco-responses-main">
      <div className="geco-responses-nav-bar">
        <Link className="geco-responses-nav-bar-logo" to="/home">
          <GLogoLetter />
        </Link>
        <Link className="geco-responses-nav-bar-section" to="/responses">
          <GCircularButton
            icon={GResponsesIcon}
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
          onClickAction={handleGoBack}
        />
      </div>

      <div className="geco-responses-header">
        <GHeadSectionTitle
          title={ResponsesListTitle.title}
          subtitle={ResponsesListTitle.subtitle}
        />
      </div>

      <div className="geco-responses-content">
        {/* Mostrar indicador de carga */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <PacmanLoader color={GYellow} />
          </Box>
        )}

        {/* Mostrar error */}
        {!loading && error && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <Alert severity="error" sx={{ maxWidth: '400px' }}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Mostrar estrategias */}
        {!loading && !error && strategies.length > 0 && (
          <div className="geco-responses-list-container">
            <div className="geco-responses-list">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="geco-response-strategy-card">
                  <div className="geco-response-strategy-info">
                    <h3 className="geco-response-strategy-name">{strategy.name}</h3>
                    <p className="geco-response-strategy-description">{strategy.description}</p>
                    <div className="geco-response-strategy-stats">
                      <span className="geco-response-count">
                        📊 {strategy.responseCount} respuestas
                      </span>
                      <span className="geco-response-date">
                        📅 {new Date(strategy.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <div className="geco-response-strategy-actions">
                    <button
                      className="geco-response-view-btn"
                      onClick={() => handleViewResponses(strategy.id)}
                      style={{
                        background: GYellow,
                        color: GBlack,
                        border: `2px solid ${GBlack}`,
                        borderRadius: '16px',
                        padding: '12px 24px',
                        fontFamily: 'Montserrat',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer',
                        boxShadow: `0px 2px 0px ${GBlack}`,
                      }}
                    >
                      Ver Respuestas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mostrar mensaje cuando no hay estrategias */}
        {!loading && !error && strategies.length === 0 && (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px" gap={2}>
            <Alert severity="info">
              No tienes estrategias con formularios aún. ¡Crea una estrategia con formulario para comenzar a recibir respuestas!
            </Alert>
            <Link to="/strategy/create/information">
              <button
                style={{
                  background: GYellow,
                  color: GBlack,
                  border: `2px solid ${GBlack}`,
                  borderRadius: '16px',
                  padding: '12px 24px',
                  fontFamily: 'Montserrat',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: `0px 2px 0px ${GBlack}`,
                  textDecoration: 'none',
                }}
              >
                Crear Estrategia
              </button>
            </Link>
          </Box>
        )}
      </div>
    </div>
  );
};
