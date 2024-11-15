/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import { Popover, OverlayTrigger, InputGroup } from "react-bootstrap"
import { BsInfoCircle } from "react-icons/bs"

const InputGroupHelpTip = ({
  children,
  tipElement,
  trigger = "click",
  placement = "top-end",
  IsInvalid
}) => {
  const [showPopover, setShowPopover] = useState(false)
  const targetRef = useRef(null)

  const handleClickOutside = (event) => {
    if (targetRef.current && !targetRef.current.contains(event.target)) {
      setShowPopover(false) // Close popover when clicked outside
    }
  }

  useEffect(() => {
    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPopover])

  const togglePopover = () => {
    setShowPopover(!showPopover)
  }

  return (
    <InputGroup className={IsInvalid ? "is-invalid" : ""}>
      {children}
      <OverlayTrigger
        trigger={trigger}
        placement={placement}
        show={showPopover}
        overlay={
          <Popover>
            <Popover.Body>{tipElement}</Popover.Body>
          </Popover>
        }
      >
        <InputGroup.Text
          ref={targetRef}
          className="cursor-pointer"
          onClick={togglePopover}
        >
          <BsInfoCircle />
        </InputGroup.Text>
      </OverlayTrigger>
    </InputGroup>
  )
}

export default InputGroupHelpTip
