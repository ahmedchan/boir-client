/* eslint-disable react/prop-types */
import { useState, lazy, Suspense } from "react"
import { Button, Spinner, Modal } from "react-bootstrap"
import { useParams } from "react-router-dom"
// lazy
const PaymentContainer = lazy(() =>
  import("@/components/payment/PaymentContainer")
)

const PayReportButton = ({ reportIds }) => {
  const { Clientid } = useParams()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleClose = () => {
    setShowPaymentModal(false)
  }

  return (
    <>
      <Button onClick={() => setShowPaymentModal(true)} variant="primary">
        Pay
      </Button>

      <Modal
        show={showPaymentModal}
        size="lg"
        onHide={handleClose}
        backdrop="static"
      >
        <Modal.Body>
          <Suspense
            fallback={
              <div className="p-4 d-flex justify-content-center align-items-center">
                <Spinner />
              </div>
            }
          >
            <PaymentContainer
              clientId={Clientid}
              reportIds={reportIds}
              closeModal={handleClose}
            />
          </Suspense>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PayReportButton
