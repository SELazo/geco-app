import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import { PacmanLoader } from 'react-spinners';
import * as XLSX from 'xlsx';

import '../../styles/gresponses.css';
import '../../styles/gform.css';

import { GHeadSectionTitle } from '../../components/GHeadSectionTitle';
import { GCircularButton } from '../../components/GCircularButton';
import { GResponsesIcon, GIconButtonBack } from '../../constants/buttons';
import { GBlack, GWhite, GYellow, GBlue } from '../../constants/palette';
import { GLogoLetter } from '../../components/GLogoLetter';
import { ResponsesViewTitle } from '../../constants/wording';
import { SessionState } from '../../redux/sessionSlice';
import { ROUTES } from '../../constants/routes';

// Interfaces temporales - estas deberían estar en un archivo de interfaces
type ResponseStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface IFormResponse {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  responses: { [key: string]: string };
  submittedAt: string;
  status: ResponseStatus;
}

interface IStrategy {
  id: string;
  name: string;
  description: string;
  formQuestions: string[];
}

export const GResponsesViewPage = () => {
  const navigate = useNavigate();
  const { strategyId } = useParams<{ strategyId: string }>();
  const [strategy, setStrategy] = useState<IStrategy | null>(null);
  const [responses, setResponses] = useState<IFormResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<IFormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<ResponseStatus | 'all'>('all');

  // Obtener usuario desde Redux
  const user = useSelector((state: SessionState) => state.user);

  // Función para filtrar respuestas por estado
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredResponses(responses);
    } else {
      setFilteredResponses(responses.filter(response => response.status === statusFilter));
    }
  }, [responses, statusFilter]);

  // Función para cambiar el estado de una respuesta
  const handleStatusChange = (responseId: string, newStatus: ResponseStatus) => {
    setResponses(prevResponses => 
      prevResponses.map(response => 
        response.id === responseId 
          ? { ...response, status: newStatus }
          : response
      )
    );
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    if (!strategy || filteredResponses.length === 0) return;

    // Preparar datos para Excel
    const excelData = filteredResponses.map(response => {
      const row: any = {
        'ID': response.id,
        'Nombre': response.contactName,
        'Email': response.contactEmail,
        'Teléfono': response.contactPhone,
        'Estado': getStatusLabel(response.status),
        'Fecha de envío': formatDate(response.submittedAt)
      };

      // Agregar respuestas del formulario
      Object.entries(response.responses).forEach(([question, answer]) => {
        row[question] = answer;
      });

      return row;
    });

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    // Generar nombre de archivo
    const fileName = `Respuestas_${strategy.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(wb, fileName);
  };

  // Función para obtener el label del estado
  const getStatusLabel = (status: ResponseStatus): string => {
    const statusLabels = {
      'pending': 'Pendiente',
      'in_progress': 'En Proceso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusLabels[status];
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: ResponseStatus): string => {
    const statusColors = {
      'pending': '#ff9800',
      'in_progress': '#2196f3',
      'completed': '#4caf50',
      'cancelled': '#f44336'
    };
    return statusColors[status];
  };

  useEffect(() => {
    const fetchStrategyResponses = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!strategyId) {
          throw new Error('ID de estrategia no válido');
        }

        // TODO: Implementar servicio para obtener respuestas de la estrategia
        // Por ahora, datos de ejemplo según el tipo de formulario
        const mockStrategies = {
          '1': {
            id: '1',
            name: 'Promoción Día de la Madre - Pedidos Rápidos',
            description: 'Estrategia con formulario de pedido rápido para tortas especiales',
            formQuestions: ['Nombre completo', 'Teléfono', 'Email', 'Mensaje/Pedido']
          },
          '2': {
            id: '2',
            name: 'Consultas Nutricionales - Contacto Simple',
            description: 'Formulario de contacto para consultas sobre servicios nutricionales',
            formQuestions: ['Nombre completo', 'Teléfono', 'Email', 'Mensaje/Consulta']
          },
          '3': {
            id: '3',
            name: 'Reservas de Mesa - Fin de Semana',
            description: 'Sistema de reservas para mesas de restaurante los fines de semana',
            formQuestions: ['Nombre completo', 'Teléfono', 'Servicio solicitado', 'Fecha preferida', 'Hora preferida']
          },
          '4': {
            id: '4',
            name: 'Catálogo de Productos de Temporada',
            description: 'Formulario de catálogo para mostrar productos de temporada otoño-invierno',
            formQuestions: ['Nombre completo', 'Teléfono', 'Email', 'Categoría de interés', 'Cantidad']
          }
        };

        const mockResponsesByStrategy = {
          '1': [ // Pedido rápido
            {
              id: '1',
              contactName: 'María González',
              contactEmail: 'maria@email.com',
              contactPhone: '+54 9 11 1234-5678',
              responses: {
                'Nombre completo': 'María González',
                'Teléfono': '+54 9 11 1234-5678',
                'Email': 'maria@email.com',
                'Mensaje/Pedido': 'Quiero encargar una torta de chocolate con frutillas para 8 personas, para el 15 de mayo. Sin azúcar por favor.'
              },
              submittedAt: '2023-05-10T14:30:00Z',
              status: 'completed' as ResponseStatus
            },
            {
              id: '2',
              contactName: 'Juan Pérez',
              contactEmail: 'juan@email.com',
              contactPhone: '+54 9 11 8765-4321',
              responses: {
                'Nombre completo': 'Juan Pérez',
                'Teléfono': '+54 9 11 8765-4321',
                'Email': 'juan@email.com',
                'Mensaje/Pedido': 'Necesito 12 cupcakes variados para el 14 de mayo, con decoración temática de flores.'
              },
              submittedAt: '2023-05-11T16:45:00Z',
              status: 'in_progress' as ResponseStatus
            }
          ],
          '2': [ // Contacto simple
            {
              id: '3',
              contactName: 'Ana Rodríguez',
              contactEmail: 'ana@email.com',
              contactPhone: '+54 9 11 2345-6789',
              responses: {
                'Nombre completo': 'Ana Rodríguez',
                'Teléfono': '+54 9 11 2345-6789',
                'Email': 'ana@email.com',
                'Mensaje/Consulta': 'Hola, quiero bajar de peso de forma saludable. Tengo diabetes tipo 2 y mi objetivo es perder 10kg en 6 meses. ¿Podrían asesorarme?'
              },
              submittedAt: '2023-06-20T10:15:00Z',
              status: 'pending' as ResponseStatus
            }
          ],
          '3': [ // Reservas / turnos
            {
              id: '4',
              contactName: 'Carlos Martínez',
              contactEmail: 'carlos@email.com',
              contactPhone: '+54 9 11 3456-7890',
              responses: {
                'Nombre completo': 'Carlos Martínez',
                'Teléfono': '+54 9 11 3456-7890',
                'Servicio solicitado': 'Cena para aniversario',
                'Fecha preferida': 'Sábado 22 de julio',
                'Hora preferida': '20:30'
              },
              submittedAt: '2023-07-18T09:20:00Z',
              status: 'completed' as ResponseStatus
            },
            {
              id: '6',
              contactName: 'Sofía López',
              contactEmail: 'sofia@email.com',
              contactPhone: '+54 9 11 5678-9012',
              responses: {
                'Nombre completo': 'Sofía López',
                'Teléfono': '+54 9 11 5678-9012',
                'Servicio solicitado': 'Corte de pelo',
                'Fecha preferida': 'Viernes 28 de julio',
                'Hora preferida': '15:00'
              },
              submittedAt: '2023-07-20T11:30:00Z',
              status: 'pending' as ResponseStatus
            }
          ],
          '4': [ // Catálogo
            {
              id: '5',
              contactName: 'Laura Fernández',
              contactEmail: 'laura@email.com',
              contactPhone: '+54 9 11 4567-8901',
              responses: {
                'Nombre completo': 'Laura Fernández',
                'Teléfono': '+54 9 11 4567-8901',
                'Email': 'laura@email.com',
                'Categoría de interés': 'Buzos',
                'Cantidad': '2'
              },
              submittedAt: '2023-08-15T15:45:00Z',
              status: 'in_progress' as ResponseStatus
            },
            {
              id: '7',
              contactName: 'Diego Morales',
              contactEmail: 'diego@email.com',
              contactPhone: '+54 9 11 6789-0123',
              responses: {
                'Nombre completo': 'Diego Morales',
                'Teléfono': '+54 9 11 6789-0123',
                'Email': 'diego@email.com',
                'Categoría de interés': 'Calzado',
                'Cantidad': '1'
              },
              submittedAt: '2023-08-18T09:15:00Z',
              status: 'cancelled' as ResponseStatus
            }
          ]
        };

        const mockStrategy = mockStrategies[strategyId as keyof typeof mockStrategies] || mockStrategies['1'];
        const mockResponses = mockResponsesByStrategy[strategyId as keyof typeof mockResponsesByStrategy] || [];

        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStrategy(mockStrategy);
        setResponses(mockResponses);
      } catch (error) {
        console.error('❌ Error cargando respuestas:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido al cargar respuestas');
      } finally {
        setLoading(false);
      }
    };

    if (user && strategyId) {
      fetchStrategyResponses();
    } else {
      setLoading(false);
      setError('Usuario no encontrado o ID de estrategia inválido.');
    }
  }, [user, strategyId]);

  const handleGoBack = () => {
    navigate(ROUTES.RESPONSES.LIST);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="geco-responses-title">
          <h4 className="geco-responses-main-title">
            {strategy ? `${ResponsesViewTitle.title}: ${strategy.name}` : ResponsesViewTitle.title}
          </h4>
          <p className="geco-responses-subtitle">
            {ResponsesViewTitle.subtitle}
          </p>
        </div>
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

        {/* Mostrar respuestas */}
        {!loading && !error && strategy && responses.length > 0 && (
          <div className="geco-responses-view-container">
            <div className="geco-responses-summary">
              <h3>📊 Resumen</h3>
              <p><strong>Total de respuestas:</strong> {responses.length}</p>
              <p><strong>Respuestas filtradas:</strong> {filteredResponses.length}</p>
              <p><strong>Estrategia:</strong> {strategy.description}</p>
            </div>

            {/* Controles de filtro y exportación */}
            <div className="geco-responses-controls">
              <div className="geco-responses-filters">
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Filtrar por estado</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filtrar por estado"
                    onChange={(e) => setStatusFilter(e.target.value as ResponseStatus | 'all')}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="in_progress">En Proceso</MenuItem>
                    <MenuItem value="completed">Completada</MenuItem>
                    <MenuItem value="cancelled">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </div>
              
              <button
                onClick={exportToExcel}
                disabled={filteredResponses.length === 0}
                style={{
                  background: filteredResponses.length > 0 ? GBlue : '#ccc',
                  color: GWhite,
                  border: `2px solid ${GBlack}`,
                  borderRadius: '16px',
                  padding: '8px 16px',
                  fontFamily: 'Montserrat',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: filteredResponses.length > 0 ? 'pointer' : 'not-allowed',
                  boxShadow: `0px 2px 0px ${GBlack}`,
                }}
              >
                📊 Exportar a Excel
              </button>
            </div>

            <div className="geco-responses-list">
              {filteredResponses.map((response) => (
                <div key={response.id} className="geco-response-card">
                  <div className="geco-response-header">
                    <div className="geco-response-contact-info">
                      <h4>👤 {response.contactName}</h4>
                      <p>📧 {response.contactEmail}</p>
                      <p>📱 {response.contactPhone}</p>
                    </div>
                    <div className="geco-response-meta">
                      <div className="geco-response-date">
                        <span>📅 {formatDate(response.submittedAt)}</span>
                      </div>
                      <div className="geco-response-status">
                        <Chip
                          label={getStatusLabel(response.status)}
                          size="small"
                          style={{
                            backgroundColor: getStatusColor(response.status),
                            color: 'white',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                          }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel>Cambiar estado</InputLabel>
                          <Select
                            value={response.status}
                            label="Cambiar estado"
                            onChange={(e) => handleStatusChange(response.id, e.target.value as ResponseStatus)}
                          >
                            <MenuItem value="pending">Pendiente</MenuItem>
                            <MenuItem value="in_progress">En Proceso</MenuItem>
                            <MenuItem value="completed">Completada</MenuItem>
                            <MenuItem value="cancelled">Cancelada</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  
                  <div className="geco-response-answers">
                    <h5>Respuestas:</h5>
                    {Object.entries(response.responses).map(([question, answer], index) => (
                      <div key={index} className="geco-response-qa">
                        <div className="geco-response-question">
                          <strong>❓ {question}</strong>
                        </div>
                        <div className="geco-response-answer">
                          💬 {answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mostrar mensaje cuando no hay respuestas filtradas */}
            {filteredResponses.length === 0 && responses.length > 0 && (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                <Alert severity="info">
                  No hay respuestas que coincidan con el filtro seleccionado.
                </Alert>
              </Box>
            )}
          </div>
        )}

        {/* Mostrar mensaje cuando no hay respuestas */}
        {!loading && !error && strategy && responses.length === 0 && (
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px" gap={2}>
            <Alert severity="info">
              Esta estrategia aún no ha recibido respuestas. ¡Comparte tu formulario para comenzar a recibir feedback!
            </Alert>
            <button
              onClick={handleGoBack}
              style={{
                background: GBlue,
                color: GWhite,
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
              Volver a Respuestas
            </button>
          </Box>
        )}
      </div>
    </div>
  );
};
