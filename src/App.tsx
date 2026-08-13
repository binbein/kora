import { useSyncExternalStore } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { getLocale, subscribeLocale } from '@/lib/i18n'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from '@/pages/PageNotFound';
import RequireRole from '@/components/kora/RequireRole';

// Public pages
import Landing from '@/pages/public/Landing';
import Roi from '@/pages/public/Roi';
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
    <Route path="/roi" element={<Roi />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/demo" element={<DemoRequest />} />

    {/*
      Ogni portale è dietro la sua guardia, che è **una porta che concede**: in
      demo nessun ingresso viene negato, perché i tre momenti del pitch lo
      richiedono. Il perché sta tutto in `RequireRole`, compreso il modo in cui
      il ramo che nega resta raggiungibile.

      La guardia avvolge il layout e non le singole rotte: il ruolo è del
      portale, non della schermata, e ripeterla su ventisei righe sarebbe
      ventisei posti da sbagliare.
    */}

    {/* Employee portal */}
    <Route
      path="/employee"
      element={
        <RequireRole role="employee">
          <EmployeeLayout />
        </RequireRole>
      }
    >
      <Route index element={<EmployeeHome />} />
      <Route path="psicologi" element={<Psicologi />} />
      <Route path="medico" element={<Medico />} />
      <Route path="checkup" element={<Checkup />} />
      <Route path="piano-ai" element={<PianoAI />} />
      <Route path="profilo" element={<Profilo />} />
    </Route>

    {/* HR portal */}
    <Route
      path="/hr"
      element={
        <RequireRole role="hr">
          <HRLayout />
        </RequireRole>
      }
    >
      <Route index element={<HRDashboard />} />
      <Route path="dipendenti" element={<HRDipendenti />} />
      <Route path="report" element={<HRReport />} />
      <Route path="fatturazione" element={<HRFatturazione />} />
      <Route path="privacy" element={<HRPrivacy />} />
    </Route>

    {/* Professional portal */}
    <Route
      path="/professional"
      element={
        <RequireRole role="professional">
          <ProLayout />
        </RequireRole>
      }
    >
      <Route index element={<ProCalendario />} />
      <Route path="sessioni" element={<ProSessioni />} />
      <Route path="pazienti" element={<ProPazienti />} />
      <Route path="pagamenti" element={<ProPagamenti />} />
      <Route path="profilo" element={<ProProfilo />} />
    </Route>

    {/* Admin portal */}
    <Route
      path="/admin"
      element={
        <RequireRole role="admin">
          <AdminLayout />
        </RequireRole>
      }
    >
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

/*
 * Il punto in cui il cambio lingua diventa visibile (M5.e).
 *
 * Si iscrive allo store del locale e, quando cambia, si rirenderizza. Poiché
 * **crea lui** l'elemento `<AppRoutes />` invece di riceverlo come `children`,
 * il suo re-render produce elementi nuovi e l'albero intero si ridisegna,
 * leggendo il dizionario aggiornato da `t`.
 *
 * LA DIFFERENZA FRA RICEVERE E CREARE NON È UN DETTAGLIO: con
 * `<LocaleGate>{...}</LocaleGate>` i figli sarebbero lo stesso oggetto
 * elemento a ogni render, React salterebbe il sottoalbero e la lingua non
 * cambierebbe da nessuna parte.
 *
 * NON RIMONTA NIENTE — non c'è nessun `key` — quindi lo stato locale
 * sopravvive: la conversazione col medico virtuale, la conferma della
 * richiesta demo, il trimestre selezionato. Il provider e la cache di
 * react-query vivono fuori dall'albero e non si toccano: una prenotazione
 * fatta in italiano esiste ancora in tedesco.
 */
function LocaleGate() {
  useSyncExternalStore(subscribeLocale, getLocale);
  return <AppRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <LocaleGate />
      </Router>
    </QueryClientProvider>
  );
}

export default App;