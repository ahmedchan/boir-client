import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ApiProvider } from "@reduxjs/toolkit/query/react"
import baseApi from "@/services/baseApi"
import AuthProvider from "@/providers/AuthProvider"
import { Toaster } from "react-hot-toast"
import { Spinner } from "react-bootstrap"
// styles
import "@/styles/main.scss"
// lazy app
const LazyApp = lazy(() => import("./App"))

const LoadingApp = () => (
  <div className="d-flex justify-content-center align-items-center vh-100 vw-100">
    <Spinner animation="border" size="xl" />
  </div>
)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ApiProvider api={baseApi}>
        <AuthProvider>
          <Routes>
            <Route
              path="/*"
              element={
                <Suspense fallback={<LoadingApp />}>
                  <LazyApp />
                </Suspense>
              }
            />
          </Routes>
        </AuthProvider>

        <Toaster
          position="top-center"
          gutter={10}
          toastOptions={{
            // className: className,
            duration: 5000,
            success: {
              iconTheme: {
                primary: "var(--primary)",
                secondary: "var(--secondary)"
              }
            }
          }}
        />
      </ApiProvider>
    </BrowserRouter>
  </StrictMode>
)
