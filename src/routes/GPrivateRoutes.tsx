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
import { GListContactsToImportPage } from '../pages/contacts/add-contact/GListContactsToImportPage';
import { GAddContactsExcelSuccessPage } from '../pages/contacts/add-contact/GAddContactExcelSuccessPage';
import { GStatisticsRenderMainPage } from '../pages/statistics/GStatisticsRenderMainPage';
import { GStatisticsPage } from '../pages/statistics/GStatisticsPage';
import { GStatisticsContactsPage } from '../pages/statistics/contacts/GStatisticsContactsPage';
import { GGroupsGrowthPage } from '../pages/statistics/contacts/GGroupsGrowthPage';
import { GRedCompositionPage } from '../pages/statistics/contacts/GRedCompositionPage';
import { GContactsGroupPage } from '../pages/contacts/GContactsGroupsPage';
import { GAddNewGroupFormStep1Page } from '../pages/contacts/add-group/GAddNewGroupFormStep1Page';
import { GAddNewGroupFormStep2Page } from '../pages/contacts/add-group/GAddNewGroupFormStep2Page';
import { GNewGroupSuccessPage } from '../pages/contacts/add-group/GNewGroupSuccessPage';
import { GGroupPage } from '../pages/contacts/GGroupPage';
import { GEditUserInfoSuccessPage } from '../pages/user/GEditUserInfoSuccessPage';
import { GAdsPage } from '../pages/ads/GAdsPage';
import { GAdSizePage } from '../pages/ads/createAd/GAdSizePage';
import { GAdContentPage } from '../pages/ads/createAd/GAdContentPage';
import { GAdImgTypePage } from '../pages/ads/createAd/GAdImgTypePage';
import { GAdOwnImgPage } from '../pages/ads/createAd/GAdOwnImgPage';
import { GAdPatternPage } from '../pages/ads/createAd/GAdPatternPage';
import { GAdColoursPage } from '../pages/ads/createAd/GAdColoursPage';
import { GAdGenerationPage } from '../pages/ads/createAd/GAdGenerationPage';
import { GAdIdentificationPage } from '../pages/ads/createAd/GAdIdentificationPage';
import { GAdSuccessPage } from '../pages/ads/createAd/GAdSuccessPage';
import { GAdsListPage } from '../pages/ads/listAds/GAdsListPage';
import { GAdErrorPage } from '../pages/ads/createAd/GAdErrorPage ';
import { GStrategyPage } from '../pages/strategies/GStrategiesPage';
import { GStrategyErrorPage } from '../pages/strategies/GStrategyErrorPage ';
import { GStrategyInformationPage } from '../pages/strategies/createStrategy/GStrategyInformationPage';
import { GStrategiesListPage } from '../pages/strategies/listStrategies/GStrategiesListPage';
import { GStrategyAdsPage } from '../pages/strategies/createStrategy/GStrategyAdsPage';
import { GStrategyGroupsPage } from '../pages/strategies/createStrategy/GStrategyGroupsPage';
import { GStrategyPeriodPage } from '../pages/strategies/createStrategy/GStrategyPeriodPage';
import { GStrategyPeriodicityPage } from '../pages/strategies/createStrategy/GStrategyPeriodicityPage';
import { GStrategyResumePage } from '../pages/strategies/createStrategy/GStrategyResumePage';
import { GStrategySuccessPage } from '../pages/strategies/createStrategy/GStrategySuccessPage';
import { GStrategyFormConfigPage } from '../pages/strategies/createStrategy/GStrategyFormConfigPage';
import { GStrategyEditInformationPage } from '../pages/strategies/editStrategy/GStrategyEditInformationPage';
import { GStrategyEditAdsPage } from '../pages/strategies/editStrategy/GStrategyEditAdsPage';
import { GStrategyEditGroupsPage } from '../pages/strategies/editStrategy/GStrategyEditGroupsPage';
import { GStrategyEditPeriodPage } from '../pages/strategies/editStrategy/GStrategyEditPeriodPage';
import { GStrategyEditPeriodicityPage } from '../pages/strategies/editStrategy/GStrategyEditPeriodicityPage';
import { GStrategyEditResumePage } from '../pages/strategies/editStrategy/GStrategyEditResumePage';
import { GStrategyEditSuccessPage } from '../pages/strategies/editStrategy/GStrategyEditSuccessPage';
import { GStrategyEditFormConfigPage } from '../pages/strategies/editStrategy/GStrategyEditFormConfigPage';
import { GAdViewPage } from '../pages/ads/listAds/GAdViewPage';
import { GAdEditSuccessPage } from '../pages/ads/editAds/GAdEditSuccessPage';
import { GAdEditIdentificationPage } from '../pages/ads/editAds/GAdEditIdentificationPage';
import { GPublicStrategyPage } from '../pages/marketing/GPublicStrategyPage';

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
        <Route path="edit-success" element={<GEditUserInfoSuccessPage />} />
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
        <Route
          path="success-add-contacts-excel"
          element={<GAddContactsExcelSuccessPage />}
        />
        <Route path="delete-contact" element={<GDeleteContactsListPage />} />
        <Route
          path="list-contacts-to-import"
          element={<GListContactsToImportPage />}
        />
        <Route path="add-contacts-excel" element={<GAddContactsExcelPage />} />
        <Route path="groups" element={<GContactsGroupPage />} />
        <Route
          path="groups/add-group/info"
          element={<GAddNewGroupFormStep1Page />}
        />
        <Route
          path="groups/add-group/members"
          element={<GAddNewGroupFormStep2Page />}
        />
        <Route
          path="groups/sucess-add-group"
          element={<GNewGroupSuccessPage />}
        />
        <Route path="groups/:id" element={<GGroupPage />} />
        <Route path="list" element={<GContactsListPage />} />
        <Route path="*" element={<Navigate to="/contacts/options" />} />
      </Route>
      <Route path="/statistics" element={<GStatisticsRenderMainPage />}>
        <Route path="options" element={<GStatisticsPage />} />
        <Route path="contacts" element={<GStatisticsContactsPage />} />
        <Route path="contacts/groups-growth" element={<GGroupsGrowthPage />} />
        <Route
          path="contacts/red-composition"
          element={<GRedCompositionPage />}
        />
        <Route path="*" element={<Navigate to="/statistics/options" />} />
      </Route>
      <Route path="/pricing" element={<GHomePage />} />
      <Route path="/ad" element={<GAdsPage />} />
      <Route path="/ad/create/size" element={<GAdSizePage />} />
      <Route path="/ad/create/content" element={<GAdContentPage />} />
      <Route path="/ad/create/image" element={<GAdImgTypePage />} />
      <Route path="/ad/create/image/own" element={<GAdOwnImgPage />} />
      <Route path="/ad/create/pattern" element={<GAdPatternPage />} />
      <Route path="/ad/create/pallette" element={<GAdColoursPage />} />
      <Route path="/ad/create/ad_generation" element={<GAdGenerationPage />} />
      <Route
        path="/ad/create/information"
        element={<GAdIdentificationPage />}
      />
      <Route path="/ad/create/success" element={<GAdSuccessPage />} />
      <Route path="/ad/list" element={<GAdsListPage />} />
      <Route path="/ad/view" element={<GAdViewPage />} />
      <Route
        path="/ad/edit/information"
        element={<GAdEditIdentificationPage />}
      />
      <Route path="/ad/edit/success" element={<GAdEditSuccessPage />} />
      <Route path="/ad/error" element={<GAdErrorPage />} />
      <Route path="/strategy" element={<GStrategyPage />} />
      <Route path="/strategy/error" element={<GStrategyErrorPage />} />
      <Route
        path="/strategy/create/information"
        element={<GStrategyInformationPage />}
      />
      <Route path="/strategy/create/ads" element={<GStrategyAdsPage />} />
      <Route path="/strategy/create/groups" element={<GStrategyGroupsPage />} />
      <Route path="/strategy/create/period" element={<GStrategyPeriodPage />} />
      <Route
        path="/strategy/create/periodicity"
        element={<GStrategyPeriodicityPage />}
      />
      <Route
        path="/strategy/create/form"
        element={<GStrategyFormConfigPage />}
      />
      <Route path="/strategy/create/resume" element={<GStrategyResumePage />} />
      <Route
        path="/strategy/create/success"
        element={<GStrategySuccessPage />}
      />
      <Route
        path="/strategy/edit/information"
        element={<GStrategyEditInformationPage />}
      />
      <Route path="/strategy/edit/ads" element={<GStrategyEditAdsPage />} />
      <Route
        path="/strategy/edit/groups"
        element={<GStrategyEditGroupsPage />}
      />
      <Route
        path="/strategy/edit/period"
        element={<GStrategyEditPeriodPage />}
      />
      <Route
        path="/strategy/edit/periodicity"
        element={<GStrategyEditPeriodicityPage />}
      />
      <Route
        path="/strategy/edit/form"
        element={<GStrategyEditFormConfigPage />}
      />
      <Route
        path="/strategy/edit/resume"
        element={<GStrategyEditResumePage />}
      />
      <Route
        path="/strategy/edit/success"
        element={<GStrategyEditSuccessPage />}
      />
      <Route path="/strategy/list" element={<GStrategiesListPage />} />
      <Route path="/statistics" element={<GHomePage />} />
      <Route path="/public/strategy/:id" element={<GPublicStrategyPage />} />
      <Route path="/*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
