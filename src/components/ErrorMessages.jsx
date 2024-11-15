/* eslint-disable react/prop-types */
import { useRef, useEffect, Fragment, useState } from "react"
import { Alert, Button } from "react-bootstrap"

const ErrorMessages = ({ errors }) => {
  const errorRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const maxVisibleErrors = 3

  useEffect(() => {
    if (errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  const errorEntries = Object.entries(errors)

  return (
    <div className="" ref={errorRef}>
      <Alert variant="danger">
        {errorEntries
          .slice(0, expanded ? errorEntries.length : maxVisibleErrors)
          .map(([field, messages]) => {
            return (
              <Fragment key={field}>
                {messages.map((message, index) => (
                  <div key={index} className="mb-1">
                    {field.split(".")[0]}: {message}
                  </div>
                ))}
              </Fragment>
            )
          })}

        {errorEntries.length > maxVisibleErrors && (
          <Button
            variant="link"
            onClick={() => setExpanded(!expanded)}
            className="p-0 mt-1"
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        )}
      </Alert>
    </div>
  )
}

export default ErrorMessages
