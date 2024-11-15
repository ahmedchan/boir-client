import { useState, lazy, Suspense } from "react"
import {
  Link,
  useNavigate,
  Navigate,
  createSearchParams
} from "react-router-dom"
import { ProfileRole } from "@/enums"
import {
  Form,
  Button,
  FloatingLabel,
  Modal,
  Card,
  Alert,
  Spinner
} from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAuth } from "@/providers/AuthProvider"
import { useLoginMutation } from "@/services/auth.service"
import { getDefaultRouteForUserRole } from "@/utility/utils"
const ConfirmForgetPassword = lazy(() => import("./ConfirmForgetPassword"))

// Yup schema for form validation
const schema = yup.object().shape({
  email: yup.string().email().required("Email field is required!"),
  password: yup.string().required("Password field is required!")
})

const LoginPage = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  // state
  const [serverError, setServerError] = useState("")
  const [show, setShow] = useState(false)
  // api
  const [login, { isLoading: isSubmitting }] = useLoginMutation()
  // form
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data) => {
    try {
      const resp = await login(data).unwrap()
      const { profile } = resp

      if (resp.verified === true) {
        window.localStorage.setItem("password", data.password)
        navigate({
          pathname: "/auth/verify-login",
          search: createSearchParams({
            email: profile.email,
            verified: true,
            unConfirmedEmail: false
          }).toString(),
          replace: true
        })
      } 
    } catch (error) {
      if (error?.status === 401) {
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
    <div className="login-page">
      <Card>
        <Card.Body className="round-xl">
          <div className="px-2 pt-3 pb-4">
            <div className="mb-4 text-center">
              <h4 className="mb-3 ">Sign In</h4>
              <p className="mb-1 text-muted">
                Existing users, please sign in with your account profile
                credentials.
              </p>
            </div>

            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
              <FloatingLabel
                controlId="inputEmail_control"
                label="Email address"
                className="mb-3"
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="email"
                      placeholder="Email..."
                      isInvalid={!!errors.email}
                      required
                    />
                  )}
                />
                {errors.email && (
                  <div className="invalid">{errors.email.message}</div>
                )}
              </FloatingLabel>

              <FloatingLabel
                controlId="password_control"
                label="Password"
                className="mb-3"
              >
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="password"
                      placeholder="********"
                      isInvalid={!!errors.password}
                      required
                    />
                  )}
                />
                {errors.password && (
                  <div className="invalid">{errors.password.message}</div>
                )}
              </FloatingLabel>

              <div
                className="d-flex justify-content-end  mb-3"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setShow(true)}
              >
                Forget your Password?
              </div>

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
                  to={`/auth/register/${ProfileRole.AGENCY}`}
                  variant="dark"
                  disabled={isSubmitting}
                >
                  Register Agency / CPA Account
                </Button>
                <Button
                  as={Link}
                  to={`/auth/register/${ProfileRole.REGULAR_CLIENT}`}
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  Register Corporate Account
                </Button>
                <Link
                  to={"/pricing"}
                  className="text-muted text-center my-2 mb-0"
                >
                  More Info and Pricing
                </Link>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Body>
          <Suspense
            fallback={
              <div className="d-flex align-items-center justify-content-center">
                <Spinner />
              </div>
            }
          >
            <ConfirmForgetPassword onClose={() => setShow(false)} />
          </Suspense>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default LoginPage
