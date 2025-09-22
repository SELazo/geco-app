import React from 'react';
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
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { GLogoWord } from '../../components/GLogoWord';
import GecoAnimal from '../../assets/images/geco_animal.svg';
import { GIcon } from '../../components/GIcon';
import { GContactsIcon, GStrategyIcon, GAdIcon } from '../../constants/buttons';

export const GLandingPage: React.FC = () => {
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
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GLogoWord />
          </Box>
          <Stack direction="row" spacing={1}>
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
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'extra bold',
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.1,
              }}
            >
              Gestión de comunicación simple y efectiva
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                opacity: 0.8,
                mb: 4,
              }}
            >
              Diseñá mensajes, gestioná pedidos y mantené el vínculo con tu
              comunidad sin ser experto en marketing.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                style={{
                  width: 200,
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
                href="#about"
                size="large"
                variant="text"
              >
                Conocer más
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
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.7 }}>
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
              to="/login"
              variant="contained"
              size="large"
            >
              Ingresar
            </Button>
            <Button
              style={{
                width: 160,
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

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, textAlign: 'center', opacity: 0.7 }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} GECo. Todos los derechos reservados.
        </Typography>
      </Box>
    </Box>
  );
};
