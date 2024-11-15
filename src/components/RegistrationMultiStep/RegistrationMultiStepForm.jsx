import React from "react"
import { useState } from "react"
import RegistrationProfileStep from "./RegistrationProfileStep.jsx"
import RegistrationCompanyFStep from "./RegistrationCompanyFStep.jsx"

const RegistrationMultiStepForm = ({ profileRoleType }) => {
  //Steps
  const [step, setStep] = useState(1)

  //Form data
  const [registrationData, setRegistrationData] = useState({
    profileRoleId: profileRoleType,
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    mobilePhone: "",
    companyName: "",
    contactFirstName: "",
    contactLastName: "",
    address1: "",
    address2: "",
    city: "",
    stateCode: "",
    province: "",
    postalCode: "",
    companyPhone: "",
    authUser: "t"
  })

  //Handle Steps
  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setRegistrationData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Post the data to an API endpoint
    try {
      console.log("Submitting form:", registrationData)
      const response = await fetch(
        "http://localhost:5000/api/Profile/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(registrationData)
        }
      )

      if (response.ok) {
        // Handle success
        console.log("Form submitted successfully")
        //redirect to login page
        window.location.href = "/verify"
      } else {
        // Handle errors
        console.error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <>
      <form className="col-lg-10 col-11 mx-auto" onSubmit={handleSubmit}>
        {step === 1 && (
          <RegistrationProfileStep
            registrationData={registrationData}
            handleChange={handleChange}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <RegistrationCompanyFStep
            registrationData={registrationData}
            handleChange={handleChange}
            prevStep={prevStep}
          />
        )}

        {/* Show Submit on final Step */}
        {step === 2 && (
          <div className="form-group mb-3 d-grid">
            <input type="submit" class="btn btn-success" value="Submit" />
          </div>
        )}
      </form>
    </>
  )
}

export default RegistrationMultiStepForm
