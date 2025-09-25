import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import {
  AppBar,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import '../../styles/gstrategy.css';
import '../../styles/gpublic-strategy.css';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { AdsService } from '../../services/external/adsService';
import { GLogoWord } from '../../components/GLogoWord';
import { GBlack } from '../../constants/palette';

// Expected shape for location.state
// {
//   title: string;
//   subtitle?: string;
//   ads: Array<{ id: number; title?: string } | number>;
//   formType?: 'Pedido rápido' | 'Contacto simple' | 'Reservas / turnos' | 'Catálogo';
//   formConfig?: any;
// }

// Phone input mask: keep digits, spaces and common phone symbols; collapse spaces; limit length
function handlePhoneInput(e: React.FormEvent<HTMLInputElement>) {
  const input = e.currentTarget;
  let raw = input.value || '';
  // find country code in same form group
  const group = input.closest('.public-form-group');
  const ccSelect = group?.querySelector(
    'select[name="country_code"]'
  ) as HTMLSelectElement | null;
  const cc = ccSelect?.value || '';
  let digits = raw.replace(/[^0-9]/g, '');

  // Argentina local formatting if cc is +54
  if (cc === '+54') {
    let rest = digits;
    // Optional mobile indicator 9
    let prefix = '';
    if (rest.startsWith('9')) {
      prefix = '9 ';
      rest = rest.slice(1);
    }
    // Format as: [9 ]AA BBBB-CCCC when possible
    let formatted = prefix;
    if (rest.length >= 10) {
      const aa = rest.slice(0, 2);
      const bbbb = rest.slice(2, 6);
      const cccc = rest.slice(6, 10);
      formatted += `${aa} ${bbbb}-${cccc}`;
    } else if (rest.length >= 6) {
      const aa = rest.slice(0, 2);
      const mid = rest.slice(2, rest.length - 4);
      const tail = rest.slice(-4);
      formatted += `${aa} ${mid}-${tail}`;
    } else if (rest.length >= 3) {
      formatted += `${rest.slice(0, 2)} ${rest.slice(2)}`;
    } else {
      formatted += rest;
    }
    input.value = formatted.slice(0, 20);
    return;
  }

  // Generic fallback: allow digits, spaces and common symbols, collapse spaces, limit length
  let v = raw.replace(/[^0-9\s\-().]/g, '');
  v = v.replace(/\s{2,}/g, ' ');
  if (v.length > 20) v = v.slice(0, 20);
  if (input.value !== v) input.value = v;
}

export const GPublicStrategyPage: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const stateStrategy = (location && (location.state as any)) || {};

  const [loading, setLoading] = useState<boolean>(false);
  const [serverStrategy, setServerStrategy] = useState<any | null>(null);
  const [images, setImages] = useState<Record<number, string>>({});
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMsg, setSnackMsg] = useState<string>('Enviado (mock)');
  const storedCC = React.useMemo(() => {
    try {
      return localStorage.getItem('public_form_cc') || '+54';
    } catch {
      return '+54';
    }
  }, []);

  // Fetch by :id when present
  useEffect(() => {
    let alive = true;
    const fetchStrategy = async () => {
      try {
        const id = params.id ? parseInt(params.id, 10) : NaN;
        if (!isNaN(id)) {
          const data = mockPublicStrategy(id);
          if (alive) setServerStrategy(data);
        }
      } catch (e) {
        // ignore; fallback to state
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchStrategy();

    return () => {
      alive = false;
    };
  }, [params.id]);

  const title: string =
    serverStrategy?.name || stateStrategy?.title || 'Estrategia';
  const subtitle: string = stateStrategy?.subtitle || '';
  const adsInput: Array<{ id: number; title?: string } | number> =
    serverStrategy?.ads || stateStrategy?.ads || [];
  const formType: string | undefined =
    serverStrategy?.form_type || stateStrategy?.formType;
  const formConfig: any =
    serverStrategy?.form_config || stateStrategy?.formConfig;

  // Build Yup schema based on current form type/config
  const schema = React.useMemo(() => {
    const phoneRegex = /^[0-9\s\-().]{6,20}$/;
    let shape: Record<string, any> = {
      name: Yup.string().required('Ingresá tu nombre'),
      country_code: Yup.string().required('Elegí un país'),
      phone: Yup.string()
        .required('Ingresá tu teléfono')
        .matches(phoneRegex, 'Formato de teléfono inválido'),
    };
    if (formType === 'Reservas / turnos') {
      shape = {
        ...shape,
        service: Yup.string().required('Elegí un servicio'),
        date: Yup.string().required('Elegí una fecha'),
        time: Yup.string().required('Elegí un horario'),
        comments: Yup.string()
          .required('Escribí tu mensaje')
          .min(3, 'Mínimo 3 caracteres'),
      };
    } else if (formType === 'Catálogo') {
      shape = {
        ...shape,
        category: Yup.string().required('Elegí una categoría'),
        comments: Yup.string()
          .required('Escribí tu mensaje')
          .min(3, 'Mínimo 3 caracteres'),
      };
      if (formConfig?.allow_quantity) {
        shape.quantity = Yup.number()
          .typeError('Ingresá una cantidad válida')
          .integer('Debe ser un entero')
          .min(1, 'Mínimo 1')
          .required('Ingresá una cantidad válida');
      }
    } else {
      shape = {
        ...shape,
        message: Yup.string()
          .required('Escribí tu mensaje')
          .min(3, 'Mínimo 3 caracteres'),
      };
    }
    return Yup.object().shape(shape);
  }, [formType, formConfig]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: { country_code: storedCC },
  });

  const ads = useMemo(() => {
    return adsInput
      .map((a: any) => (typeof a === 'number' ? { id: a } : a))
      .filter((a: any) => a && typeof a.id === 'number');
  }, [adsInput]);

  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      const result: Record<number, string> = {};
      for (const a of ads) {
        try {
          const url = await AdsService.getAdImg(a.id);
          if (mounted) result[a.id] = url as string;
        } catch (e) {
          // ignore
        }
      }
      // Fill placeholders for missing images
      for (const a of ads) {
        if (!result[a.id]) {
          result[a.id] = placeholderImg(a.id);
        }
      }
      if (mounted) setImages(result);
    };
    loadImages();
    return () => {
      mounted = false;
    };
  }, [ads]);

  const Header = (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ bgcolor: 'transparent' }}
    >
      <Toolbar
        sx={{ justifyContent: 'flex-start', minHeight: '64px !important' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', textDecoration: 'none' }}
          >
            <GLogoWord />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#D9D9D9', color: GBlack }}>
      {Header}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {/* Hero title/subtitle */}
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800,
              lineHeight: 1.1,
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                opacity: 0.85,
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Stack>

        {/* Two columns */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, height: { xs: 360, md: 800 } }}
            >
              <Box sx={{ height: '100%', overflowY: 'auto' }}>
                {ads.length === 0 ? (
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#9FA4B4',
                      my: 4,
                    }}
                  >
                    No hay publicidades
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {ads.map((a) => (
                      <Box
                        key={`ad-${a.id}`}
                        sx={{
                          border: '1px dashed #cfd3dc',
                          borderRadius: 2,
                          bgcolor: '#f9fafc',
                          p: 1,
                        }}
                      >
                        {images[a.id] ? (
                          <Box
                            component="img"
                            src={images[a.id]}
                            alt={`ad-${a.id}`}
                            sx={{ width: '100%', borderRadius: 1 }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: '100%',
                              height: 180,
                              borderRadius: 1,
                              background:
                                'repeating-linear-gradient(-45deg,#e5e7eb,#e5e7eb 10px,#f3f4f6 10px,#f3f4f6 20px)',
                            }}
                          />
                        )}
                        {a.title ? (
                          <Typography
                            sx={{
                              mt: 0.5,
                              fontFamily: 'Montserrat',
                              fontWeight: 600,
                              color: '#18191f',
                            }}
                          >
                            {a.title}
                          </Typography>
                        ) : null}
                        {a.description ? (
                          <Typography
                            sx={{
                              mt: 0.5,
                              fontFamily: 'Montserrat',
                              fontWeight: 600,
                              color: '#18191f',
                            }}
                          >
                            {a.description}
                          </Typography>
                        ) : null}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 3,
                height: {
                  xs: 'auto',
                  md: 800,
                  background: 'space',
                  alignContent: 'center',
                },
                overflow: 'auto',
              }}
            >
              <form
                className={isSubmitted ? 'was-submitted' : ''}
                onSubmit={handleSubmit((data) => {
                  try {
                    localStorage.setItem('public_form_cc', data.country_code);
                  } catch {}
                  setSnackMsg(
                    `Enviado (mock): ${data.country_code} ${data.phone}`
                  );
                  setSnackOpen(true);
                  reset({ country_code: data.country_code });
                })}
              >
                {renderStaticForm(formType, formConfig, storedCC, {
                  register,
                  errors,
                  isSubmitted,
                })}
                <div style={{ marginTop: 8 }}>
                  <Button
                    type="submit"
                    style={{
                      width: 160,
                      height: 40,
                      background: '#1947E5',
                      border: '2px solid #18191F',
                      borderRadius: 12,

                      fontFamily: 'Montserrat, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: 16,
                      textAlign: 'center',
                      color: '#FFFFFF',
                    }}
                    variant="contained"
                  >
                    Enviar
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          opacity: 0.7,
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          © {new Date().getFullYear()} GECo. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};

