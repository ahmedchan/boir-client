import React from "react"

const RegistrationProfileStep = ({
  registrationData,
  handleChange,
  nextStep
}) => {
  console.log("Profile Data")
  console.log(registrationData)
  return (
    <>
      <h5>Profile Information</h5>
      <div className="form-group mb-3">
        <label htmlFor="firstName" className="form-label">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          className="form-control"
          required
          value={registrationData.firstName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="lastName" className="form-label">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          className="form-control"
          required
          value={registrationData.lastName}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="form-control"
          required
          value={registrationData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="mobilePhone" className="form-label">
          Phone Number
        </label>
        <input
          type="text"
          name="mobilePhone"
          className="form-control"
          required
          value={registrationData.mobilePhone}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="form-control"
          required
          value={registrationData.password}
          onChange={handleChange}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-3 d-grid">
        <button className="btn btn-primary" onClick={nextStep}>
          Next
        </button>
      </div>
    </>
  )
}

export default RegistrationProfileStep
