import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { GPrivateRoutes } from './GPrivateRoutes';
import { GBootPage } from '../pages/GBootPage';
import { GLoginPage } from '../pages/auth/GLoginPage';
import { GSignUpPage } from '../pages/auth/GSignUpPage';
import { GForgotPasswordPage } from '../pages/auth/GForgotPasswordPage';
import { GRecoveryPage } from '../pages/auth/recovery/GRecoveryPage';
import { GResetPasswordPage } from '../pages/auth/recovery/GResetPasswordPage';
import { GFeedbackSuccessResetPassword } from '../pages/auth/recovery/GSuccessResetPassword';

export const GRouter = ({
  isAuthenticated,
  handleLogin,
  handleLogout,
}: {
  isAuthenticated: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}) => {
  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <Route path="/*" element={<GPrivateRoutes />} />
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
        <Route path="/" element={<GBootPage />} />
        <Route
          path="/login"
          element={<GLoginPage handleLogin={handleLogin} />}
        />
        <Route path="/sign-up" element={<GSignUpPage />} />
        <Route path="/forgot-password" element={<GForgotPasswordPage />} />
        <Route path="/recovery" element={<GRecoveryPage />}>
          <Route path="reset-password" element={<GResetPasswordPage />} />
          <Route
            path="reset-success"
            element={<GFeedbackSuccessResetPassword />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
