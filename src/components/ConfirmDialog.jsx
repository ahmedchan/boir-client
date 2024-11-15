/* eslint-disable react/prop-types */
import { useState } from "react"
import { Modal, Button } from "react-bootstrap"

const ConfirmDialog = ({ title, descraption, onApprove, onReject }) => {
  const [show, setShow] = useState(true)
  return (
    <Modal show={show}>
      <Modal.Body className="p-4">
        <h4 className="mb-3">{title}</h4>
        <div className="mb-5">{descraption}</div>
        <div className="d-flex justify-content-end gap-1">
          <Button
            variant="primary"
            onClick={() => {
              onApprove()
              setShow(false)
            }}
          >
            <span className="px-2">Yes</span>
          </Button>
          <Button
            variant="link"
            onClick={() => {
              onReject()
              setShow(false)
            }}
          >
            <span className="px-1 text-secondary text-decoration-underline">
              No
            </span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ConfirmDialog
