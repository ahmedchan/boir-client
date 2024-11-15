/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from "react"

const RegisterContext = createContext(null)

export const initialFormState = {
  profileRoleId: "",
  firstName: "",
  lastName: "",
  email: "",
  mobilePhone: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  contactFirstName: "",
  contactLastName: "",
  address1: "",
  address2: "",
  city: "",
  stateCodeId: "",
  countryCodeId: "",
  postalCode: "",
  companyPhone: "",
  authUser: "t"
}

const RegisterProvider = ({ children }) => {
  const [state, setState] = useState({
    currentStep: 1,
    form: initialFormState
  })

  return (
    <RegisterContext.Provider value={{ state, setState }}>
      {children}
    </RegisterContext.Provider>
  )
}

export const useRegisterForm = () => {
  const context = useContext(RegisterContext)
  if (!context) {
    console.warn("unable to inject hook outside provider!")
  }
  return context
}

export default RegisterProvider
