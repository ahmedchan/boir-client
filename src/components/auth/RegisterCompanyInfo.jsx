/* eslint-disable react/prop-types */
import { useState } from "react"
import { Form, Button, Stack, Row, Col, Alert, Spinner } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useRegisterForm } from "@/providers/RegisterProvider"
import { useRegisterMutation } from "@/services/auth.service"
import AmericanCountrySelect from "@/components/AmericanCountrySelect"
import StateSelect from "@/components/StateSelect"
import { useNavigate, createSearchParams } from "react-router-dom"

// Yup schema for form validation
const schema = yup.object().shape({
  companyName: yup.string().required("Company name is required"),
  companyPhone: yup.string().required("company phone is required"),
  contactFirstName: yup.string().required("Last name  is required"),
  contactLastName: yup.string().required("Last name  is required"),
  address1: yup.string().required("Address  is required"),
  city: yup.string().required("City field is required!"),
  stateCodeId: yup.string().required("State field is required!"),
  countryCodeId: yup.string().required("Country field is required!"),
  postalCode: yup.string().required("Postal Code field is required!")
})

const RegisterCompanyInfo = () => {
  const navigate = useNavigate()
  const { state, setState } = useRegisterForm()
  // states
  const [serverError, setServerError] = useState(null)
  // api
  const [register, { isLoading: isRegistering }] = useRegisterMutation()
  // form
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: state.form.companyName,
      companyPhone: state.form.companyPhone,
      contactFirstName: state.form.contactFirstName,
      contactLastName: state.form.contactLastName,
      address1: state.form.address1,
      address2: state.form.address2,
      city: state.form.city,
      stateCodeId: state.form.stateCodeId,
      countryCodeId: state.form.countryCodeId,
      postalCode: state.form.postalCode
    }
  })

  const bindChangeToProvider = (name, value) => {
    setState((prev) => ({
      ...prev,
      form: { ...prev.form, [name]: value }
    }))
  }

  const onSubmit = async () => {
    try {
      const resp = await register(state.form).unwrap()
      navigate({
        pathname: "/auth/verify",
        search: createSearchParams({
          email: resp.otp.email
        }).toString(),
        replace: true
      })
    } catch (error) {
      if (error?.data) {
        setServerError(error?.data)
      } else {
        setServerError("Something went wrong, please try again later.")
      }
    }
  }

  return (
    <div className="py-3">
      <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm={12}>
            <Form.Group controlId={`companyName_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Company Name
              </Form.Label>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.companyName && (
                <div className="invalid">{errors?.companyName.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12}>
            <Form.Group controlId={`companyPhone_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Company Phone
              </Form.Label>
              <Controller
                name="companyPhone"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.companyPhone && (
                <div className="invalid">{errors?.companyPhone.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId={`contactFirstName_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Contact First Name
              </Form.Label>
              <Controller
                name="contactFirstName"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.contactFirstName && (
                <div className="invalid">
                  {errors?.contactFirstName.message}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId={`contactLastName_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Contact Last Name
              </Form.Label>
              <Controller
                name="contactLastName"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.contactLastName && (
                <div className="invalid">{errors?.contactLastName.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12}>
            <Form.Group controlId={`address1_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Address{" "}
                <span className="text-muted">(Main)</span>
              </Form.Label>
              <Controller
                name="address1"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.address1 && (
                <div className="invalid">{errors?.address1.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12}>
            <Form.Group controlId={`address2_control`} className="mb-3">
              <Form.Label>
                Another Address <span className="text-muted">(Optional)</span>
              </Form.Label>
              <Controller
                name="address2"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId={`countryCodeId_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Country
              </Form.Label>
              <Controller
                name="countryCodeId"
                control={control}
                render={({ field }) => (
                  <AmericanCountrySelect
                    name={field.name}
                    required={true}
                    isInvalid={!!errors?.countryCodeId}
                    value={field.value}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.countryCodeId && (
                <div className="invalid">{errors?.countryCodeId.message}</div>
              )}
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId={`stateCodeId_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> State
              </Form.Label>
              <Controller
                name="stateCodeId"
                control={control}
                render={({ field }) => (
                  <StateSelect
                    name={field.name}
                    required={true}
                    countryId={watch("countryCodeId")}
                    isInvalid={!!errors?.stateCodeId}
                    value={field.value}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.stateCodeId && (
                <div className="invalid">{errors?.stateCodeId.message}</div>
              )}
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId={`city_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> City
              </Form.Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.city && (
                <div className="invalid">{errors?.city.message}</div>
              )}
            </Form.Group>
          </Col>

          <Col sm={12} md={6}>
            <Form.Group controlId={`postalCode_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Postal Code
              </Form.Label>
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    onChange={(e) => {
                      const { name, value } = e.target
                      bindChangeToProvider(name, value)
                      field.onChange(value)
                    }}
                  />
                )}
              />
              {errors?.postalCode && (
                <div className="invalid">{errors?.postalCode.message}</div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {serverError && (
          <div className="mt-3">
            <Alert variant="danger">{serverError}</Alert>
          </div>
        )}

        <div className="mt-3">
          <hr />
          <Stack direction="horizontal" gap={3} className="pt-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setState((prev) => ({ ...prev, currentStep: 1 }))}
            >
              <span className="px-2">prevoius</span>
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ms-auto"
              disabled={isRegistering}
            >
              {isRegistering && (
                <>
                  <Spinner size="sm" /> &nbsp;
                </>
              )}
              <span className="px-4">Submit</span>
            </Button>
          </Stack>
        </div>
      </Form>
    </div>
  )
}

export default RegisterCompanyInfo
