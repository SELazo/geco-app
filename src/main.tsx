import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import { GLoginPage } from './pages/GLoginPage';
import { GSignUpPage } from './pages/GSignUpPage';
import { GForgotPasswordPage } from './pages/GForgotPasswordPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <GLoginPage />,
  },
  {
    path: '/sign-up',
    element: <GSignUpPage />,
  },
  {
    path: '/forgot-password',
    element: <GForgotPasswordPage />,
  },
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
