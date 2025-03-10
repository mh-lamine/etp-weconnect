import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

import AuthLayout from "./layouts/AuthLayout";
import Layout from "./layouts/Layout";

import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import logo from "/weconnect-no-bg.svg";
import { Toaster } from "sonner";
import { AlertCircle, CheckCircle } from "lucide-react";
import RequireAdmin from "./components/RequireAdmin";
import LoginMember from "./pages/LoginMember";
import UpdateService from "./pages/UpdateService";
import CreateService from "./pages/CreateService";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Salon = lazy(() => import("./pages/Salon"));
const SalonInformations = lazy(() => import("./pages/SalonInformations"));
const SalonAvailabilities = lazy(() => import("./pages/SalonAvailabilities"));
const SalonServices = lazy(() => import("./pages/SalonServices"));
const SalonMembers = lazy(() => import("./pages/SalonMembers"));
const MemberInformations = lazy(() => import("./pages/MemberInformations"));
const MemberServices = lazy(() => import("./pages/MemberServices"));
const SalonPayment = lazy(() => import("./pages/SalonPayment"));

export default function App() {
  return (
    <>
      <Routes>
        {/* auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="loginMember" element={<LoginMember />} />
        </Route>

        {/* protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route
                path="/"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <Dashboard />
                  </Suspense>
                }
              />
              <Route element={<RequireAdmin />}>
                <Route
                  path="salon"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Salon />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/informations"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SalonInformations />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/availabilities"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SalonAvailabilities />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/services"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SalonServices />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/services/:serviceId"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <UpdateService />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/services/create-service"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <CreateService />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/members"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SalonMembers />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/members/:id/informations"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberInformations />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/members/:id/availabilities"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SalonAvailabilities />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/members/:id/services"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <MemberServices />
                    </Suspense>
                  }
                />
                <Route
                  path="salon/payment"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SalonPayment />
                    </Suspense>
                  }
                />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* error routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster
        position="top-right"
        icons={{
          success: <CheckCircle />,
          error: <AlertCircle />,
        }}
        toastOptions={{
          style: {
            display: "flex",
            gap: "2em",
            whiteSpace: "pre-line",
          },
          classNames: {
            error: "bg-destructive text-light",
            success: "bg-success text-light",
          },
        }}
      />
    </>
  );
}

const PageLoader = () => (
  <div className="w-screen h-screen grid place-items-center bg-light">
    <img src={logo} alt="Logo" className="w-20 h-20 animate-spin" />
  </div>
);
