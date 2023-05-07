import { Navigate, Route, Routes } from 'react-router-dom';
import { GHomePage } from '../pages/GHomePage';
import { GUserPage } from '../pages/user/GUserPage';
import { GEditUserInfoPage } from '../pages/user/GEditUserInfoPage';
import { GRenderMainPage } from '../pages/user/GUserRenderMainPage';
import { GPricingPage } from '../pages/user/GPricingPage';
import { GCommentsPage } from '../pages/user/GCommentsPage';
import { GSuccessSendCommentPage } from '../pages/user/GSuccessSendCommentPage';
import { GPricingTermsPage } from '../pages/user/GPrincingTerms';

export const GPrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<GHomePage />} />
      <Route path="/user" element={<GRenderMainPage />}>
        <Route path="info" element={<GUserPage />} />
        <Route path="pricing" element={<GPricingPage />} />
        <Route path="pricing/terms" element={<GPricingTermsPage />} />
        <Route path="comments" element={<GCommentsPage />} />
        <Route path="edit" element={<GEditUserInfoPage />} />
        <Route path="message-sended" element={<GSuccessSendCommentPage />} />
        <Route path="*" element={<Navigate to="/use/info" />} />
      </Route>
      <Route path="/pricing" element={<GHomePage />} />
      <Route path="/ad" element={<GHomePage />} />
      <Route path="/strategy" element={<GHomePage />} />
      <Route path="/contacts" element={<GHomePage />} />
      <Route path="/statistics" element={<GHomePage />} />
      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
