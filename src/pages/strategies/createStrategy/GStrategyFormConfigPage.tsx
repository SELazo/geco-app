import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Stack,
  Autocomplete,
  Chip,
} from '@mui/material';

import '../../../styles/ginputBox.css';
import '../../../styles/gform.css';
import '../../../styles/gcreatead.css';

import { GHeadSectionTitle } from '../../../components/GHeadSectionTitle';
import { GCircularButton } from '../../../components/GCircularButton';
import { GIconButtonBack, GStrategyIcon } from '../../../constants/buttons';
import { GSubmitButton } from '../../../components/GSubmitButton';
import { GBlack, GWhite, GYellow } from '../../../constants/palette';
import { GLogoLetter } from '../../../components/GLogoLetter';
import { ROUTES } from '../../../constants/routes';
import { NavigationService } from '../../../services/internal/navigationService';
import {
  setNewStrategyForm,
  setNewStrategyFormConfig,
} from '../../../redux/sessionSlice';

const FORM_TYPES = [
  'Pedido rápido',
  'Contacto simple',
  'Reservas / turnos',
  'Catálogo',
] as const;

const DEFAULT_SERVICE_OPTIONS = [
  'Consulta',
  'Corte de pelo',
  'Coloración',
  'Turno médico',
  'Asesoramiento',
  'Mantenimiento',
];

const DEFAULT_CATEGORY_OPTIONS = [
  'Remeras',
  'Buzos',
  'Accesorios',
  'Calzado',
  'Pantalones',
  'Ofertas',
];

