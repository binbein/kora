import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/pages/PageNotFound';

// Public pages
import Landing from '@/pages/public/Landing';
import Pricing from '@/pages/public/Pricing';
import DemoRequest from '@/pages/public/DemoRequest';

// Employee portal
import EmployeeLayout from '@/components/employee/EmployeeLayout';
import EmployeeHome from '@/pages/employee/EmployeeHome';
import Psicologi from '@/pages/employee/Psicologi';
import Medico from '@/pages/employee/Medico';
import Checkup from '@/pages/employee/Checkup';
import PianoAI from '@/pages/employee/PianoAI';
import Profilo from '@/pages/employee/Profilo';

// HR portal
import HRLayout from '@/components/hr/HRLayout';
import HRDashboard from '@/pages/hr/HRDashboard';
import HRDipendenti from '@/pages/hr/HRDipendenti';
import HRReport from '@/pages/hr/HRReport';
import HRFatturazione from '@/pages/hr/HRFatturazione';
import HRPrivacy from '@/pages/hr/HRPrivacy';

// Professional portal
import ProLayout from '@/components/professional/ProLayout';
import ProCalendario from '@/pages/professional/ProCalendario';
import ProSessioni from '@/pages/professional/ProSessioni';
import ProPazienti from '@/pages/professional/ProPazienti';
import ProPagamenti from '@/pages/professional/ProPagamenti';
import ProProfilo from '@/pages/professional/ProProfilo';

// Admin portal
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAziende from '@/pages/admin/AdminAziende';
import AdminUtenti from '@/pages/admin/AdminUtenti';
import AdminProfessionisti from '@/pages/admin/AdminProfessionisti';
import AdminSessioni from '@/pages/admin/AdminSessioni';
import AdminProvider from '@/pages/admin/AdminProvider';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/demo" element={<DemoRequest />} />

    {/* Employee portal */}
    <Route path="/employee" element={<EmployeeLayout />}>
      <Route index element={<EmployeeHome />} />
      <Route path="psicologi" element={<Psicologi />} />
      <Route path="medico" element={<Medico />} />
      <Route path="checkup" element={<Checkup />} />
      <Route path="piano-ai" element={<PianoAI />} />
      <Route path="profilo" element={<Profilo />} />
    </Route>

    {/* HR portal */}
    <Route path="/hr" element={<HRLayout />}>
      <Route index element={<HRDashboard />} />
      <Route path="dipendenti" element={<HRDipendenti />} />
      <Route path="report" element={<HRReport />} />
      <Route path="fatturazione" element={<HRFatturazione />} />
      <Route path="privacy" element={<HRPrivacy />} />
    </Route>

    {/* Professional portal */}
    <Route path="/professional" element={<ProLayout />}>
      <Route index element={<ProCalendario />} />
      <Route path="sessioni" element={<ProSessioni />} />
      <Route path="pazienti" element={<ProPazienti />} />
      <Route path="pagamenti" element={<ProPagamenti />} />
      <Route path="profilo" element={<ProProfilo />} />
    </Route>

    {/* Admin portal */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminAziende />} />
      <Route path="utenti" element={<AdminUtenti />} />
      <Route path="professionisti" element={<AdminProfessionisti />} />
      <Route path="sessioni" element={<AdminSessioni />} />
      <Route path="provider" element={<AdminProvider />} />
      <Route path="analytics" element={<AdminAnalytics />} />
    </Route>

    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AppRoutes />
      </Router>
    </QueryClientProvider>
  );
}

export default App;