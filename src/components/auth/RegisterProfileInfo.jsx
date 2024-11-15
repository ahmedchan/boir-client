/* eslint-disable react/prop-types */
// import React from "react"
// import { ProfileRole } from "../enums"
import { Form, Button, Stack, Row, Col, Alert } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useRegisterForm } from "@/providers/RegisterProvider"

// Yup schema for form validation
const schema = yup.object().shape({
  firstName: yup.string().required("First name  is required"),
  lastName: yup.string().required("Last name  is required"),
  email: yup.string().email().required("Email address  is required"),
  mobilePhone: yup.string().required("Phone number is required!"),
  password: yup
    .string()
    .required("Password field is required!")
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contains number,letter,uppercase and special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password")],
      "Password confirmation does not match your entered password!"
    )
    .required("Confirm password field is required!")
})

const RegisterProfileInfo = ({ profileRoleType }) => {
  const { state, setState } = useRegisterForm()
  // form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      profileRoleId: profileRoleType,
      authUser: "t",
      firstName: state.form.firstName,
      lastName: state.form.lastName,
      email: state.form.email,
      mobilePhone: state.form.mobilePhone,
      password: state.form.password,
      confirmPassword: state.form.confirmPassword
    }
  })

  const onSubmit = (data) => {
    setState((prev) => ({
      ...prev,
      currentStep: 2,
      form: { ...prev.form, ...data }
    }))
  }

  return (
    <div className="py-3">
      <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm={12} md={6}>
            <Form.Group controlId={`firstName_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> First Name
              </Form.Label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => <Form.Control {...field} />}
              />
              {errors?.firstName && (
                <div className="invalid">{errors?.firstName.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId={`lastName_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Last Name
              </Form.Label>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => <Form.Control {...field} />}
              />
              {errors?.lastName && (
                <div className="invalid">{errors?.lastName.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId={`email_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Email
              </Form.Label>
              <Controller
                name="email"
                type="email"
                control={control}
                render={({ field }) => <Form.Control {...field} />}
              />
              {errors?.email && (
                <div className="invalid">{errors?.email.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId={`phone_num_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Phone Number
              </Form.Label>
              <Controller
                name="mobilePhone"
                control={control}
                render={({ field }) => <Form.Control {...field} />}
              />
              {errors?.mobilePhone && (
                <div className="invalid">{errors?.mobilePhone.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId={`password_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Password
              </Form.Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Control type="password" {...field} />
                )}
              />
              {errors?.password && (
                <div className="invalid">{errors?.password.message}</div>
              )}
            </Form.Group>
          </Col>
          <Col sm={12} md={6}>
            <Form.Group controlId={`confirmPassword_control`} className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Confirm Password
              </Form.Label>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Form.Control type="password" {...field} />
                )}
              />
              {errors?.confirmPassword && (
                <div className="invalid">{errors?.confirmPassword.message}</div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-1">
          <Alert variant="info">
            Password must be 8 or more characters, Contains letters, numbers and
            at least one spacial character.
          </Alert>
        </div>

        <div className="mt-3">
          <hr />
          <Stack direction="horizontal" gap={3} className="pt-3">
            <Button variant="primary" type="submit" className="ms-auto">
              <span className="px-4">Next</span>
            </Button>
          </Stack>
        </div>
      </Form>
    </div>
  )
}

export default RegisterProfileInfo
