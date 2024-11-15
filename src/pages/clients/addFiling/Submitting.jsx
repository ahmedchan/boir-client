/* eslint-disable react/prop-types */
import { useEffect, useState, Suspense, lazy } from "react"
import { useParams } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useFilingForm } from "@/providers/FilingFormProvider"
import InputGroupHelpTip from "@/components/InputGroupHelpTip"
import {
  Form,
  Button,
  Row,
  Col,
  Stack,
  Alert,
  Spinner,
  Modal
} from "react-bootstrap"
import {
  useSaveReportMutation,
  useSubmitReportMutation
} from "@/services/reports.sevice"
import toast from "react-hot-toast"
import ErrorMessages from "@/components/ErrorMessages"
// lazy
const PaymentContainer = lazy(() =>
  import("@/components/payment/PaymentContainer")
)

// Yup schema for form validation
const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  authorized: yup.boolean().oneOf([true], "please, accept agreement!")
})

const Submitting = ({ setCurrentStep, boirData }) => {
  const { formData, setFormData } = useFilingForm()
  const { Clientid, reportId } = useParams()
  // state
  const [serverErrors, setServerErrors] = useState(null)

  // save draft
  const [saveReport, { isLoading: isSaving }] = useSaveReportMutation()

  const [submitReport, { isLoading: isSubmitting }] = useSubmitReportMutation()
  // state
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: formData.submissionInformation?.email,
      firstName: formData.submissionInformation?.firstName,
      lastName: formData.submissionInformation?.lastName,
      authorized: formData.submissionInformation?.authorized
    }
  })

  const submitReportData = async () => {
    try {
      await submitReport({ reportId }).unwrap()
    } catch (error) {
      console.log("submitting error => ", error)
    }
  }

  const onSubmit = async () => {
    const { error } = await handleOnSaveDraft()

    if (error) return

    if (boirData && boirData?.invoicePaid === 0) {
      setShowPaymentModal(true)
    } else {
      submitReportData()
    }
  }

  const handleOnSaveDraft = async () => {
    const json = { ...formData, submissionInformation: getValues() }
    // const jsonFornData = jsonToFormData(json)
    try {
      const resp = await saveReport(json).unwrap()
      toast.success("Saved Successfully.")
      return { data: resp, error: undefined }
    } catch (error) {
      if (error?.data?.errors) {
        setServerErrors(error?.data?.errors)
      } else if (error?.data) {
        toast.error(error?.data?.message || error?.data?.title)
      } else {
        toast.error("Something went wrong, please try again later.")
      }
      return { data: undefined, error: error }
    }
  }

  const handleClose = () => {
    setShowPaymentModal(false)
  }

  useEffect(() => {
    return () => {
      setFormData((prev) => ({
        ...prev,
        submissionInformation: watch()
      }))
    }
  }, [watch])

  return (
    <>
      <Form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="pb-3"
      >
        <Form.Text muted>
          Complete all fields below before submitting. Directly after
          submission, a processing page will be displayed, followed by a page
          confirming the status of your report. This confirmation page will also
          give you an opportunity to download a transcript of your report.
        </Form.Text>

        <Row className="mt-3">
          <Col xs={12} md={8}>
            <Form.Group controlId="email_Control" className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Email
              </Form.Label>
              <InputGroupHelpTip
                tipElement={<div>Enter your email address.</div>}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      type="email"
                      isInvalid={!!errors.email}
                    />
                  )}
                />
              </InputGroupHelpTip>
              {errors.email && (
                <div className="invalid">{errors.email.message}</div>
              )}
            </Form.Group>
          </Col>

          <Col xs={12} md={8}>
            <Form.Group controlId="firstName_Control" className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> First Name
              </Form.Label>
              <InputGroupHelpTip tipElement={<div>Enter your first name.</div>}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Form.Control {...field} isInvalid={!!errors?.firstName} />
                  )}
                />
              </InputGroupHelpTip>
              {errors?.firstName && (
                <div className="invalid">{errors.firstName.message}</div>
              )}
            </Form.Group>
          </Col>

          <Col xs={12} md={8}>
            <Form.Group controlId="lastName_Control" className="mb-3">
              <Form.Label>
                <strong className="text-danger">*</strong> Last Name
              </Form.Label>
              <InputGroupHelpTip tipElement={<div>Enter your last name.</div>}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Form.Control {...field} isInvalid={!!errors?.lastName} />
                  )}
                />
              </InputGroupHelpTip>
              {errors.lastName && (
                <div className="invalid">{errors.lastName.message}</div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <div className="mt-4">
          <div className="mb-1">
            <strong className="text-danger">*</strong>{" "}
            <strong>
              I certify that I am authorized to file this BOIR on behalf of the
              reporting company. I further certify, on behalf of the reporting
              company, that the information contained in this BOIR is true,
              correct, and complete.
            </strong>
          </div>
          <Form.Group controlId="authorized_Control" className="mb-3">
            <Controller
              name="authorized"
              control={control}
              render={({ field }) => (
                <Form.Check
                  {...field}
                  label={<strong>I agree</strong>}
                  type="checkbox"
                  id={`agreementCheckbox`}
                  isInvalid={!!errors.authorized}
                  checked={field.value}
                  onChange={(e) => {
                    const { checked } = e.target
                    field.onChange(checked)
                  }}
                />
              )}
            />
            {errors.authorized && (
              <div className="invalid">{errors.authorized.message}</div>
            )}
          </Form.Group>
        </div>

        <Alert variant="warning">
          <p>
            <span className="text-uppercase font-weight-bold ">
              COMPLIANCE REMINDER:
            </span>{" "}
            &nbsp; The willful failure to report complete beneficial ownership
            information to FinCEN, the willful failure to update beneficial
            ownership information provided to FinCEN when previously reported
            information changes, or the willful provision of false or fraudulent
            beneficial ownership information to FinCEN, may result in civil or
            criminal penalties. A person may also be subject to civil or
            criminal penalties for willfully causing a reporting company to
            report incomplete or false beneficial ownership information to
            FinCEN.
          </p>
        </Alert>

        {serverErrors && <ErrorMessages errors={serverErrors} />}

        <Stack direction="horizontal" gap={3} className="pb-3">
          <Button variant="warning" type="submit" disabled={isSubmitting}>
            {isSubmitting && (
              <>
                <Spinner size="sm" />
                &nbsp;
              </>
            )}
            <span className="px-5 text-uppercase">Submit Boir</span>
          </Button>
        </Stack>
      </Form>

      <div style={{ bottom: 0 }} className="position-sticky z-3 bg-white mb-1">
        <hr />
        <Stack direction="horizontal" gap={3} className="pb-3">
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setCurrentStep(4)
            }}
          >
            Previous
          </Button>

          <Button
            variant="warning"
            type="button"
            onClick={handleOnSaveDraft}
            disabled={isSaving}
            className="ms-auto"
          >
            {isSaving && (
              <>
                <Spinner size="sm" />
                &nbsp;
              </>
            )}
            Save
          </Button>
        </Stack>
      </div>

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
              reportIds={[reportId]}
              closeModal={handleClose}
            />
          </Suspense>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Submitting
