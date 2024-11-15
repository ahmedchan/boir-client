import { useState, useEffect } from "react"
import { Navigate, useNavigate, useLocation } from "react-router-dom"
import { MdOutlineCheckCircle } from "react-icons/md"
import { IoMdCloseCircleOutline } from "react-icons/io"
import { Button, Spinner } from "react-bootstrap"
import { useAuth } from "@/providers/AuthProvider"
import { getDefaultRouteForUserRole } from "@/utility/utils"
import { loadStripe } from "@stripe/stripe-js"
import { displayDateTime } from "@/utility/utils"
import { useApplyPaymentMutation } from "@/services/reports.sevice"

// Load your Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const CompliationHOC = (Component) => {
  const NewComponent = (props) => {
    const [paymentDetails, setPaymentDetails] = useState(null)
    const query = useQuery()
    const paymentIntent = query.get("payment_intent")
    const clientSecret = query.get("payment_intent_client_secret")
    const pt = query.get("pt")
    // const reportIds = query.get("reports")
    const invoiceIds = query.get("invoices")

    useEffect(() => {
      if (clientSecret) {
        stripePromise.then(async (stripe) => {
          const { paymentIntent } = await stripe.retrievePaymentIntent(
            clientSecret
          )
          if (paymentIntent) {
            setPaymentDetails(paymentIntent)
          }
        })
      }
    }, [clientSecret])

    if (!paymentIntent || !clientSecret) {
      return <Navigate to="/" replace={true} />
    }

    if (!paymentDetails) {
      return (
        <div className="d-flex justify-content-center align-items-center p-3">
          <Spinner />
        </div>
      )
    }

    return (
      <Component
        paymentDetails={paymentDetails}
        pt={pt}
        invoiceIds={invoiceIds.split(",")}
        {...props}
      />
    )
  }

  return NewComponent
}

const Compliation = ({ paymentDetails, invoiceIds, pt }) => {
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()
  const [isPosting, setIsPosting] = useState(true)
  //   api
  const [applyPayment] = useApplyPaymentMutation()

  const handleGoBack = () => {
    const navigateTo = getDefaultRouteForUserRole(auth)
    navigate(navigateTo, { replace: true })
  }

  const renderStatusIcon = (payment) => {
    if (payment && payment.status === "succeeded") {
      return <MdOutlineCheckCircle className="text-primary" size={54} />
    }

    return <IoMdCloseCircleOutline className="text-danger" size={54} />
  }

  const displayAmount = (amount) => {
    const amountInDollars = amount / 100
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amountInDollars)
  }

  const renderContent = (payment) => {
    if (payment && payment.status === "succeeded") {
      return (
        <>
          <h3>Payment Successful.</h3>
          <p className="text-secondary">
            Thank you for completing your secure online payment
          </p>
          <div className="rounded border my-2 w-100">
            <div className="d-flex justify-content-between px-2 py-1">
              <span className="text-secondary">Amount Paied:</span>
              <span>{displayAmount(payment?.amount)}</span>
            </div>
            <div className="d-flex justify-content-between border-top px-2 py-1">
              <span className="text-secondary">Reference:</span>
              <span>{payment?.id}</span>
            </div>
            <div className="d-flex justify-content-between border-top px-2 py-1">
              <span className="text-secondary">Iussed Date:</span>
              <span>
                {displayDateTime({ date: payment?.created, isTimestamp: true })}
              </span>
            </div>
          </div>
        </>
      )
    }

    return (
      <>
        <h3>Payment failed!</h3>
        <p className="text-secondary">
          your last intend payment was failed, please try later!
        </p>
      </>
    )
  }

  useEffect(() => {
    let isMounted = true
    async function postPaymentDetailsToServer() {
      setIsPosting(true)
      try {
        const dataToSend = invoiceIds.map((item) => {
          const date = new Date(paymentDetails.created * 1000)
          return {
            billingInvoiceId: item,
            paymentDate: date.toISOString(),
            transactionID: paymentDetails.id,
            confirmationCode: "string",
            paymentAmount: paymentDetails.amount,
            transactionFee: 0,
            authUser: "string",
            paymentJson: JSON.stringify(paymentDetails),
            billingPaymentId: item
          }
        })
        const res = await applyPayment(dataToSend).unwrap()

        if (res === true && pt === "subscription") {
          setAuth((prev) => ({
            ...prev,
            user: { ...prev.user, agencySubscriptionPaid: 2 }
          }))
          window.localStorage.setItem(
            "user",
            JSON.stringify({ ...auth?.user, agencySubscriptionPaid: 2 })
          )
        }
      } catch (error) {
        console.log("error post details to server => ", error)
      } finally {
        setIsPosting(false)
      }
    }

    if (isMounted && paymentDetails.status === "succeeded") {
      postPaymentDetailsToServer()
    }

    return () => {
      isMounted = false
    }
  }, [])

  return isPosting ? (
    <div className="d-flex justify-content-center align-items-center p-3">
      <Spinner />
    </div>
  ) : (
    <div className="payment-compliation shadow-sm bg-white rounded">
      <div className="payment-compliation_content">
        <div className="status-icon mb-3">
          {renderStatusIcon(paymentDetails)}
        </div>
        {renderContent(paymentDetails)}
        <div className="mt-3">
          <Button variant="primary" onClick={handleGoBack}>
            <span className="px-3">Go Back</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompliationHOC(Compliation)
