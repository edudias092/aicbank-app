import { useEffect, useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import { Resumo } from './components/MinhaConta/Resumo';
import { ContaContextProvider } from './contexts/ContaContextProvider';
import "react-day-picker/style.css";
import { Extrato } from './components/MinhaConta/Extrato';
import { CobrancaBoleto } from './components/MinhaConta/CobrancaBoleto';
import { DetalheCobranca } from './components/MinhaConta/DetalheCobranca';
import { ListaCobranças } from './components/MinhaConta/ListaCobrancas';
import { NovaTransferencia } from './components/MinhaConta/NovaTransferencia';

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <ContaContextProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/conta" element={
                <>
                  <PageTitle title="Resumo Conta | AIC Bank" />
                    <Resumo />
                </>
              }
              />
          <Route path="/" element={
            <>
                <PageTitle title="Início | AIC Bank" />
                <ECommerce />
              </>
            }
            />
          <Route path="/extrato" element={
            <>
                <PageTitle title="Extrato | AIC Bank" />
                <Extrato />
              </>
            }
            />
          <Route path="/cobrancas" element={
            <>
                <PageTitle title="Cobranças | AIC Bank" />
                <ListaCobranças />
              </>
            }
            />
            <Route path="/cobrancas/nova-cobranca" element={
            <>
                <PageTitle title="Nova Cobrança | AIC Bank" />
                <CobrancaBoleto />
              </>
            }
            />
            <Route path="/cobrancas/detalhe-cobranca/:id" element={
            <>
                <PageTitle title="Cobrança | AIC Bank" />
                <DetalheCobranca />
              </>
            }
            />
            <Route path="/pix" element={
            <>
                <PageTitle title="Nova Transferência / Pix | AIC Bank" />
                <NovaTransferencia />
              </>
            }
            />
        </Route>
        <Route element={<AuthLayout />}>
          <Route
              path="/registro"
              element={
                <>
                  <PageTitle title="Registro | AIC Bank" />
                  <SignUp />
                </>
              }
              />
            <Route
              path="/login"
              element={
                <>
                  <PageTitle title="Login | AIC Bank" />
                  <SignIn />
                </>
              }
              />
        </Route>
      </Routes>
    </BrowserRouter>
    </ContaContextProvider>
  );
}

export const AuthLayout = () => {
  return <Outlet />
}

export default App;
