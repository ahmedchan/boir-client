/* eslint-disable react/prop-types */
import { useState, lazy, Suspense, useEffect } from "react"
import { MdHelp, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputGroupHelpTip from "@/components/InputGroupHelpTip"
import { FilingInfoTip, MainFilingInfoTip } from "./info/FilingInfoTipElement"
import {
  Form,
  Collapse,
  Button,
  Card,
  Stack,
  OverlayTrigger,
  Tooltip,
  Spinner
} from "react-bootstrap"
import { useFilingForm } from "@/providers/FilingFormProvider"
import AmericanCountrySelect from "@/components/AmericanCountrySelect"
import {
  BoirFilingType,
  EFilingPriorReportingCompanyIdentificationType
} from "@/enums"
import { useSaveReportMutation } from "@/services/reports.sevice"
import toast from "react-hot-toast"
import ErrorMessages from "@/components/ErrorMessages"
// lazy
const ConfirmDialog = lazy(() => import("@/components/ConfirmDialog"))
// Yup schema for form validation
const schema = yup.object().shape({
  boirfilingTypeId: yup.string().required("Filing type is required"),
  efilingPriorReportingCompanyName: yup
    .string()
    .when(["boirfilingTypeId"], (boirfilingTypeId, schema) => {
      if (!boirfilingTypeId.includes(BoirFilingType.INITIAL_REPORT)) {
        return yup.string().required("Legal name is required")
      }
      return schema
    }),
  efilingPriorReportingCompanyIdentificationTypeCode: yup
    .string()
    .when(["boirfilingTypeId"], (boirfilingTypeId, schema) => {
      if (!boirfilingTypeId.includes(BoirFilingType.INITIAL_REPORT)) {
        return yup.string().required("Tax Identification type is required")
      }
      return schema
    }),
  efilingPriorReportingCompanyIdentificationNumberText: yup
    .string()
    .when(
      [
        "boirfilingTypeId",
        "efilingPriorReportingCompanyIdentificationTypeCode"
      ],
      (
        [boirfilingTypeId, efilingPriorReportingCompanyIdentificationTypeCode],
        schema
      ) => {
        if (
          !boirfilingTypeId.includes(BoirFilingType.INITIAL_REPORT) &&
          efilingPriorReportingCompanyIdentificationTypeCode
        ) {
          return yup.string().required("Identificatio number is required")
        }
        return schema
      }
    ),
  efilingPriorReportingCompanyIssuerCountryCodeText: yup
    .string()
    .when(
      [
        "boirfilingTypeId",
        "efilingPriorReportingCompanyIdentificationTypeCode"
      ],
      (
        [boirfilingTypeId, efilingPriorReportingCompanyIdentificationTypeCode],
        schema
      ) => {
        if (!boirfilingTypeId.includes(BoirFilingType.INITIAL_REPORT)) {
          if (
            efilingPriorReportingCompanyIdentificationTypeCode ===
            EFilingPriorReportingCompanyIdentificationType.FOREIGN_ENTITY_25
          ) {
            return yup
              .string()
              .required("Country is required for foreign tax ID")
          }
        }
        return schema
      }
    )
})

const radioButton = [
  {
    name: "a. Initial report",
    value: BoirFilingType.INITIAL_REPORT,
    tip: "Item, 'a' “Initial report” if this is the first BOIR filed for the reporting company."
  },
  {
    name: "b. Correct prior report",
    value: BoirFilingType.CORRECT_PRIOR_REPORT,
    tip: "Item, 'b' “Correct prior report” if the report corrects inaccurate information from a previously filed BOIR "
  },
  {
    name: "c. Update prior report",
    value: BoirFilingType.UPDATE_PRIOR_REPORT,
    tip: "Item, 'c' “Update prior report” if the report updates a previously filed BOIR, for example, to include one or more new beneficial owners."
  },
  {
    name: "d. Newly exempt entity",
    value: BoirFilingType.NEWLY_EXEMPT_ENTITY,
    tip: "Item, 'd' “Newly exempt entity” if, after having filed a BOIR, the reporting company is now exempt from BOI reporting requirements. If this checkbox is selected, then filer must fill out fields 1e–1h (reporting company information associated with most recent report) and no other fields in the BOIR"
  }
]

const FilingInformation = ({ setCurrentStep }) => {
  const { formData, setFormData } = useFilingForm()
  const [tipOpen1, setTipOpen1] = useState(false)
  const [serverErrors, setServerErrors] = useState(null)
  const [selectedValue, setSelectedValue] = useState(
    formData.filingInformation?.boirfilingTypeId?.toString()
  )
  const [pendingCheck, setPendingCheck] = useState("")
  // eslint-disable-next-line no-unused-vars
  const [radioClicked, setRadioClicked] = useState(false)
  const [checkConfirmModal, setCheckConfirmModal] = useState(false)

  // save draft
  const [saveReport, { isLoading: isSaving }] = useSaveReportMutation()

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      activityId: formData.filingInformation.activityId,
      boireportId: formData.filingInformation?.boireportId,
      boirfilingTypeId:
        formData.filingInformation?.boirfilingTypeId?.toString(),
      efilingPriorReportingCompanyName:
        formData.filingInformation?.efilingPriorReportingCompanyName,
      efilingPriorReportingCompanyIdentificationTypeCode:
        formData.filingInformation
          ?.efilingPriorReportingCompanyIdentificationTypeCode,
      efilingPriorReportingCompanyIdentificationNumberText:
        formData.filingInformation
          ?.efilingPriorReportingCompanyIdentificationNumberText,
      efilingPriorReportingCompanyIssuerCountryCodeText:
        formData.filingInformation
          ?.efilingPriorReportingCompanyIssuerCountryCodeText,
      filingDateText: formData.filingInformation?.filingDateText
    }
  })
  // watchers
  const filingTypeWatcher = watch("boirfilingTypeId")
  const idTypeWatcher = watch(
    "efilingPriorReportingCompanyIdentificationTypeCode"
  )

  const handleRadioClick = (value) => {
    if (value === BoirFilingType.NEWLY_EXEMPT_ENTITY) {
      setPendingCheck(value)
      setCheckConfirmModal(true) // Show modal for confirmation
    } else {
      setRadioClicked(true)
      setSelectedValue(value) // Directly select for other values
      setValue("boirfilingTypeId", value, {
        shouldDirty: true,
        shouldValidate: true
      })
    }
  }

  const handleConfirm = () => {
    setSelectedValue(pendingCheck) // Set the pending value after confirmation
    setCheckConfirmModal(false) // Close modal
    setValue("boirfilingTypeId", BoirFilingType.NEWLY_EXEMPT_ENTITY, {
      shouldDirty: true,
      shouldValidate: true
    })
  }

  const handleClose = () => {
    setPendingCheck("") // Clear pending value if modal closed without confirmation
    setCheckConfirmModal(false) // Close modal
  }

  const onSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      filingInformation: { ...prev.filingInformation, ...data }
    }))
    setCurrentStep(2)
  }

  const handleOnSaveDraft = async () => {
    const json = { ...formData, filingInformation: getValues() }
    // const jsonFornData = jsonToFormData(json)
    try {
      await saveReport(json).unwrap()
      toast.success("Saved Successfully.")
    } catch (error) {
      if (error?.data?.errors) {
        setServerErrors(error?.data?.errors)
      } else if (error?.data) {
        toast.error(error?.data?.message || error?.data?.title)
      } else {
        toast.error("Something went wrong, please try again later.")
      }
    }
  }

  useEffect(() => {
    return () => {
      setFormData((prev) => ({
        ...prev,
        filingInformation: watch()
      }))
    }
  }, [watch])

  return (
    <>
      <Form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="p-3"
      >
        {/* title */}
        <h3>Filing Information</h3>

        {/* help box */}
        <Card className="mb-4">
          <Card.Header
            onClick={() => setTipOpen1((prev) => !prev)}
            className="cursor-pointer"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 align-items-center">
                <MdHelp />
                <strong>Need Help</strong>
              </div>
              {tipOpen1 ? (
                <MdKeyboardArrowUp size={22} />
              ) : (
                <MdKeyboardArrowDown size={22} />
              )}
            </div>
          </Card.Header>
          <Collapse in={tipOpen1}>
            <Card.Body>
              <MainFilingInfoTip />
            </Card.Body>
          </Collapse>
        </Card>

        <fieldset className="mt-2">
          <Form.Group controlId="boirfilingTypeId-Control">
            <Form.Label>
              <strong className="text-danger">*</strong> 1. Type of filing
            </Form.Label>

            {radioButton.map((item, index) => {
              return (
                <OverlayTrigger
                  key={item.value}
                  placement="right-start"
                  overlay={<Tooltip>{item.tip}</Tooltip>}
                >
                  <div style={{ width: "fit-content" }}>
                    <Form.Check
                      key={index}
                      name="boirfilingTypeId"
                      type="radio"
                      label={item.name}
                      value={item.value}
                      id={`boirfilingTypeId${item.value}`}
                      checked={selectedValue === item.value.toString()}
                      onChange={() => handleRadioClick(item.value)}
                      feedbackType="invalid"
                      isInvalid={!!errors.boirfilingTypeId}
                    />
                  </div>
                </OverlayTrigger>
              )
            })}

            {errors.boirfilingTypeId && (
              <div className="text-danger text-sm-start mt-2">
                {errors.boirfilingTypeId?.message}
              </div>
            )}
          </Form.Group>

          {filingTypeWatcher &&
          filingTypeWatcher !== BoirFilingType.INITIAL_REPORT ? (
            <div className="mt-4">
              <hr />

              <h5 className="mb-3">
                Reporting Company associated with latest report (not applicable
                for initial report)
              </h5>

              <Form.Group
                className="mb-3"
                controlId="efilingPriorReportingCompanyName-Control"
              >
                <Form.Label>
                  <strong className="text-danger">*</strong> e. Legal name
                </Form.Label>
                <InputGroupHelpTip tipElement={<FilingInfoTip />}>
                  <Controller
                    name="efilingPriorReportingCompanyName"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        isInvalid={!!errors.efilingPriorReportingCompanyName}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors.efilingPriorReportingCompanyName && (
                  <div className="invalid">
                    {errors.efilingPriorReportingCompanyName.message}
                  </div>
                )}
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="efilingPriorReportingCompanyIdentificationTypeCode-Control"
              >
                <Form.Label>
                  <strong className="text-danger">*</strong> f. Tax
                  Identification type
                </Form.Label>
                <InputGroupHelpTip tipElement={<FilingInfoTip />}>
                  <Controller
                    name="efilingPriorReportingCompanyIdentificationTypeCode"
                    control={control}
                    render={({ field }) => (
                      <Form.Select
                        isInvalid={
                          !!errors.efilingPriorReportingCompanyIdentificationTypeCode
                        }
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      >
                        <option value="">Select an ID type</option>
                        <option
                          value={
                            EFilingPriorReportingCompanyIdentificationType.EIN_9D
                          }
                        >
                          EIN
                        </option>
                        <option
                          value={
                            EFilingPriorReportingCompanyIdentificationType.SSN_ITIN_9D
                          }
                        >
                          SSN/ITIN
                        </option>
                        <option
                          value={
                            EFilingPriorReportingCompanyIdentificationType.FOREIGN_ENTITY_25
                          }
                        >
                          Foreign
                        </option>
                      </Form.Select>
                    )}
                  />
                </InputGroupHelpTip>
                {errors.efilingPriorReportingCompanyIdentificationTypeCode && (
                  <div className="invalid">
                    {
                      errors.efilingPriorReportingCompanyIdentificationTypeCode
                        .message
                    }
                  </div>
                )}
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="efilingPriorReportingCompanyIdentificationNumberText-Control"
              >
                <Form.Label>
                  <strong className="text-danger">*</strong> g. Tax
                  Identification number
                </Form.Label>
                <InputGroupHelpTip tipElement={<FilingInfoTip />}>
                  <Controller
                    name="efilingPriorReportingCompanyIdentificationNumberText"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        disabled={idTypeWatcher === ""}
                        isInvalid={
                          !!errors.efilingPriorReportingCompanyIdentificationNumberText
                        }
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors.efilingPriorReportingCompanyIdentificationNumberText && (
                  <div className="invalid">
                    {" "}
                    {
                      errors
                        .efilingPriorReportingCompanyIdentificationNumberText
                        .message
                    }
                  </div>
                )}
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="efilingPriorReportingCompanyIssuerCountryCodeText-Control"
              >
                <Form.Label>
                  h. Country/Jurisdiction (if foreign tax ID only)
                </Form.Label>
                <InputGroupHelpTip tipElement={<FilingInfoTip />}>
                  <Controller
                    name="efilingPriorReportingCompanyIssuerCountryCodeText"
                    control={control}
                    render={({ field }) => (
                      <AmericanCountrySelect
                        name={field.name}
                        required={
                          idTypeWatcher ===
                          EFilingPriorReportingCompanyIdentificationType.FOREIGN_ENTITY_25
                        }
                        isInvalid={
                          !!errors.efilingPriorReportingCompanyIssuerCountryCodeText
                        }
                        disabled={
                          idTypeWatcher !==
                          EFilingPriorReportingCompanyIdentificationType.FOREIGN_ENTITY_25
                        }
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors.efilingPriorReportingCompanyIssuerCountryCodeText && (
                  <div className="invalid">
                    {
                      errors.efilingPriorReportingCompanyIssuerCountryCodeText
                        .message
                    }
                  </div>
                )}
              </Form.Group>
            </div>
          ) : null}

          <Form.Group className="mb-3 mt-5" controlId="filingDateText-control">
            <Form.Label>2. Date prepared (auto-filled)</Form.Label>
            <InputGroupHelpTip
              tipElement={
                <div>
                  <strong>Item 2 – Date prepared:</strong>
                  This item is automatically populated with the current date.
                </div>
              }
            >
              <Controller
                name="filingDateText"
                control={control}
                render={({ field }) => (
                  <Form.Control required {...field} disabled={true} />
                )}
              />
            </InputGroupHelpTip>
          </Form.Group>
        </fieldset>

        {serverErrors && <ErrorMessages errors={serverErrors} />}

        <div
          style={{ bottom: 0, zIndex: 19 }}
          className="position-sticky bg-white mb-1"
        >
          <hr />
          <Stack direction="horizontal" gap={3} className="pb-3">
            <Button variant="secondary" type="button" disabled={true}>
              Previous
            </Button>

            <div className="d-flex gap-2 ms-auto">
              <Button
                variant="warning"
                type="button"
                onClick={handleOnSaveDraft}
                disabled={isSaving}
              >
                {isSaving && (
                  <>
                    <Spinner size="sm" />
                    &nbsp;
                  </>
                )}
                Save Draft
              </Button>
              <Button variant="primary" type="submit">
                Next
              </Button>
            </div>
          </Stack>
        </div>
      </Form>

      {checkConfirmModal ? (
        <Suspense fallback={null}>
          <ConfirmDialog
            title="Confirm Exempt Entity Selection"
            descraption="By selecting this box, all Reporting Company, Company Applicant, and Beneficial Owner fields will be cleared and disabled. Do you wish to proceed?"
            onApprove={() => handleConfirm()}
            onReject={() => handleClose()}
          />
        </Suspense>
      ) : null}
    </>
  )
}
export default FilingInformation