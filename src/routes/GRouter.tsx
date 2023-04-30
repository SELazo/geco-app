import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GPrivateRoutes } from './GPrivateRoutes';
import { GPublicRoutes } from './GPublicRoutes';
import { GBootPage } from '../pages/GBootPage';
import { GLoginPage } from '../pages/GLoginPage';
import { GSignUpPage } from '../pages/GSignUpPage';
import { GForgotPasswordPage } from '../pages/GForgotPasswordPage';
import { GRecoveryPage } from '../pages/GRecoveryPage';
import { GResetPasswordPage } from '../pages/GResetPasswordPage';
import { GFeedbackSuccessResetPassword } from '../pages/GSuccessResetPassword';

export const GRouter = () => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<GPrivateRoutes />} />
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
