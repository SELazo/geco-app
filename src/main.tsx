import React from 'react';
import { Provider } from 'react-redux';
import Modal from 'react-modal';
import ReactDOM from 'react-dom/client';
import { GAuthenticationProvider } from './routes/GAuthenticationProvider';
import gecoStore from './redux/gecoStore';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import './index.css';

// Importar herramientas de desarrollo solo en modo DEV
if (import.meta.env.DEV) {
  import('./tests/quickFirestoreTest').then(() => {
    console.log('🔥 Firestore testing functions loaded! Try:');
    console.log('- quickConnectionTest()');
    console.log('- testSpecificInterface("strategy")');
    console.log('- checkFirestoreConfig()');
  });
}

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
