import { Navigate, Route, Routes } from 'react-router-dom';
import { GHomePage } from '../pages/GHomePage';
import { GUserPage } from '../pages/user/GUserPage';
import { GEditUserInfoPage } from '../pages/user/GEditUserInfoPage';
import { GUserRenderMainPage } from '../pages/user/GUserRenderMainPage';
import { GPricingPage } from '../pages/user/GPricingPage';
import { GCommentsPage } from '../pages/user/GCommentsPage';
import { GSuccessSendCommentPage } from '../pages/user/GSuccessSendCommentPage';
import { GContactsRenderMainPage } from '../pages/contacts/GContactsRenderMainPage';
import { GContactsPage } from '../pages/contacts/GContactsPage';
import { GContactsListPage } from '../pages/contacts/GContactsListPage';
import { GPricingTermsPage } from '../pages/user/GPrincingTerms';
import { GAddContactPage } from '../pages/contacts/add-contact/GAddContactPage';
import { GAddContactSuccessPage } from '../pages/contacts/add-contact/GAddContactSuccessPage';
import { GAddContactsExcelPage } from '../pages/contacts/add-contact/GAddContactsExcelPage';
import { GDeleteContactsListPage } from '../pages/contacts/add-contact/GDeleteContactsListPage';

export const GPrivateRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<GHomePage />} />
      <Route path="/user" element={<GUserRenderMainPage />}>
        <Route path="info" element={<GUserPage />} />
        <Route path="pricing" element={<GPricingPage />} />
        <Route path="pricing/terms" element={<GPricingTermsPage />} />
        <Route path="comments" element={<GCommentsPage />} />
        <Route path="edit" element={<GEditUserInfoPage />} />
        <Route path="message-sended" element={<GSuccessSendCommentPage />} />
        <Route path="*" element={<Navigate to="/use/info" />} />
      </Route>
      <Route path="/contacts" element={<GContactsRenderMainPage />}>
        <Route path="options" element={<GContactsPage />} />
        <Route path="add-contact" element={<GAddContactPage />} />
        <Route
          path="success-add-contact"
          element={<GAddContactSuccessPage />}
        />
        <Route path="delete-contact" element={<GDeleteContactsListPage />} />
        <Route path="add-contacts-excel" element={<GAddContactsExcelPage />} />
        <Route path="groups" element={<GPricingPage />} />
        <Route path="list" element={<GContactsListPage />} />
        <Route path="*" element={<Navigate to="/contacts/options" />} />
      </Route>
      <Route path="/pricing" element={<GHomePage />} />
      <Route path="/ad" element={<GHomePage />} />
      <Route path="/strategy" element={<GHomePage />} />
      <Route path="/statistics" element={<GHomePage />} />
      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
