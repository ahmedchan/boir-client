/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect } from "react"

const FilingFormContext = createContext(null)

export const initialFormState = {
  filingInformation: {
    filingDateText: new Date().toLocaleDateString()
  },
  // step 2
  reportingCompany: {
    isExistingReportingCompany: false
  },
  isRequestingId: false,
  isForeignPooledInvestmentVehicle: false,
  rc_legalName: "",
  rc_tradeName: [],
  rc_idType: "",
  rc_idNumber: "",
  rc_country: "",
  rc_jurisdiction: "",
  rc_company_address: "",
  rc_company_city: "",
  rc_company_country: "",
  rc_company_state: "",
  rc_company_zipcode: "",
  // 3
  isExistingReportingCompany: false,
  ca: [
    {
      fincenId: "",
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      dateOfBirth: "",
      // 3
      address: "",
      city: "",
      country: "",
      state: "",
      zip: "",
      //   4
      identificationType: "",
      identificationId: "",
      identification_jurisdiction: "",
      identification_image: undefined
    }
  ],
  bo: [
    {
      // 1
      isParentGuardianInformation: false,
      // 2
      fincenId: "",
      isExemptEntity: false,
      // 3
      firstName: "",
      lastName: "",
      middleName: "",
      suffix: "",
      dateOfBirth: new Date(),
      // 3
      address: "",
      city: "",
      country: "",
      state: "",
      zip: "",
      // 4
      identificationType: "",
      identificationId: "",
      identification_jurisdiction: "",
      identification_image: undefined
    }
  ],
  // submit states
  email: "",
  confirmEmail: "",
  firstName: "",
  lastName: "",
  certifyCB: ""
}

function countProperties(obj) {
  let count = 0

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      count++

      // If the property is an object or array, recurse into it
      if (typeof obj[key] === "object" && obj[key] !== null) {
        count += countProperties(obj[key])
      }
    }
  }

  return count
}

function countFilledProperties(obj) {
  let count = 0

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      // Check for filled fields, depending on their type
      if (typeof value === "object" && value !== null) {
        count += countFilledProperties(value) // Recurse into nested objects
      } else if (Array.isArray(value)) {
        count += value.filter((v) => v !== "").length
      } else if (value !== "" && value !== null) {
        count++ // Increment if the field is not empty
      }
    }
  }

  return count
}

function calculateFormProgress(formData) {
  const totalFields = countProperties(formData)
  const filledFields = countFilledProperties(formData)

  // Return percentage of completion
  return (filledFields / totalFields) * 100
}

const FilingFormProvider = ({ children }) => {
  const [state, setState] = useState({
    currentStep: 1,
    form: initialFormState
  })
  const [completedProgress, setCompletedProgress] = useState(0)

  useEffect(() => {
    const completedFields = calculateFormProgress(state.form)
    if (completedFields) {
      setCompletedProgress(completedFields.toFixed(0))
    }
  }, [state.form])

  console.log("form => ", state.form)

  const saveAsDraft = async () => {
    console.log("saving data here")
    console.log("form => ", state.form)
  }

  return (
    <FilingFormContext.Provider value={{ state, setState, completedProgress, saveAsDraft }}>
      {children}
    </FilingFormContext.Provider>
  )
}

export const useFilingForm = () => {
  const context = useContext(FilingFormContext)
  if (!context) {
    console.warn("unable to inject hook outside provider!")
  }
  return context
}

export default FilingFormProvider
