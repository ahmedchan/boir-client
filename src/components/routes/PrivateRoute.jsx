/* eslint-disable react/prop-types */
import { useLocation, Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/providers/AuthProvider"

const PrivateRoute = ({ allowedRoles }) => {
  const { auth } = useAuth()
  const location = useLocation()

  return allowedRoles.includes(auth?.user?.profileRoleId) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="auth/login" state={{ from: location }} replace />
  )
}

export default PrivateRoute
