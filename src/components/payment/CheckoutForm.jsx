import { useState, useEffect } from "react"
import {
  useStripe,
  useElements,
  PaymentElement
  //   LinkAuthenticationElement
} from "@stripe/react-stripe-js"
import { Button, Stack, Alert } from "react-bootstrap"

const CARD_OPTIONS = {
  //   iconStyle: "solid",
  layout: "tabs" // tabs, 'accordion'

  //   style: {
  //     base: {
  //       iconColor: "green",
  //       color: "#333333",
  //       fontWeight: "bold",
  //       fontFamily: "Arial",
  //       fontSize: "16px",
  //       "::placeholder": {
  //         color: "#cfd7df"
  //       }
  //     },
  //     invalid: {
  //       iconColor: "red",
  //       color: "#ffc7ee"
  //     },
  //     complete: {
  //       color: "#4CAF50", // Green for valid input
  //       iconColor: "#4CAF50" // Green for the card brand icon when valid
  //     },
  //     focus: {
  //       color: "#303238" // Darker color when the field is focused
  //     }
  //   },

  //   defaultValues: {
  //     billingDetails: {
  //       name: "John Doe",
  //       phone: "888-888-8888",
  //       address: {
  //         postal_code: "10001",
  //         country: "US"
  //       }
  //     }
  //   }
}

// eslint-disable-next-line react/prop-types
const CheckoutForm = ({ closeModal, invoiceIds, pt }) => {
  const stripe = useStripe()
  const elements = useElements()
  // states
  const [message, setMessage] = useState(null)
  const [isProcessing, setisProcessing] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return
    }

    setisProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements: elements,
      payment_method_types: ["card", "us_bank_account"],
      //   redirect: "if_required",
      confirmParams: {
        return_url: `${
          window.location.origin
        }/compliation?pt=${pt}&invoices=${invoiceIds.join(",")}`
      },
      billing_details: {
        address: {
          country: "US" // Set this if you want to pre-fill the U.S.
        }
      }
    })

    if (error) {
      setMessage({ type: "error", text: error?.message })
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage({ type: "ok", text: "success payment process" })
    } else {
      setMessage({ type: "error", text: "Unexpected state. try later!" })
    }

    setisProcessing(false)
  }

  const handleLoadError = () => {
    setLoadError(
      "There was an issue loading the payment form. Please try again."
    )
  }

  return (
    <div>
      <div className="payment-form-wrapper">
        <form onSubmit={handleSubmit}>
          {/* <div>
            <LinkAuthenticationElement onChange={handleChange} />
          </div>
          <br /> */}
          <PaymentElement
            options={CARD_OPTIONS}
            onLoadError={handleLoadError}
          />

          {message ? (
            <Alert
              className="mt-4 mb-0"
              variant={message.type === "error" ? "danger" : "success"}
            >
              {message.text}
            </Alert>
          ) : null}

          {loadError ? (
            <Alert className="" variant="danger">
              {loadError}
            </Alert>
          ) : (
            <Stack direction="horizontal" gap={3} className="pb-3 mt-4">
              <Button disabled={isProcessing} type="submit">
                {isProcessing ? "Processing..." : "Pay Now"}
              </Button>

              <Button
                disabled={isProcessing}
                variant="outline-secondary"
                type="button"
                onClick={closeModal}
                className="ms-auto"
              >
                Cancel
              </Button>
            </Stack>
          )}
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
