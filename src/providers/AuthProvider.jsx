/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    const user = window.localStorage.getItem("user")
    const token = window.localStorage.getItem("accessToken")

    if (user && token) {
      setAuth({ user: JSON.parse(user), accessToken: token })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    return console.warning("Provider no found!")
  }
  return context
}

export default AuthProvider
