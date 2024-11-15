/* eslint-disable react/prop-types */
import { IoTrashOutline } from "react-icons/io5"
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteComponent = ({ onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Function to show the modal
  const handleShow = () => setShowConfirm(true);

  // Function to hide the modal
  const handleClose = () => setShowConfirm(false);

  // Function called when user confirms the delete action
  const handleDelete = () => {
    setShowConfirm(false);
    if (onDelete) {
      onDelete(); // Call the delete function passed as a prop
    }
  };

  return (
    <div>
      {/* Delete Button */}
      <div style={{ cursor: "pointer" }} onClick={handleShow}>
        <IoTrashOutline size={14} className="me-2" /> Delete
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={handleClose} centered backdrop="static">
        {/* <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="p-3">
            <h5 className="mb-4">Confirm Delete</h5>
            <p>Are you sure you want to delete this item?</p>
            <div className="d-flex justify-content-start mt-3 gap-2">
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  )
};

export default DeleteComponent;
