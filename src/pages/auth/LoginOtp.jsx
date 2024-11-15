import { useState, useEffect, useCallback, useRef } from "react"
import toast from "react-hot-toast"
import {
  useNavigate,
  useSearchParams,
  Navigate,
  createSearchParams
} from "react-router-dom"
//api
import {
  useLogin2FAMutation,
  useResendOtpCodeMutation
} from "@/services/auth.service"
import { Alert, Button, Spinner } from "react-bootstrap"
// local
import OtpInput from "./OtpInput"
import CountdownTimer from "@/components/CountdownTimer"
import { getDefaultRouteForUserRole } from "@/utility/utils"
import { ProfileStatus } from "@/enums"
import { useAuth } from "@/providers/AuthProvider"

const LoginOtp = () => {
  const { auth, setAuth } = useAuth()
  let [searchParams] = useSearchParams()
  const countdownRef = useRef(null)
  const email = searchParams.get("email")
  const navigate = useNavigate()

  //states
  const [otp, setOtp] = useState("")
  const [showResend, setShowResend] = useState(false)
  const [serverError, setServerError] = useState(null)

  //api
  const [login2FA, { isLoading: isLoggingin }] = useLogin2FAMutation()
  const [resendOtpCode, { isLoading: isResending }] = useResendOtpCodeMutation()

  const onChange = (value) => setOtp(value)

  const verifyOtpCode = useCallback(async () => {
    try {
      const resp = await login2FA({
        otp: otp,
        email: email,
        password: window.localStorage.getItem("password")
      }).unwrap()

      window.localStorage.removeItem("password")

      const { profile, token } = resp

      if (profile.profileStatusId === ProfileStatus.NEW_UNCONFIRMED_ACCOUNT) {
        navigate({
          pathname: "/auth/verify",
          search: createSearchParams({
            email: profile.email,
            unConfirmedEmail: true
          }).toString(),
          replace: true
        })
      } else if (profile.profileStatusId === ProfileStatus.ACCOUNT_CONFIRMED) {
        window.localStorage.setItem("accessToken", token)
        window.localStorage.setItem("user", JSON.stringify(profile))
        setAuth({ user: profile, accessToken: token })
        setTimeout(() => {
          const navigateTo = getDefaultRouteForUserRole({ user: profile })
          navigate(navigateTo, { replace: true })
        }, 0)
      }
    } catch (err) {
      setOtp("")
      if (err?.data) {
        setServerError(err?.data)
      } else {
        setServerError("Something went wrong, please request another code.")
      }
    }
  }, [otp, login2FA, email, navigate])

  const handleResendOtp = async () => {
    setServerError(null)
    setOtp("")

    try {
      const resp = await resendOtpCode({ email: email }).unwrap()
      if (countdownRef.current) {
        countdownRef.current.resetTimer() // Call resetTimer from parent
      }
      toast.success(`Verification code sent to ${resp.email}.`)
      setShowResend(false)
    } catch (error) {
      if (error?.data) {
        setServerError(error?.data)
      } else {
        setServerError("Something went wrong, please try again later.")
      }
    }
  }

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtpCode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  if (auth && auth?.accessToken && auth?.user) {
    const navigateTo = getDefaultRouteForUserRole(auth)
    return <Navigate to={navigateTo} replace={true} />
  }

  return (
    <div className="d-flex align-items-center flex-column gap-2 text-center">
      {isLoggingin ? (
        <Spinner size="lg" />
      ) : (
        <>
          <div className="d-flex align-items-center flex-column gap-2 text-center text-white">
            <div className="text-mutedColor text-sm">
              A verification code was sent to your email address. Please type
              the code and click the Verify button.
            </div>
          </div>

          <div className="my-2">
            <CountdownTimer
              ref={countdownRef}
              minutes={5}
              onCountdownCompleted={() => setShowResend(true)}
            />
          </div>

          <div className="mt-10 mb-4">
            {serverError && (
              <Alert variant="danger" className="mb-5">
                {serverError}
              </Alert>
            )}
            <div className="mt-3 d-flex align-items-center gap-1">
              <OtpInput
                value={otp}
                disabled={isLoggingin}
                valueLength={6}
                onChange={onChange}
              />
            </div>

            {showResend && (
              <div className="mt-4">
                <Alert variant="info" className="mb-5">
                  If you didn&apos;t recived verification code, <br />
                  please request for another code.{" "}
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isResending}
                    onClick={handleResendOtp}
                  >
                    {isResending && (
                      <>
                        <Spinner size="sm" />
                        &nbsp;
                      </>
                    )}{" "}
                    Resend
                  </Button>
                </Alert>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default LoginOtp