function mockPublicStrategy(id: number) {
  // Mock minimal strategy data
  const mockAds = [101, 102, 103, 104];
  // Example mocks for form types; rotate by id
  const types = [
    'Pedido rápido',
    'Contacto simple',
    'Reservas / turnos',
    'Catálogo',
  ] as const;
  const form_type = types[id % types.length];
  const form_config: any =
    form_type === 'Reservas / turnos'
      ? { services: ['Consulta', 'Corte', 'Color'], time_slot_minutes: 30 }
      : form_type === 'Catálogo'
      ? { categories: ['Remeras', 'Buzos', 'Accesorios'], allow_quantity: true }
      : undefined;
  return {
    id,
    name: `Estrategia #${id}`,
    ads: mockAds,
    form_type,
    form_config,
  };
}

function placeholderImg(id: number): string {
  const bg = 'f3f4f6';
  const fg = '9fa4b4';
  const text = encodeURIComponent(`Ad ${id}`);
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
    <rect width='100%' height='100%' fill='#${bg}'/>
    <rect x='20' y='20' width='760' height='410' fill='none' stroke='#${fg}' stroke-dasharray='8,6' stroke-width='3'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Montserrat, Arial' font-size='36' fill='#${fg}'>${text}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function renderStaticForm(
  formType?: string,
  config?: any,
  defaultCC: string = '+54',
  ctx?: { register: any; errors: any; isSubmitted: boolean }
) {
  const title = formType || 'Contacto';
  const r = ctx?.register;
  const e = ctx?.errors || {};
  const submitted = !!ctx?.isSubmitted;
  const cls = (hasErr: boolean) =>
    `public-form-input ${
      submitted ? (hasErr ? 'is-invalid' : 'is-valid') : ''
    }`;

  switch (formType) {
    case 'Reservas / turnos':
      return (
        <div className="public-form">
          <h3 className="public-form-title">Reservas / turnos</h3>
          <div className="public-form-group">
            <label>Nombre</label>
            <input
              {...r('name')}
              className={cls(!!e.name)}
              placeholder="Tu nombre"
            />
            <small className="public-form-error">
              {e.name?.message || 'Ingresá tu nombre'}
            </small>
          </div>
          <div className="public-form-group">
            <label>Teléfono</label>
            <div className="public-phone-row">
              <select
                {...r('country_code')}
                className={cls(!!e.country_code)}
                defaultValue={defaultCC}
              >
                <option value="+54">+54 (AR)</option>
                <option value="+598">+598 (UY)</option>
                <option value="+55">+55 (BR)</option>
                <option value="+1">+1 (US)</option>
              </select>
              <input
                {...r('phone')}
                className={cls(!!e.phone)}
                placeholder="Tu teléfono"
                inputMode="tel"
                onInput={handlePhoneInput}
              />
            </div>
            <small className="public-form-error">
              {e.phone?.message || 'Ingresá tu teléfono'}
            </small>
          </div>
          <div className="public-form-group">
            <label>Servicio</label>
            <select {...r('service')} className={cls(!!e.service)}>
              <option value="">Elegí un servicio</option>
              {(config?.services || []).map((s: string) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <small className="public-form-error">
              {e.service?.message || 'Elegí un servicio'}
            </small>
          </div>
          <div className="public-form-row">
            <div className="public-form-group" style={{ flex: 1 }}>
              <label>Fecha</label>
              <input {...r('date')} className={cls(!!e.date)} type="date" />
              <small className="public-form-error">
                {e.date?.message || 'Elegí una fecha'}
              </small>
            </div>
            <div className="public-form-group" style={{ flex: 1 }}>
              <label>Hora</label>
              <input
                {...r('time')}
                className={cls(!!e.time)}
                type="time"
                step={
                  config?.time_slot_minutes
                    ? config.time_slot_minutes * 60
                    : 300
                }
              />
              <small className="public-form-error">
                {e.time?.message || 'Elegí un horario'}
              </small>
            </div>
          </div>
          <div className="public-form-group">
            <label>Comentarios</label>
            <textarea
              {...r('comments')}
              className={cls(!!e.comments)}
              rows={3}
              placeholder="Escribí tu mensaje"
            />
            <small className="public-form-error">
              {e.comments?.message || 'Escribí tu mensaje'}
            </small>
          </div>
          <div className="public-form-note">
            Formulario demostrativo (sin envío)
          </div>
        </div>
      );
    case 'Catálogo':
      return (
        <div className="public-form">
          <h3 className="public-form-title">Catálogo</h3>
          <div className="public-form-group">
            <label>Categoría</label>
            <select {...r('category')} className={cls(!!e.category)}>
              <option value="">Elegí una categoría</option>
              {(config?.categories || []).map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <small className="public-form-error">
              {e.category?.message || 'Elegí una categoría'}
            </small>
          </div>
          {config?.allow_quantity ? (
            <div className="public-form-group">
              <label>Cantidad</label>
              <input
                {...r('quantity')}
                className={cls(!!e.quantity)}
                type="number"
                min={1}
                step={1}
                defaultValue={1}
              />
              <small className="public-form-error">
                {e.quantity?.message || 'Ingresá una cantidad válida'}
              </small>
            </div>
          ) : null}
          <div className="public-form-group">
            <label>Nombre</label>
            <input
              {...r('name')}
              className={cls(!!e.name)}
              placeholder="Tu nombre"
            />
            <small className="public-form-error">
              {e.name?.message || 'Ingresá tu nombre'}
            </small>
          </div>
          <div className="public-form-group">
            <label>Teléfono</label>
            <div className="public-phone-row">
              <select
                {...r('country_code')}
                className={cls(!!e.country_code)}
                defaultValue={defaultCC}
              >
                <option value="+54">+54 (AR)</option>
                <option value="+598">+598 (UY)</option>
                <option value="+55">+55 (BR)</option>
                <option value="+1">+1 (US)</option>
              </select>
              <input
                {...r('phone')}
                className={cls(!!e.phone)}
                placeholder="Tu teléfono"
                inputMode="tel"
                onInput={handlePhoneInput}
              />
            </div>
            <small className="public-form-error">
              {e.phone?.message || 'Ingresá tu teléfono'}
            </small>
          </div>
          <div className="public-form-group">
            <label>Comentarios</label>
            <textarea
              {...r('comments')}
              className={cls(!!e.comments)}
              rows={3}
              placeholder="Escribí tu mensaje"
            />
            <small className="public-form-error">
              {e.comments?.message || 'Escribí tu mensaje'}
            </small>
          </div>
          <div className="public-form-note">
            Formulario demostrativo (sin envío)
          </div>
        </div>
      );
    case 'Pedido rápido':
    case 'Contacto simple':
    default:
      return (
        <div className="public-form">
          <h3 className="public-form-title">{title}</h3>
          <div className="public-form-group">
            <label>Nombre</label>
            <input
              {...r('name')}
              className={cls(!!e.name)}
              placeholder="Tu nombre"
            />
            <small className="public-form-error">
              {e.name?.message || 'Ingresá tu nombre'}
            </small>
          </div>
          <div className="public-form-group">
            <label>Teléfono</label>
            <div className="public-phone-row">
              <select
                {...r('country_code')}
                className={cls(!!e.country_code)}
                defaultValue={defaultCC}
              >
                <option value="+54">+54 (AR)</option>
                <option value="+598">+598 (UY)</option>
                <option value="+55">+55 (BR)</option>
                <option value="+1">+1 (US)</option>
              </select>
              <input
                {...r('phone')}
                className={cls(!!e.phone)}
                placeholder="Tu teléfono"
                inputMode="tel"
                onInput={handlePhoneInput}
              />
            </div>
            <small className="public-form-error">
              {e.phone?.message || 'Ingresá tu teléfono'}
            </small>
          </div>
          <div className="public-form-group">
            <label>Mensaje</label>
            <textarea
              {...r('message')}
              className={cls(!!e.message)}
              rows={3}
              placeholder="Escribí tu mensaje"
            />
            <small className="public-form-error">
              {e.message?.message || 'Escribí tu mensaje'}
            </small>
          </div>
          <div className="public-form-note">
            Formulario demostrativo (sin envío)
          </div>
        </div>
      );
  }
}
