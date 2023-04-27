import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import { GLoginPage } from './pages/GLoginPage';
import { GSignUpPage } from './pages/GSignUpPage';
import { GForgotPasswordPage } from './pages/GForgotPasswordPage';
import { GBootPage } from './pages/GBootPage';
import { GResetPasswordPage } from './pages/GResetPasswordPage';
import { GHomePage } from './pages/GHomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <GBootPage />,
  },
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
  {
    path: '/reset-password',
    element: <GResetPasswordPage />,
  },
  {
    path: '/home',
    element: <GHomePage />,
  },
  {
    path: '/user',
    element: <GHomePage />,
  },
  {
    path: '/pricing',
    element: <GHomePage />,
  },
  {
    path: '/ad',
    element: <GHomePage />,
  },
  {
    path: '/strategy',
    element: <GHomePage />,
  },
  {
    path: '/contacts',
    element: <GHomePage />,
  },
  {
    path: '/statistics',
    element: <GHomePage />,
  },
]);
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
