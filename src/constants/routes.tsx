import { GBootPage } from '../pages/GBootPage';
import { GForgotPasswordPage } from '../pages/GForgotPasswordPage';
import { GHomePage } from '../pages/GHomePage';
import { GLoginPage } from '../pages/GLoginPage';
import { GResetPasswordPage } from '../pages/GResetPasswordPage';
import { GSignUpPage } from '../pages/GSignUpPage';
import { GFeedbackSuccessResetPassword } from '../pages/GSuccessResetPassword';

export const routes = [
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
    children: [
      {
        path: 'success',
        element: <GFeedbackSuccessResetPassword />,
      },
    ],
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
];
