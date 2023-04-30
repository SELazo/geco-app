import { Route, Routes } from 'react-router-dom';
import { GHomePage } from '../pages/GHomePage';
import { GUserPage } from '../pages/GUserPage';
import { GFeedbackSuccessResetPassword } from '../pages/GSuccessResetPassword';

export const GPrivateRoutes = () => {
  return (
    <Routes>
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
  );
};
