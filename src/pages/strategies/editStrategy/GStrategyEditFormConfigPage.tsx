import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  Stack,
  TextField,
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
import { IStrategyProps } from '../../../components/GStrategyCard';

const FORM_TYPES = [
  'Pedido rápido',
  'Contacto simple',
  'Reservas / turnos',
  'Catálogo',
] as const;

export const GStrategyEditFormConfigPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const strategyToEdit: IStrategyProps | undefined =
    location && (location.state as any);

  const [enableForm, setEnableForm] = useState<boolean>(
    (strategyToEdit as any)?.enableForm ?? false
  );
  const [formType, setFormType] = useState<
    (typeof FORM_TYPES)[number] | undefined
  >((strategyToEdit as any)?.formType ?? FORM_TYPES[0]);
  // Booking config
  const [allowDaysAhead, setAllowDaysAhead] = useState<number>(
    (strategyToEdit as any)?.formConfig?.allow_days_ahead ?? 7
  );
  const [timeSlotMinutes, setTimeSlotMinutes] = useState<number>(
    (strategyToEdit as any)?.formConfig?.time_slot_minutes ?? 30
  );
  const [requireName, setRequireName] = useState<boolean>(
    (strategyToEdit as any)?.formConfig?.require_name ?? true
  );
  const [requirePhone, setRequirePhone] = useState<boolean>(
    (strategyToEdit as any)?.formConfig?.require_phone ?? true
  );
  const [services, setServices] = useState<string[]>(
    ((strategyToEdit as any)?.formConfig?.services as string[] | undefined) ??
      []
  );
  const [newService, setNewService] = useState<string>('');
  const [allowDaysAheadError, setAllowDaysAheadError] = useState<string>('');
  const [timeSlotMinutesError, setTimeSlotMinutesError] = useState<string>('');
  const [servicesError, setServicesError] = useState<string>('');
  // Catalog config
  const [categories, setCategories] = useState<string>(
    (
      (strategyToEdit as any)?.formConfig?.categories as string[] | undefined
    )?.join(', ') ?? ''
  );
  const [allowQuantity, setAllowQuantity] = useState<boolean>(
    (strategyToEdit as any)?.formConfig?.allow_quantity ?? true
  );
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
    let formConfig: any = undefined;
    // Reset errors
    setAllowDaysAheadError('');
    setTimeSlotMinutesError('');
    setServicesError('');
    setCategoriesError('');
    let hasError = false;
    if (enableForm && formType === 'Reservas / turnos') {
      if (isNaN(allowDaysAhead) || allowDaysAhead < 0 || allowDaysAhead > 365) {
        setAllowDaysAheadError('Entre 0 y 365');
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
      const cats = categories
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
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

    const updated = {
      ...strategyToEdit,
      enableForm,
      formType: enableForm ? formType : undefined,
      formConfig,
    } as IStrategyProps & { enableForm?: boolean; formType?: string };

    navigate(
      `${ROUTES.STRATEGY.ROOT}${ROUTES.STRATEGY.EDIT.ROOT}${ROUTES.STRATEGY.EDIT.RESUME}` as string,
      {
        state: updated,
      }
    );
  };

  if (!strategyToEdit) {
    navigate(`${ROUTES.STRATEGY.ROOT}`);
    return null;
  }

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

      <form
        className="geco-form"
        onSubmit={handleSubmit}
        style={{ maxWidth: 'unset', width: '100%', alignItems: 'stretch' }}
      >
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
          label={<span style={{ fontFamily: 'Montserrat' }}>Sí</span>}
          labelPlacement="start"
        />

        <h3
          className="geco-strategy-subtitle"
          style={{ opacity: enableForm ? 1 : 0.5 }}
        >
          ¿Qué tipo de formulario querés agregar?
        </h3>
        <RadioGroup
          value={formType}
          onChange={(e) => setFormType(e.target.value as any)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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

        {enableForm && formType === 'Reservas / turnos' ? (
          <Stack spacing={2} sx={{ mt: 2 }} style={{ width: 325 }}>
            <TextField
              fullWidth
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
              fullWidth
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
            <Autocomplete
              fullWidth
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
            <Autocomplete
              fullWidth
              multiple
              freeSolo
              options={[]}
              value={categories
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s)}
              onChange={(event, newValue) =>
                setCategories(() => {
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
                  return result.join(', ');
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
