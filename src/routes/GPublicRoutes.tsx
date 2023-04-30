import { Route, Routes } from 'react-router-dom';
import { GBootPage } from '../pages/GBootPage';
import { GLoginPage } from '../pages/GLoginPage';
import { GSignUpPage } from '../pages/GSignUpPage';
import { GForgotPasswordPage } from '../pages/GForgotPasswordPage';
import { GRecoveryPage } from '../pages/GRecoveryPage';
import { GResetPasswordPage } from '../pages/GResetPasswordPage';
import { GFeedbackSuccessResetPassword } from '../pages/GSuccessResetPassword';

export const GPublicRoutes = () => {
  return (
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
    </Routes>
  );
};
