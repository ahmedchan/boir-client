import { useState, useEffect } from "react"
import { useCreatePaymentIntendMutation } from "@/services/reports.sevice"
// strips scrips
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Spinner, Button, Alert } from "react-bootstrap"
// PaymentForm
import CheckoutForm from "./CheckoutForm"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const appearance = {
  // theme: "flat",
  variables: {
    colorPrimary: "#135D66"
    // colorText: "rgb(84, 51, 255)",
    // colorTextSecondary: "rgb(28, 198, 255)", // info icon color
    // // fontSizeBase: "16px",
    // // spacingUnit: "10px",
    // fontWeightMedium: "bold",
    // fontFamily: "Ideal Sans, system-ui, sans-serif"
  }
}

const StripeContainer = ({ invoiceIds, closeModal, amount, pt }) => {
  const [clientSecret, setClientSecret] = useState("")
  const [serverError, setServerError] = useState(null)

  // api
  const [createPaymentIntend, { isLoading: isPosting }] =
    useCreatePaymentIntendMutation()

  useEffect(() => {
    async function appyCreateIntend() {
      try {
        const resp = await createPaymentIntend({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card", "us_bank_account"]
        }).unwrap()
        const { clientSecret } = resp
        setClientSecret(clientSecret)
      } catch (error) {
        if (error?.code === "ERR_NETWORK") {
          setServerError(`${error?.message}, plese check your connection!`)
        } else if (error?.data) {
          setServerError(error?.data?.message)
        } else {
          setServerError("Something went wrong, please try again later.")
        }
      }
    }

    appyCreateIntend()
  }, [])

  if (isPosting) {
    return (
      <div className="w-100 text-center">
        <Spinner />
      </div>
    )
  }

  if (serverError) {
    return (
      <Alert variant="danger" className="m-0">
        <div>{serverError}</div>
        <div className="mt-2">
          <Button
            variant="outline-danger"
            type="button"
            role="dismiss"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
      </Alert>
    )
  }

  return stripePromise && clientSecret ? (
    <div className="app-wrapper">
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance, loader: "auto" }}
      >
        <CheckoutForm closeModal={closeModal} invoiceIds={invoiceIds} pt={pt} />
      </Elements>
    </div>
  ) : null
}

export default StripeContainer
