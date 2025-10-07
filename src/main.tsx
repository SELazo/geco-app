import React from 'react';
import { Provider } from 'react-redux';
import Modal from 'react-modal';
import ReactDOM from 'react-dom/client';
import { GAuthenticationProvider } from './routes/GAuthenticationProvider';
import gecoStore from './redux/gecoStore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import './index.css';


Modal.setAppElement('#root');

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={gecoStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GAuthenticationProvider />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