export const GStrategyFormConfigPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [enableForm, setEnableForm] = useState(false);
  const [formType, setFormType] = useState<
    (typeof FORM_TYPES)[number] | undefined
  >(FORM_TYPES[0]);
  // Booking config
  const [allowDaysAhead, setAllowDaysAhead] = useState<number>(7);
  const [timeSlotMinutes, setTimeSlotMinutes] = useState<number>(30);
  const [requireName, setRequireName] = useState<boolean>(true);
  const [requirePhone, setRequirePhone] = useState<boolean>(true);
  const [services, setServices] = useState<string[]>([]);
  const [allowDaysAheadError, setAllowDaysAheadError] = useState<string>('');
  const [timeSlotMinutesError, setTimeSlotMinutesError] = useState<string>('');
  const [servicesError, setServicesError] = useState<string>('');
  // Catalog config
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [allowQuantity, setAllowQuantity] = useState<boolean>(true);
  const [categoriesError, setCategoriesError] = useState<string>('');

  const normalizeLabel = (input: string): string => {
    const collapsed = input.trim().replace(/\s+/g, ' ');
    if (!collapsed) return '';
    return collapsed
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  };

  const normalizeList = (arr: string[]): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    arr
      .map((v) => normalizeLabel(v))
      .filter((v) => v)
      .forEach((item) => {
        const key = item.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push(item);
        }
      });
    return result;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setNewStrategyForm({
        enableForm,
        formType: enableForm ? formType : undefined,
      })
    );
    // Build formConfig only for booking/catalog
    let formConfig: any = undefined;
    // Reset errors
    setAllowDaysAheadError('');
    setTimeSlotMinutesError('');
    setServicesError('');
    setCategoriesError('');
    let hasError = false;
    if (enableForm && formType === 'Reservas / turnos') {
      if (isNaN(allowDaysAhead) || allowDaysAhead < 0 || allowDaysAhead > 365) {
        setAllowDaysAheadError('Debe ser 0 o mayor');
        hasError = true;
      }
      if (
        isNaN(timeSlotMinutes) ||
        timeSlotMinutes < 5 ||
        timeSlotMinutes > 480 ||
        timeSlotMinutes % 5 !== 0
      ) {
        setTimeSlotMinutesError('Debe ser múltiplo de 5, entre 5 y 480');
        hasError = true;
      }
      if (services.length === 0) {
        setServicesError('Agregá al menos un servicio');
        hasError = true;
      }
      const normalizedServices = normalizeList(services);
      formConfig = {
        allow_days_ahead: allowDaysAhead,
        time_slot_minutes: timeSlotMinutes,
        require_name: requireName,
        require_phone: requirePhone,
        services: normalizedServices,
      };
    } else if (enableForm && formType === 'Catálogo') {
      const cats = categoriesList;
      const normalizedCats = normalizeList(cats);
      if (normalizedCats.length === 0) {
        setCategoriesError('Ingresá al menos una categoría');
        hasError = true;
      }
      formConfig = {
        categories: normalizedCats,
        allow_quantity: allowQuantity,
      };
    }
    if (hasError) return;
    dispatch(setNewStrategyFormConfig(formConfig));
    navigate(
      `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.CREATE.ROOT}${ROUTES.STRATEGY.CREATE.RESUME}`
    );
  };

  return (
    <div className="geco-create-ad-main">
      <div className="geco-create-ad-head-nav-bar">
        <div className="geco-create-ad-nav-bar">
          <Link className="geco-create-ad-nav-bar-logo" to="/home">
            <GLogoLetter />
          </Link>
          <Link
            className="geco-add-contact-excel-nav-bar-section"
            to="/strategy"
          >
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
      <div className="geco-create-ad-header-title">
        <GHeadSectionTitle
          title="Configuración de formulario"
          subtitle="Querés que agregar un formulario? 📝"
        />
      </div>

      <form className="geco-form" onSubmit={handleSubmit}>
        <h3 className="geco-strategy-subtitle">
          ¿Querés agregar un formulario?
        </h3>
        <FormControlLabel
          value="start"
          control={
            <Switch
              checked={enableForm}
              color="primary"
              onChange={() => setEnableForm((v) => !v)}
            />
          }
          label={<span style={{ fontFamily: 'Montserrat' }}>{enableForm ? 'Sí' : 'No'}</span>}
          labelPlacement="start"
        />

        <h3
          className="geco-strategy-subtitle"
          style={{ opacity: enableForm ? 1 : 0.5 }}
        >
          ¿Qué tipo de formulario querés agregar?
        </h3>
        <div className="geco-strategy-options-group">
          <RadioGroup
            row
            value={formType}
            onChange={(e) => setFormType(e.target.value as any)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {FORM_TYPES.map((opt) => (
              <FormControlLabel
                key={opt}
                value={opt}
                control={<Radio disabled={!enableForm} />}
                label={<span style={{ fontFamily: 'Montserrat' }}>{opt}</span>}
              />
            ))}
          </RadioGroup>
        </div>

        {enableForm && formType === 'Reservas / turnos' ? (
          <Stack
            spacing={2}
            sx={{
              mt: 2,
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <TextField
              type="number"
              label="Días permitidos hacia adelante"
              value={allowDaysAhead}
              onChange={(e) =>
                setAllowDaysAhead(parseInt(e.target.value || '0', 10))
              }
              inputProps={{ min: 0, max: 365 }}
              error={!!allowDaysAheadError}
              helperText={allowDaysAheadError}
            />
            <TextField
              type="number"
              label="Duración de turno (minutos)"
              value={timeSlotMinutes}
              onChange={(e) =>
                setTimeSlotMinutes(parseInt(e.target.value || '0', 10))
              }
              inputProps={{ min: 5, max: 480, step: 5 }}
              error={!!timeSlotMinutesError}
              helperText={timeSlotMinutesError}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={requireName}
                    onChange={() => setRequireName((v) => !v)}
                  />
                }
                label={
                  <span style={{ fontFamily: 'Montserrat' }}>
                    Requerir nombre
                  </span>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={requirePhone}
                    onChange={() => setRequirePhone((v) => !v)}
                  />
                }
                label={
                  <span style={{ fontFamily: 'Montserrat' }}>
                    Requerir teléfono
                  </span>
                }
              />
            </div>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={services}
              onChange={(event, newValue) =>
                setServices(() => {
                  const normalized = newValue
                    .map((v) =>
                      typeof v === 'string' ? normalizeLabel(v) : ''
                    )
                    .filter((v) => v);
                  const seen = new Set<string>();
                  const result: string[] = [];
                  normalized.forEach((item) => {
                    const key = item.toLowerCase();
                    if (!seen.has(key)) {
                      seen.add(key);
                      result.push(item);
                    }
                  });
                  return result;
                })
              }
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Servicios"
                  placeholder="Escribí y presioná Enter para agregar"
                  error={!!servicesError}
                  helperText={servicesError}
                />
              )}
            />
          </Stack>
        ) : null}

        {enableForm && formType === 'Catálogo' ? (
          <Stack spacing={2} sx={{ mt: 2, width: '100%' }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={categoriesList}
              onChange={(event, newValue) =>
                setCategoriesList(() => {
                  const normalized = newValue
                    .map((v) =>
                      typeof v === 'string' ? normalizeLabel(v) : ''
                    )
                    .filter((v) => v);
                  const seen = new Set<string>();
                  const result: string[] = [];
                  normalized.forEach((item) => {
                    const key = item.toLowerCase();
                    if (!seen.has(key)) {
                      seen.add(key);
                      result.push(item);
                    }
                  });
                  return result;
                })
              }
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Categorías"
                  placeholder="Escribí y presioná Enter para agregar"
                  error={!!categoriesError}
                  helperText={categoriesError}
                />
              )}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={allowQuantity}
                    onChange={() => setAllowQuantity((v) => !v)}
                  />
                }
                label={
                  <span style={{ fontFamily: 'Montserrat' }}>
                    Permitir cantidad
                  </span>
                }
              />
            </div>
          </Stack>
        ) : null}

        <GSubmitButton
          label="Siguiente"
          colorBackground={GYellow}
          colorFont={GBlack}
        />
      </form>
    </div>
  );
};
