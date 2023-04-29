import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';

import './index.css';
import { GBootPage } from './pages/GBootPage';
import { GForgotPasswordPage } from './pages/GForgotPasswordPage';
import { GHomePage } from './pages/GHomePage';
import { GLoginPage } from './pages/GLoginPage';
import { GResetPasswordPage } from './pages/GResetPasswordPage';
import { GSignUpPage } from './pages/GSignUpPage';
import { GFeedbackSuccessResetPassword } from './pages/GSuccessResetPassword';
import { GRecoveryPage } from './pages/GRecoveryPage';
import { GUserPage } from './pages/GUserPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GBootPage />} />
        <Route path="/login" element={<GLoginPage />} />
        <Route path="/sign-up" element={<GSignUpPage />} />
        <Route path="/forgot-password" element={<GForgotPasswordPage />} />
        <Route path="/recovery" element={<GRecoveryPage />}>
          <Route path="reset-password" element={<GResetPasswordPage />} />
          <Route
            path="reset-success"
            element={<GFeedbackSuccessResetPassword />}
          />
        </Route>
        <Route path="/home" element={<GHomePage />} />
        <Route path="/user" element={<GUserPage />}>
          <Route path="pricing" element={<GFeedbackSuccessResetPassword />} />
          <Route path="comments" element={<GFeedbackSuccessResetPassword />} />
          <Route path="edit" element={<GFeedbackSuccessResetPassword />} />
        </Route>
        <Route path="/pricing" element={<GHomePage />} />
        <Route path="/ad" element={<GHomePage />} />
        <Route path="/strategy" element={<GHomePage />} />
        <Route path="/contacts" element={<GHomePage />} />
        <Route path="/statistics" element={<GHomePage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
