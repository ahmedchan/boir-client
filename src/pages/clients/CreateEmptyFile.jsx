import { useEffect, useState } from "react"
import { useInitialEmptyReportMutation } from "@/services/reports.sevice"
import { Spinner, Alert } from "react-bootstrap"
import { useAuth } from "@/providers/AuthProvider"

const CreateEmptyFile = (Component) => {
  const SubComponent = (props) => {
    const { auth } = useAuth()
    // api
    const [initialEmptyReport, { isLoading, isError }] =
      useInitialEmptyReportMutation()
    const [serverError, setServerError] = useState(null)

    useEffect(() => {
      let mounted = true

      const createNewReport = async () => {
        try {
          await initialEmptyReport({
            companyID: auth?.user?.companyID,
            email: auth?.user?.email
          }).unwrap()
        } catch (error) {
          if (error?.data) {
            setServerError(error?.data)
          }
        }
      }

      if (mounted) {
        createNewReport()
      }

      return () => {
        mounted = false
      }
    }, [])

    if (isLoading) {
      return (
        <div className="d-flex align-items-center justify-content-center p-4">
          <Spinner size="lg" />
        </div>
      )
    }

    if (isError) {
      if (serverError) {
        return <Alert variant="danger">{serverError}</Alert>
      }
      return <Alert variant="danger">Error initialing report file!</Alert>
    }

    return <Component {...props} companyID={auth?.user?.companyID} />
  }

  return SubComponent
}

export default CreateEmptyFile
