import { useState } from "react"
import {
  Link,
  useNavigate,
  Navigate,
  useSearchParams
} from "react-router-dom"
import {
  Form,
  Button,
  FloatingLabel,
  Card,
  Alert,
  Spinner
} from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAuth } from "@/providers/AuthProvider"
import { useResetPasswordMutation } from "@/services/auth.service"
import { getDefaultRouteForUserRole } from "@/utility/utils"
import toast from "react-hot-toast"

// Yup schema for form validation
const schema = yup.object().shape({
  email: yup.string().email().required("No email address provided!"),
  newPassword: yup
    .string()
    .required("Password field is required!")
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must contains number,letter,uppercase and special character"
    ),
  repeatedPassword: yup
    .string()
    .oneOf(
      [yup.ref("newPassword")],
      "Password confirmation does not match your entered password!"
    )
    .required("Confirm password field is required!"),
  otp: yup.string().required("No otp provided!")
})

const ResetPassword = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const otp = searchParams.get("otp")
  // state
  const [serverError, setServerError] = useState("")
  // api
  const [resetPassword, { isLoading: isSubmitting }] =
    useResetPasswordMutation()
  // form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: email,
      newPassword: "",
      otp: otp
    }
  })

  const onSubmit = async (data) => {
    try {
      const resp = await resetPassword(data).unwrap()
      // const { profile, token } = resp

      if (resp?.verified === true) {
        toast.success(`Your new password has been reset successfully.`)
        navigate({
          pathname: "/auth/login",
          replace: true
        })
      }
    } catch (error) {
      if (error?.data) {
        setServerError(error?.data)
      } else {
        setServerError("Something went wrong, please try again later.")
      }
    }
  }

  if (auth && auth?.accessToken && auth?.user) {
    const navigateTo = getDefaultRouteForUserRole(auth)
    return <Navigate to={navigateTo} replace={true} />
  }

  return (
    <div className="reset-password">
      <Card>
        <Card.Body className="round-xl">
          <div className="px-2 pt-3 pb-4">
            <div className="mb-4 text-center">
              <h4 className="mb-3 ">Reset Pasword</h4>
            </div>

            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <FloatingLabel
                controlId="newPassword_control"
                label="New Password"
                className="mb-3"
              >
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="password"
                      placeholder="********"
                      isInvalid={!!errors.newPassword}
                      required
                    />
                  )}
                />
                {errors.newPassword && (
                  <div className="invalid">{errors.newPassword.message}</div>
                )}
              </FloatingLabel>

              <FloatingLabel
                controlId="repeat_password_control"
                label="Confirm New Password"
                className="mb-3"
              >
                <Controller
                  name="repeatedPassword"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="password"
                      placeholder="********"
                      isInvalid={!!errors.repeatedPassword}
                      required
                    />
                  )}
                />
                {errors.repeatedPassword && (
                  <div className="invalid">
                    {errors.repeatedPassword.message}
                  </div>
                )}
              </FloatingLabel>

              {serverError && (
                <Alert variant="danger" className="my-3">
                  {serverError}
                </Alert>
              )}

              <Form.Group
                className="mb-3 d-grid"
                controlId={`password_control`}
              >
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <>
                      <Spinner size="sm" />
                      &nbsp;
                    </>
                  )}
                  Sign In
                </Button>
              </Form.Group>
            </Form>
            <hr className="" />
            <div className="d-grid mx-auto">
              <p className="text-muted text-center">New Users</p>
              <div className="d-flex flex-column gap-2">
                <Button
                  as={Link}
                  to={`/auth/login`}
                  variant="dark"
                  disabled={isSubmitting}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ResetPassword
