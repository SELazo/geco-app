import React from 'react';
import { Provider } from 'react-redux';
import Modal from 'react-modal';
import ReactDOM from 'react-dom/client';
import { GAuthenticationProvider } from './routes/GAuthenticationProvider';
import gecoStore from './redux/gecoStore';

import './index.css';

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={gecoStore}>
      <GAuthenticationProvider />
    </Provider>
  </React.StrictMode>,
);
