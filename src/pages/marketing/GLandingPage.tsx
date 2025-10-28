import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  Stack,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GLogoWord } from '../../components/GLogoWord';
import GecoAnimal from '../../assets/images/geco_animal.svg';
import DemoAppGif from '../../assets/images/demo-app.gif';
import { GIcon } from '../../components/GIcon';
import { GContactsIcon, GStrategyIcon, GAdIcon } from '../../constants/buttons';
import { GYellow } from '../../constants/palette';
import DownloadIcon from '@mui/icons-material/Download';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const GLandingPage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPWAInstallable, setIsPWAInstallable] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome 67 y anteriores muestren automáticamente el prompt
      e.preventDefault();
      // Guardar el evento para que pueda ser activado más tarde
      setDeferredPrompt(e);
      setIsPWAInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA fue instalada');
      setIsPWAInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar si ya está instalada
    if (
      window.matchMedia &&
      window.matchMedia('(display-mode: standalone)').matches
    ) {
      setIsPWAInstallable(false);
    }

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      // Fallback para dispositivos iOS o cuando no hay prompt disponible
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        alert(
          'Para instalar la app en iOS:\n1. Toca el botón de compartir\n2. Selecciona "Agregar a pantalla de inicio"'
        );
      } else {
        alert(
          'Para instalar la app, usa el menú de tu navegador y selecciona "Instalar app" o "Agregar a pantalla de inicio"'
        );
      }
      return;
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar a que el usuario responda al prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó instalar la PWA');
    } else {
      console.log('Usuario rechazó instalar la PWA');
    }

    // Limpiar el prompt ya que solo se puede usar una vez
    setDeferredPrompt(null);
    setIsPWAInstallable(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el mensaje
    console.log('Mensaje enviado:', contactForm);

    // Mostrar mensaje de éxito
    setShowSuccessAlert(true);

    // Limpiar formulario
    setContactForm({
      name: '',
      email: '',
      message: '',
    });

    // Ocultar alerta después de 5 segundos
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#D9D9D9',
        color: (t) => t.palette.text.primary,
      }}
    >
      {/* Top Nav */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar
          sx={{
            justifyContent: { xs: 'center', sm: 'space-between' },
            position: 'relative',
            py: { xs: 2, sm: 1 },
          }}
        >
          {/* Logo - centrado en mobile, izquierda en desktop */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: { xs: 'static', sm: 'static' },
            }}
          >
            <GLogoWord />
          </Box>

          {/* Menú hamburguesa - solo visible en mobile */}
          <IconButton
            sx={{
              display: { xs: 'block', sm: 'none' },
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>

          {/* Botones - solo visibles en desktop */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            <Button
              style={{
                width: 180,
                height: 40,
                borderRadius: 12,
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: 16,
                textAlign: 'center',
                color: '#1947E5',
              }}
              component={RouterLink}
              to="/login"
            >
              Ingresar
            </Button>
            <Button
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
              component={RouterLink}
              to="/sign-up"
              variant="contained"
            >
              Crear cuenta
            </Button>
            <Button
              style={{
                width: 160,
                height: 40,
                background: GYellow,
                border: '2px solid #18191F',
                borderRadius: 12,
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: 14,
                textAlign: 'center',
                color: '#18191F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onClick={handleInstallPWA}
              variant="contained"
            >
              {isPWAInstallable ? (
                <DownloadIcon fontSize="small" />
              ) : (
                <PhoneAndroidIcon fontSize="small" />
              )}
              {isPWAInstallable ? 'Instalar' : 'Descargar'}
            </Button>
          </Stack>

          {/* Menú desplegable para mobile */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiPaper-root': {
                borderRadius: 3,
                mt: 1,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem
              component={RouterLink}
              to="/login"
              onClick={handleMenuClose}
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#1947E5',
              }}
            >
              Ingresar
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/sign-up"
              onClick={handleMenuClose}
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#1947E5',
              }}
            >
              Crear cuenta
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleInstallPWA();
                handleMenuClose();
              }}
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                color: '#1947E5',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {isPWAInstallable ? (
                <DownloadIcon fontSize="small" />
              ) : (
                <PhoneAndroidIcon fontSize="small" />
              )}
              {isPWAInstallable ? 'Instalar' : 'Descargar'}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'extra bold',
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.1,
                fontSize: { xs: '2.125rem', md: '3.75rem' }, // h4 en mobile, h2 en desktop
              }}
            >
              Gestión de comunicación simple y efectiva
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                opacity: 0.8,
                mb: 4,
                fontSize: { xs: '1rem', md: '1.25rem' }, // h6 en mobile, h5 en desktop
              }}
            >
              Diseñá mensajes, gestioná pedidos y mantené el vínculo con tu
              comunidad sin ser experto en marketing.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                sx={{
                  width: { xs: '100%', sm: 200 },
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
                component={RouterLink}
                to="/login"
                size="large"
                variant="contained"
              >
                Ingresar a GECo
              </Button>
              <Button
                sx={{
                  width: { xs: '100%', sm: 200 },
                  height: 40,
                  borderRadius: 12,
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: 14,
                  textAlign: 'center',
                  color: '#1947E5',
                  border: '2px solid #1947E5',
                }}
                onClick={handleInstallPWA}
                size="large"
                variant="outlined"
                startIcon={
                  isPWAInstallable ? <DownloadIcon /> : <PhoneAndroidIcon />
                }
              >
                {isPWAInstallable ? 'Instalar ' : 'Descargar'}
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ p: 0, overflow: 'hidden', borderRadius: 3 }}
            >
              <Box
                sx={{
                  aspectRatio: '16 / 9',
                  bgcolor: (t) =>
                    t.palette.mode === 'light' ? '#F3F6F9' : '#0B0F14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* GIF de demostración de la app */}
                <img
                  src={DemoAppGif}
                  alt="Demostración de GECo App"
                  style={{
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                  onError={(e) => {
                    // Fallback si no se encuentra el GIF
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <Typography
                  variant="overline"
                  sx={{
                    opacity: 0.7,
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  Vista previa de la aplicación
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* About / Features */}
      <Box
        id="about"
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: (t) =>
            t.palette.mode === 'light' ? '#FFF' : 'background.paper',
          backgroundImage: `url(${GecoAnimal})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: {
            xs: '120% center',
            sm: '110% center',
            md: 'right center',
          },
          backgroundSize: { xs: 'auto 80%', sm: 'auto 70%', md: 'auto 60%' },
          backgroundAttachment: 'fixed',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 800,
              mb: 4,
            }}
          >
            ¿Qué es GECo?
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              opacity: 0.85,
              maxWidth: 900,
              mb: 6,
            }}
          >
            GECo (Gestión de Comunicación) es una plataforma para administrar tu
            red de contactos, segmentar grupos, diseñar estrategias de
            comunicación y analizar métricas de impacto para mejorar la toma de
            decisiones.
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                title: 'Tus clientes, siempre a mano',
                desc: 'Guardalos, organizalos y encontralos fácil cuando los necesites.',
                icon: GContactsIcon,
              },
              {
                title: 'Llegá a tus clientes, de forma directa',
                desc: 'Enviá mensajes por WhatsApp, Telegram y Email.',
                icon: GStrategyIcon,
              },
              {
                title: 'De la promoción al pedido sin vueltas',
                desc: 'Recibí pedidos fáciles con formularios configurables.',
                icon: GAdIcon,
              },
            ].map((f) => (
              <Grid key={f.title} item xs={12} sm={6} md={4}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 8,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      mb: 1,
                      fontSize: 50,
                      width: 50,
                      height: 50,
                      mx: 'auto',
                    }}
                  >
                    <GIcon
                      icon-type={f.icon['icon-type']}
                      color={f.icon.color}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: 24,
                      fontFamily: 'Montserrat, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: '28px',
                      mb: 1,
                      textAlign: 'center',
                    }}
                  >
                    {f.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontFamily: 'Montserrat, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      opacity: 0.8,
                      textAlign: 'center',
                    }}
                  >
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Paper
          sx={{ p: { xs: 3, md: 5 }, borderRadius: 8, textAlign: 'center' }}
        >
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 800,
              fontSize: 24,
              mb: 2,
            }}
          >
            ¿Listo para probar GECo?
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: 16,
              opacity: 0.8,
              mb: 3,
            }}
          >
            Comienza ahora iniciando sesión o creando tu cuenta gratuita.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              sx={{
                width: { xs: '100%', sm: 160 },
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
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
            >
              Ingresar
            </Button>
            <Button
              sx={{
                width: { xs: '100%', sm: 160 },
                height: 40,
                borderRadius: 12,
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: 16,
                textAlign: 'center',
                color: '#1947E5',
              }}
              component={RouterLink}
              to="/sign-up"
              size="large"
            >
              Crear cuenta
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* Contact Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: (t) =>
            t.palette.mode === 'light' ? '#FFF' : 'background.paper',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 800,
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.125rem' },
            }}
          >
            Contáctanos
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              opacity: 0.8,
              mb: 4,
              textAlign: 'center',
              fontSize: { xs: '1rem', md: '1.125rem' },
            }}
          >
            Si tenés alguna duda no dudes en mensajearnos 😃
          </Typography>

          {showSuccessAlert && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => setShowSuccessAlert(false)}
            >
              ¡Tu mensaje ha sido enviado! En breve nos estaremos comunicando
              contigo.
            </Alert>
          )}

          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
            <form onSubmit={handleContactSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    variant="outlined"
                    value={contactForm.name}
                    onChange={(e) =>
                      handleContactFormChange('name', e.target.value)
                    }
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={contactForm.email}
                    onChange={(e) =>
                      handleContactFormChange('email', e.target.value)
                    }
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mensaje"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={contactForm.message}
                    onChange={(e) =>
                      handleContactFormChange('message', e.target.value)
                    }
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      minWidth: { sm: 200 },
                      height: 48,
                      background: '#1947E5',
                      border: '2px solid #18191F',
                      borderRadius: 3,
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#FFFFFF',
                      '&:hover': {
                        background: '#1538CC',
                      },
                    }}
                  >
                    Enviar Mensaje
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, textAlign: 'center', opacity: 0.7 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} GECo. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};
