import { lazy, Suspense } from "react"
import { Routes, Route, Outlet } from "react-router-dom"
import FilingFormProvider from "@/providers/FilingFormProvider"
//enums
import { ProfileRole } from "@/enums"
import { Spinner } from "react-bootstrap"
// private routes
import PrivateRoute from "@/components/routes/PrivateRoute"
// layout routes
const PublicMainLayout = lazy(() => import("@/layouts/PublicMainLayout"))
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"))
const EmptyLayout = lazy(() => import("@/layouts/EmptyLayout"))
// auth routes
import RegisterProvider from "@/providers/RegisterProvider"
const RegistrationPage = lazy(() => import("@/pages/auth/RegistrationPage"))
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"))
const LoginOtp = lazy(() => import("@/pages/auth/LoginOtp"))
// public routes
const ClientData = lazy(() => import("@/pages/clients/ClientData"))
const AddFiling = lazy(() => import("@/pages/clients/addFiling"))
const Compliation = lazy(() => import("@/components/payment/Compliation"))
const ForgetPassOtp = lazy(() => import("@/pages/auth/ForgetPassOtp"))
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"))

// not found
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))
const Unauthorized = lazy(() => import("@/pages/Unauthorized"))

const SuspenseLayout = () => (
  <Suspense fallback={<Spinner />}>
    <Outlet />
  </Suspense>
)

const LoadingRouteSpinner = () => (
  <div className="d-flex p-4 justify-content-center align-items-center">
    <Spinner />
  </div>
)

const App = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<PublicMainLayout />}>
        <Route element={<SuspenseLayout />}>
          {/* <Route element={<PrivateRoute allowedRoles={[ProfileRole.REGULAR_CLIENT, ProfileRole.AGENCY]} />}> */}
          <Route
            path="clients/:Clientid"
            element={
              <Suspense fallback={<Spinner />}>
                <ClientData />
              </Suspense>
            }
          />
          {/* </Route> */}

          {/* <Route element={<PrivateRoute allowedRoles={[ProfileRole.REGULAR_CLIENT, ProfileRole.AGENCY]} />}> */}
          <Route
            path="clients/:Clientid/addFiling/:reportId"
            element={
              <Suspense fallback={<LoadingRouteSpinner />}>
                <FilingFormProvider>
                  <AddFiling />
                </FilingFormProvider>
              </Suspense>
            }
          />
          {/* </Route> */}
        </Route>
      </Route>

      <Route element={<EmptyLayout />}>
        <Route element={<PrivateRoute allowedRoles={[ProfileRole.AGENCY]} />}>
          <Route
            path="compliation"
            element={
              <Suspense fallback={<LoadingRouteSpinner />}>
                <Compliation />
              </Suspense>
            }
          />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        {/* unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route
          path={`register/3`}
          element={
            <RegisterProvider>
              <Suspense fallback={<LoadingRouteSpinner />}>
                <RegistrationPage />
              </Suspense>
            </RegisterProvider>
          }
        />

        {/* login */}
        <Route
          path="login"
          element={
            <Suspense fallback={<Spinner />}>
              <LoginPage />
            </Suspense>
          }
        />

        <Route
          path="verify-email"
          element={
            <Suspense fallback={<LoadingRouteSpinner />}>
              <ForgetPassOtp />
            </Suspense>
          }
        />

        <Route
          path="reset-password"
          element={
            <Suspense fallback={<LoadingRouteSpinner />}>
              <ResetPassword />
            </Suspense>
          }
        />

        <Route
          path="verify-login"
          element={
            <Suspense fallback={<LoadingRouteSpinner />}>
              <LoginOtp />
            </Suspense>
          }
        />
      </Route>

      {/* not found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
