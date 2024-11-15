import React from 'react'

const RegistrationCompanyFStep = ({ registrationData, handleChange, prevStep, handleSubmit }) => {
  return (
<>
<h5>Company Information</h5>
<div className="form-group mb-3">
            <label htmlFor="companyName" className="form-label">Company Name</label>
            <input type="text" name="companyName" className="form-control"  required value={registrationData.companyName}
            onChange={handleChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="contactFirstName" className="form-label">Contact First Name</label>
            <input type="text" name="contactFirstName" className="form-control"  required value={registrationData.contactFirstName}
            onChange={handleChange}/> 
          </div>
          <div className="form-group mb-3">
            <label htmlFor="contactLastName" className="form-label">Contact Last Name</label>
            <input type="text" name="contactLastName" className="form-control"  required value={registrationData.contactLastName}
            onChange={handleChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="address1" className="form-label">Address 1</label>
            <input type="text" name="address1" className="form-control"  required value={registrationData.address1}
            onChange={handleChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="address2" className="form-label">Address 2 <span className='text-muted'>(optional)</span></label>
            <input type="text" name="address2" className="form-control"   value={registrationData.address2}
            onChange={handleChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <input type="text" name="city" className="form-control"  required value={registrationData.city}
            onChange={handleChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="stateCode" className="form-label">State Code</label>
            <input type="text" name="stateCode" className="form-control"  required value={registrationData.stateCode}
            onChange={handleChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="province" className="form-label">Province</label>
            <input type="text" name="province" className="form-control"  required value={registrationData.province}
            onChange={handleChange}/>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="postalCode" className="form-label">Postal Code</label>
            <input type="text" name="postalCode" className="form-control"  required value={registrationData.postalCode}
            onChange={handleChange}/>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="companyPhone" className="form-label">Company Phone</label>
            <input type="text" name="companyPhone" className="form-control"  required value={registrationData.companyPhone}
            onChange={handleChange}/>
          </div>

          {/* <div className="form-group mb-3">
            <label htmlFor="authUser" className="form-label">Auth User</label>
            <input type="text" name="authUser" className="form-control"  required value={registrationData.authUser}
            onChange={handleChange}/>
          </div> */}

          <div className="form-group mb-3 d-grid">
            <button className="btn btn-secondary" onClick={prevStep}>Back</button>
          </div>
</>

)
}

export default RegistrationCompanyFStep