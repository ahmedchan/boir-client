import { useState, useEffect, useCallback, useRef } from "react"
import toast from "react-hot-toast"
import { useNavigate, useSearchParams, Navigate } from "react-router-dom"
//api
import {
  useVerifyOtpMutation,
  useResendOtpCodeMutation
} from "@/services/auth.service"
import { Alert, Button, Spinner } from "react-bootstrap"
// local
import OtpInput from "./OtpInput"
import CountdownTimer from "@/components/CountdownTimer"
import { getDefaultRouteForUserRole } from "@/utility/utils"
import { useAuth } from "@/providers/AuthProvider"

const ForgetPassOtp = () => {
  const { auth } = useAuth()
  let [searchParams] = useSearchParams()
  const countdownRef = useRef(null)
  const email = searchParams.get("email")
  const navigate = useNavigate()

  //states
  const [otp, setOtp] = useState("")
  const [showResend, setShowResend] = useState(false)
  const [serverError, setServerError] = useState(null)

  //api
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
  const [resendOtpCode, { isLoading: isResending }] = useResendOtpCodeMutation()

  const onChange = (value) => setOtp(value)

  const verifyOtpCode = useCallback(async () => {
    try {
      const resp = await verifyOtp({
        otp: otp,
        email: email
      }).unwrap()

      if (resp === true) {
        navigate(`/auth/reset-password?email=${email}&otp=${otp}`, {
          replace: true
        })
      }
    } catch (err) {
      setOtp("")
      if (err?.data) {
        setServerError(err?.data)
      } else {
        setServerError("Something went wrong, please request another code.")
      }
    }
  }, [otp, verifyOtp, email, navigate])

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
      console.log("resend otp code error: ", error)
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

  if (!email) {
    return <Navigate to="/" replace={true} />
  }

  return (
    <div className="d-flex align-items-center flex-column gap-2 text-center">
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <div className="d-flex align-items-center flex-column gap-2 text-center text-white">
            <div className="text-mutedColor text-sm">
              A verification code was sent to your email address. Please type
              the code.
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
                disabled={isLoading}
                valueLength={6}
                onChange={onChange}
              />
            </div>

            {showResend && (
              <div className="mt-4">
                <Alert variant="info" className="mb-5">
                  If you didn&apos;t recived a verification code, <br />
                  please request another code.{" "}
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

export default ForgetPassOtp
