/* eslint-disable react/prop-types */
import { useState, lazy, Suspense, useEffect } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputGroupHelpTip from "@/components/InputGroupHelpTip"
import {
  MainApplicantInfo,
  ApplicantInformationInfo,
  ApplicantFinCENInfo,
  LegalDateofBirthInfo,
  CurrentAddressInfo,
  IdentificationJurisdictionInfo
} from "./info/ApplicantInfo"
import {
  Form,
  Button,
  Stack,
  Accordion,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Spinner
} from "react-bootstrap"
import { useFilingForm } from "@/providers/FilingFormProvider"
import CustomDatePicker from "@/components/Custom-Datepicker"
import CountriesSelect from "@/components/CountriesSelect"
import StateSelect from "@/components/StateSelect"
import PartyIdentificationPersonalTypeSelect from "@/components/PartyIdentificationPersonalTypeSelect"
import TribesSelect from "@/components/TribesSelect"
import { useSaveReportMutation } from "@/services/reports.sevice"
import toast from "react-hot-toast"
import {
  getFileExtension,
  convertToBase64
} from "@/utility/utils"
import ErrorMessages from "@/components/ErrorMessages"
import { MAX_FILE_SIZE, SUPPORTED_FORMATS, FILENAME_PATTERN } from "@/enums"
// lazy
const ConfirmDialog = lazy(() => import("@/components/ConfirmDialog"))
// Yup schema for form validation
const schema = yup.object().shape({
  // existingReportingCompanyIndicator: yup.boolean(),
  companyApplicants: yup.array().of(
    yup.object().shape({
      // existingReportingCompanyIndicator: yup.boolean(),
      finCenid: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator"],
          ([existingReportingCompanyIndicator], schema) => {
            if (existingReportingCompanyIndicator === false) {
              return schema
                .notRequired()
                .test(
                  "is-valid-format",
                  "FinCenId must be in the format 0000-0000-0000",
                  (value) =>
                    !value || /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/.test(value)
                )
            }
            return schema
          }
        ),
      rawIndividualFirstName: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("First name is required")
              }
            }
            return schema
          }
        ),
      rawEntityIndividualLastName: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Last name is required")
              }
            }
            return schema
          }
        ),
      rawIndividualMiddleName: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Middle name  is required")
              }
            }
            return schema
          }
        ),
      rawIndividualNameSuffixText: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Suffix is required")
              }
            }
            return schema
          }
        ),
      individualBirthDateText: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Date of birth is required")
              }
            }
            return schema
          }
        ),
      // 3
      rawStreetAddress1Text: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Address is required")
              }
            }
            return schema
          }
        ),
      rawCityText: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("City is required")
              }
            }
            return schema
          }
        ),
      rawCountryCodeText: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Country is required")
              }
            }
            return schema
          }
        ),
      rawStateCodeText: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("State is required")
              }
            }
            return schema
          }
        ),
      rawZipcode: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema
                  .matches(/^[0-9]+$/, "Zip code must be digits only!")
                  .min(5, "Zip code must be 5 digits or 9")
                  .max(9, "Zip code must be 5 digits or 9")
                  .required("Zip Code  is required")
              }
            }
            return schema
          }
        ),
      //   4
      partyIdentificationTypeCode: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Identification type  is required")
              }
            }
            return schema
          }
        ),
      partyIdentificationNumberText: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return schema.required("Identification number  is required")
              }
            }
            return schema
          }
        ),
      ImageFile: yup
        .string()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return yup
                  .string()
                  .required("Identification attachment File is required")
              }
            }
            return schema
          }
        ),
      file: yup
        .mixed()
        .when(
          ["$existingReportingCompanyIndicator", "finCenid"],
          ([existingReportingCompanyIndicator, finCenid], schema) => {
            if (existingReportingCompanyIndicator === false) {
              if (finCenid === "" || finCenid.length < 12) {
                return yup
                  .mixed()
                  .required("Identification attachment File is required")
                  .test("fileSize", "File is too large", (value) =>
                    value ? value.size <= MAX_FILE_SIZE : true
                  )
                  .test("fileName", "Invalid file name", (value) =>
                    value ? FILENAME_PATTERN.test(value.name) : true
                  )
                  .test("fileType", "Unsupported file type", (value) =>
                    value ? SUPPORTED_FORMATS.includes(value.type) : true
                  )
              }
            }
            return schema
          }
        )
    })
  )
})

const CompanyApplicants = ({ setCurrentStep }) => {
  const { formData, setFormData } = useFilingForm()
  // states
  const [serverErrors, setServerErrors] = useState(null)
  const [activeIndexes, setActiveIndexes] = useState([])
  const [pendingCheck, setPendingCheck] = useState(false)
  const [isExistReportCheck, setIsExistReportCheck] = useState(
    formData.reportingCompany?.existingReportingCompanyIndicator
  )
  const [checkConfirmModal, setCheckConfirmModal] = useState(false)
  const [confirmRemoveAppModal, setConfirmRemoveAppModal] = useState({
    isShown: false,
    appNumber: null
  })

  // save draft
  const [saveReport, { isLoading: isSaving }] = useSaveReportMutation()

  // form
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      existingReportingCompanyIndicator: isExistReportCheck,
      companyApplicants: formData.companyApplicants
    },
    resolver: yupResolver(schema),
    context: { existingReportingCompanyIndicator: isExistReportCheck }
  })

  // watcher
  const isExistingReportingCompanyWatcher = watch(
    "existingReportingCompanyIndicator"
  )

  const { fields, append, remove } = useFieldArray({
    control,
    name: "companyApplicants" // name of the array in form
  })

  const handleCheckboxClick = () => {
    setPendingCheck(!pendingCheck) // Store the intended check state
    if (isExistReportCheck) {
      setIsExistReportCheck(false)
    } else {
      setCheckConfirmModal(true) // Show modal for confirmation
    }
  }

  useEffect(() => {
    setValue("existingReportingCompanyIndicator", isExistReportCheck, {
      shouldDirty: true,
      shouldValidate: true
    })

    setFormData((prev) => ({
      ...prev,
      reportingCompany: {
        ...prev.reportingCompany,
        existingReportingCompanyIndicator: isExistReportCheck
      }
    }))
  }, [isExistReportCheck, setValue])

  const handleRemoveApplicant = (number) => {
    remove(number)
    setFormData((prev) => ({
      ...prev,
      companyApplicants: prev.companyApplicants.filter((b, i) => i !== number)
    }))
    setConfirmRemoveAppModal({ isShown: false, appNumber: null })
  }

  const removeAllExceptFirst = () => {
    for (let i = fields.length - 1; i > 0; i--) {
      remove(i) // Start removing from the end
    }
  }

  const onSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      reportingCompany: {
        ...prev.reportingCompany,
        existingReportingCompanyIndicator:
          data.existingReportingCompanyIndicator
      },
      companyApplicants: data.companyApplicants
    }))

    setTimeout(() => {
      setCurrentStep(4)
    }, 0)
  }

  // Toggle the accordion item's state
  const handleToggle = (index) => {
    setActiveIndexes(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Remove index if already open (close it)
          : [...prev, index] // Add index to open (open it)
    )
  }

  const handleClearSelectedFile = (index) => {
    setValue(`companyApplicants[${index}].file`, undefined, {
      shouldDirty: true,
      shouldValidate: true
    })
    setValue(`companyApplicants[${index}].ImageFile`, "", {
      shouldDirty: true,
      shouldValidate: true
    })
    setValue(
      `companyApplicants[${index}].PartyIdentificationImageContentType`,
      "",
      { shouldDirty: true }
    )
    setValue(`companyApplicants[${index}].originalAttachmentFileName`, "", {
      shouldDirty: true,
      shouldValidate: true
    })
    setFormData((prev) => ({
      ...prev,
      companyApplicants: prev.companyApplicants.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            ImageFile: "",
            PartyIdentificationImageContentType: "",
            originalAttachmentFileName: ""
          }
        } else {
          return item
        }
      })
    }))
  }

  const handleOnSaveDraft = async () => {
    const json = {
      ...formData,
      reportingCompany: {
        ...formData.reportingCompany,
        existingReportingCompanyIndicator: getValues(
          "existingReportingCompanyIndicator"
        )
      },
      companyApplicants: getValues("companyApplicants")
    }
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
        reportingCompany: {
          ...prev.reportingCompany,
          existingReportingCompanyIndicator: watch(
            "existingReportingCompanyIndicator"
          )
        },
        companyApplicants: watch("companyApplicants")
      }))
    }
  }, [watch])

  return (
    <>
      <Form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="py-3"
      >
        {/* help tip */}
        <MainApplicantInfo />

        <div className="d-flex flex-column mb-4">
          <OverlayTrigger
            placement="right-start"
            overlay={
              <Tooltip>
                <strong>Item 16 – Existing reporting company:</strong> Check
                this box if the reporting company was created or registered
                before January 1, 2024. Do not check the box if the reporting
                company was created or registered on or after January 1, 2024.
                Reporting companies that check this box are not required to
                report any company applicants; proceed to Part III.
              </Tooltip>
            }
          >
            <div style={{ width: "fit-content" }}>
              <Form.Check
                name="existingReportingCompanyIndicator"
                label="16. Existing reporting company"
                type="checkbox"
                id={`existingReportCheckbox`}
                checked={isExistReportCheck}
                onChange={handleCheckboxClick} // Capture the checkbox click event
              />
            </div>
          </OverlayTrigger>
          <Form.Text id="passwordHelpBlock" muted className="font-italic">
            (check if existing reporting company as of January 1, 2024)
          </Form.Text>
        </div>

        <Stack direction="horizontal" gap={3} className="mb-2">
          <h5>Part II. Company Applicant Information</h5>
          <Button
            variant={isExistReportCheck ? "secondary" : "primary"}
            className="ms-auto"
            disabled={isExistReportCheck}
            onClick={() => {
              append(formData?.companyApplicants[0])
              setFormData((prev) => ({
                ...prev,
                companyApplicants: [
                  ...prev.companyApplicants,
                  formData?.companyApplicants[0]
                ]
              }))
            }}
          >
            Add Company Applicant
          </Button>
        </Stack>

        {/* help tip */}
        <ApplicantInformationInfo />

        <Accordion alwaysOpen>
          {fields.map((field, index) => {
            const fincenIdWatcher = watch(
              `companyApplicants[${index}].finCenid`
            )
            const idJurisdiction = watch(
              `companyApplicants[${index}].otherIssuerCountryText`
            )
            const stateWatcher = watch(
              `companyApplicants[${index}].otherIssuerStateText`
            )
            const idLocalTribal = watch(
              `companyApplicants[${index}].issuerLocalTribalCodeText`
            )
            // mutations
            const isStateDisabled =
              idJurisdiction !== "1238" || idLocalTribal != ""
            const islocalTribalDisabled =
              idJurisdiction !== "1238" || stateWatcher !== ""
            const isOtherTribeDisabled = idLocalTribal !== "1000"

            return (
              <Accordion.Item
                data-key={index.toString()}
                eventKey={index.toString()}
                key={field.id}
              >
                <Accordion.Header
                  onClick={() => handleToggle(index.toString())}
                >
                  Company Applicant #{index + 1}
                </Accordion.Header>
                <Accordion.Body
                  style={{
                    display: activeIndexes.includes(index.toString())
                      ? "block"
                      : "none"
                  }}
                >
                  <div className="p-2">
                    {fields.length > 1 ? (
                      <div className="mb-4">
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            setConfirmRemoveAppModal({
                              isShown: true,
                              appNumber: index
                            })
                          }
                        >
                          <span className="px-3">
                            Remove applicant #{index + 1}
                          </span>
                        </Button>
                      </div>
                    ) : null}

                    {/* 1 */}
                    <fieldset disabled={isExistingReportingCompanyWatcher}>
                      <h5>Company applicant FinCEN ID</h5>
                      {/* help tip */}
                      <ApplicantFinCENInfo />

                      <Row>
                        <Col sm={12} md={7}>
                          <Form.Group
                            controlId={`companyApplicants[${index}].finCenid-control`}
                            className="mb-3"
                          >
                            <Form.Label>18. FinCEN ID</Form.Label>
                            <InputGroupHelpTip
                              tipElement={
                                <div>
                                  <strong>Item 18 – FinCEN ID:</strong>{" "}
                                  Reporting companies may report the FinCEN ID
                                  for a company applicant instead of the
                                  information in fields 19 through 33. Enter the
                                  FinCEN ID as a single text string. If a FinCEN
                                  ID for the company applicant is not provided,
                                  information about the company applicant must
                                  be provided in fields 19 through 33.
                                </div>
                              }
                            >
                              <Controller
                                name={`companyApplicants[${index}].finCenid`}
                                control={control}
                                rules={{
                                  pattern: /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/
                                }}
                                render={({ field }) => (
                                  <Form.Control
                                    {...field}
                                    placeholder="0000-0000-0000"
                                    isInvalid={
                                      !!errors?.companyApplicants?.[index]
                                        ?.finCenid
                                    }
                                    maxLength={14} // 12 digits + 2 dashes
                                    onChange={(e) => {
                                      let value = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      ) // Remove non-numeric characters

                                      // Format input to `0000-0000-0000`
                                      if (
                                        value.length > 4 &&
                                        value.length <= 8
                                      ) {
                                        value = `${value.slice(
                                          0,
                                          4
                                        )}-${value.slice(4)}`
                                      } else if (value.length > 8) {
                                        value = `${value.slice(
                                          0,
                                          4
                                        )}-${value.slice(4, 8)}-${value.slice(
                                          8,
                                          12
                                        )}`
                                      }

                                      // Only update if the length is less than or equal to 12 characters
                                      if (
                                        value.replace(/-/g, "").length <= 12
                                      ) {
                                        field.onChange(value)
                                      }
                                    }}
                                  />
                                )}
                              />
                            </InputGroupHelpTip>
                            {errors?.companyApplicants?.[index]?.finCenid && (
                              <div className="invalid">
                                {
                                  errors?.companyApplicants?.[index]?.finCenid
                                    .message
                                }
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    </fieldset>

                    {fincenIdWatcher?.length !== 14 && (
                      <>
                        <hr className="my-4" />

                        {/* 2 */}
                        <fieldset disabled={isExistingReportingCompanyWatcher}>
                          <h5>Legal name and date of birth</h5>
                          {/* help tip */}
                          <LegalDateofBirthInfo />

                          <Row>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].rawEntityIndividualLastName-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 19.
                                  Individual&apos;s last name
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 19 – Last name:</strong>{" "}
                                      Enter the company applicant’s legal last
                                      name.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawEntityIndividualLastName`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawEntityIndividualLastName
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.rawEntityIndividualLastName && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawEntityIndividualLastName.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].rawIndividualFirstName-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 20.
                                  First Name
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 20 – First name:</strong>{" "}
                                      Enter the company applicant’s legal first
                                      name.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawIndividualFirstName`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawIndividualFirstName
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.rawIndividualFirstName && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawIndividualFirstName.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].rawIndividualMiddleName-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 21.
                                  Middle name
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 21 – Middle name:</strong>{" "}
                                      Enter the company applicant&apos;s middle
                                      name if the company applicant’s legal name
                                      has a middle name. Leave this item blank
                                      if the company applicant does not have a
                                      middle name.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawIndividualMiddleName`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawIndividualMiddleName
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.rawIndividualMiddleName && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawIndividualMiddleName.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].rawIndividualNameSuffixText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 22.
                                  Suffix
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 22 – Suffix:</strong> Enter
                                      the company applicant&apos;s middle name
                                      if the company applicant’s legal name has
                                      a middle name. Leave this item blank if
                                      the company applicant does not have a
                                      middle name.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawIndividualNameSuffixText`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors.companyApplicants?.[index]
                                            ?.rawIndividualNameSuffixText
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors.companyApplicants?.[index]
                                  ?.rawIndividualNameSuffixText && (
                                  <div className="invalid">
                                    {
                                      errors.companyApplicants?.[index]
                                        ?.rawIndividualNameSuffixText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].individualBirthDateText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 23.
                                  Date of birth
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 23 – Date of birth:</strong>{" "}
                                      Enter the company applicant’s date of
                                      birth using the format MM/DD/YYYY where MM
                                      = month, DD = day, and YYYY = year (e.g.,
                                      01/25/1970). The month, day, and year must
                                      be provided; no partial dates are
                                      accepted.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].individualBirthDateText`}
                                    control={control}
                                    render={({ field }) => (
                                      <CustomDatePicker
                                        wrapperClassName="datepicker"
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.individualBirthDateText
                                        }
                                        selected={new Date(field.value)}
                                        onChange={(date) => {
                                          const d = date?.toISOString()
                                          field.onChange(d)
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.individualBirthDateText && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.individualBirthDateText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </fieldset>

                        <hr className="my-4" />

                        {/* 3 */}
                        <fieldset disabled={isExistingReportingCompanyWatcher}>
                          <h5>Current address</h5>
                          {/* help tip */}
                          <CurrentAddressInfo />

                          <Row>
                            <Col sm={12}>
                              <Controller
                                name={`companyApplicants[${index}].businessAddressIndicator`}
                                control={control}
                                render={({ field }) => {
                                  return (
                                    <div className="mb-3 d-flex gap-3">
                                      <OverlayTrigger
                                        placement="right-start"
                                        overlay={
                                          <Tooltip>
                                            <strong>
                                              Item 24 – Address type:
                                            </strong>{" "}
                                            Indicate address type as “Business
                                            address” or “Residential address”
                                            for the company applicant. For a
                                            company applicant who forms or
                                            registers an entity in the course of
                                            their business, such as paralegals,
                                            report the street address of such
                                            business. In any other case, the
                                            individual’s residential street
                                            address must be reported.
                                          </Tooltip>
                                        }
                                      >
                                        <div style={{ width: "fit-content" }}>
                                          <Form.Check
                                            {...field}
                                            inline
                                            label="Business Address"
                                            type="radio"
                                            value={field.value}
                                            onChange={() => {
                                              field.onChange(true)
                                            }}
                                            id={`businessAddress_radio_${index}`}
                                          />
                                        </div>
                                      </OverlayTrigger>
                                      <OverlayTrigger
                                        placement="right-start"
                                        overlay={
                                          <Tooltip>
                                            <strong>
                                              Item 24b – Address type:
                                            </strong>{" "}
                                            Indicate address type as “Business
                                            address” or “Residential address”
                                            for the company applicant. For a
                                            company applicant who forms or
                                            registers an entity in the course of
                                            their business, such as paralegals,
                                            report the street address of such
                                            business. In any other case, the
                                            individual’s residential street
                                            address must be reported.
                                          </Tooltip>
                                        }
                                      >
                                        <div style={{ width: "fit-content" }}>
                                          <Form.Check
                                            {...field}
                                            inline
                                            label="Residential Address"
                                            type="radio"
                                            id={`residentialAddress_${index}`}
                                            value={field.value}
                                            onChange={() => {
                                              field.onChange(false)
                                            }}
                                          />
                                        </div>
                                      </OverlayTrigger>
                                    </div>
                                  )
                                }}
                              />
                            </Col>

                            <Col sm={12} md={8}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].rawStreetAddress1Text-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 25.
                                  Address (number, street, and apt. or suite
                                  no.)
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 25 – Company applicant
                                        address:(number, street, and apt. or
                                        suite no.):
                                      </strong>{" "}
                                      Enter the company applicant’s street
                                      address information, including the city,
                                      country or jurisdiction, State, and ZIP
                                      code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 28) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/Jurisdiction”
                                      (item 27). Item 28 “State” is required if
                                      the country selected in item 27 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawStreetAddress1Text`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawStreetAddress1Text
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.rawStreetAddress1Text && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawStreetAddress1Text.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].rawCityText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 26.
                                  City
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 26 – Company applicant
                                        address:City:
                                      </strong>{" "}
                                      Enter the company applicant’s street
                                      address information, including the city,
                                      country or jurisdiction, State, and ZIP
                                      code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 28) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/Jurisdiction”
                                      (item 27). Item 28 “State” is required if
                                      the country selected in item 27 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawCityText`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawCityText
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.rawCityText && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawCityText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>

                            <Col sm={12} md={4}>
                              <Form.Group
                                className="mb-3"
                                controlId={`companyApplicants[${index}].rawCountryCodeText-control`}
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 27.
                                  Country/Jurisdiction
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 27 – Company applicant
                                        address:Country/Jurisdiction:
                                      </strong>{" "}
                                      Enter the company applicant’s street
                                      address information, including the city,
                                      country or jurisdiction, State, and ZIP
                                      code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 28) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/Jurisdiction”
                                      (item 27). Item 28 “State” is required if
                                      the country selected in item 27 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawCountryCodeText`}
                                    control={control}
                                    render={({ field }) => (
                                      <CountriesSelect
                                        name={field.name}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawCountryCodeText
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
                                {errors?.companyApplicants?.[index]
                                  ?.rawCountryCodeText && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawCountryCodeText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>

                            <Col sm={12} md={4}>
                              <Form.Group
                                className="mb-3"
                                controlId={`companyApplicants[${index}].rawStateCodeText-control`}
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 28.
                                  State
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 28 – Company applicant address:
                                        State:
                                      </strong>{" "}
                                      Enter the company applicant’s street
                                      address information, including the city,
                                      country or jurisdiction, State, and ZIP
                                      code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 28) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/Jurisdiction”
                                      (item 27). Item 28 “State” is required if
                                      the country selected in item 27 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawStateCodeText`}
                                    control={control}
                                    render={({ field }) => (
                                      <StateSelect
                                        name={field.name}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawStateCodeText
                                        }
                                        countryId={watch(
                                          `companyApplicants[${index}].rawCountryCodeText`
                                        )}
                                        value={field.value}
                                        onChange={(e) => {
                                          const { value } = e.target
                                          field.onChange(value)
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.rawStateCodeText && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawStateCodeText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].rawZipcode-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 29.
                                  ZIP/Foreign postal code
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 29 – Company applicant address:
                                        ZIP/Foreign postal code:
                                      </strong>{" "}
                                      Enter the company applicant’s street
                                      address information, including the city,
                                      country or jurisdiction, State, and ZIP
                                      code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 28) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/Jurisdiction”
                                      (item 27). Item 28 “State” is required if
                                      the country selected in item 27 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].rawZipcode`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.rawZipcode
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.rawZipcode && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.rawZipcode.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </fieldset>

                        <hr className="my-4" />

                        {/* 4 */}
                        <fieldset disabled={isExistingReportingCompanyWatcher}>
                          <h5>
                            Form of identification and issuing jurisdiction
                          </h5>
                          {/* help tip */}
                          <IdentificationJurisdictionInfo />

                          <Row>
                            <Col sm={12} md={6}>
                              <Form.Group
                                className="mb-3"
                                controlId={`companyApplicants[${index}].partyIdentificationTypeCode-control`}
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 30.
                                  Identifying document type
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 30 – Identifying document type:
                                      </strong>{" "}
                                      Select the company applicant’s identifying
                                      document type from the list of acceptable
                                      documents: a non-expired State-issued
                                      driver’s license, a non-expired
                                      State/local/Tribe-issued identification
                                      document issued for the purpose of
                                      identifying the individual, a non-expired
                                      U.S. passport, or, only if the company
                                      applicant does not have one of these
                                      identifying documents, a non-expired
                                      foreign passport.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].partyIdentificationTypeCode`}
                                    control={control}
                                    render={({ field }) => (
                                      <PartyIdentificationPersonalTypeSelect
                                        value={field.value}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.partyIdentificationTypeCode
                                        }
                                        name={field.name}
                                        required={true}
                                        onChange={(e) => {
                                          const { value } = e.target
                                          field.onChange(value)
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.partyIdentificationTypeCode && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.partyIdentificationTypeCode.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].partyIdentificationNumberText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 31.
                                  Identifying document number
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 31 – Identifying document number:
                                      </strong>{" "}
                                      Enter the identifying document number from
                                      the company applicant’s identifying
                                      document.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].partyIdentificationNumberText`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.partyIdentificationNumberText
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.companyApplicants?.[index]
                                  ?.partyIdentificationNumberText && (
                                  <div className="invalid">
                                    {
                                      errors?.companyApplicants?.[index]
                                        ?.partyIdentificationNumberText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>

                            <Col sm={12} className="mt-3">
                              <Form.Label>
                                <strong className="text-danger">*</strong> 32.
                                Identifying document issuing jurisdiction
                              </Form.Label>
                            </Col>

                            <Col sm={12} md={6}>
                              <Form.Group
                                className="mb-3"
                                controlId={`companyApplicants[${index}].otherIssuerCountryText-control`}
                              >
                                <Form.Label>a. Country/Jurisdiction</Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 32a – Identifying document issuing
                                        jurisdiction: Country/Jurisdiction:
                                      </strong>{" "}
                                      Enter in item 32a the country/jurisdiction
                                      that issued the company applicant’s
                                      identifying document. If a U.S. Territory
                                      issued the identifying document, select
                                      the applicable U.S. Territory in item 32a
                                      (the same U.S. Territory will then be
                                      automatically populated in item 32b
                                      “State” as a result)
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].otherIssuerCountryText`}
                                    control={control}
                                    render={({ field }) => (
                                      <CountriesSelect
                                        name={field.name}
                                        value={field.value}
                                        onChange={(e) => {
                                          const value = e.target.value
                                          setValue(
                                            `companyApplicants[${index}].otherIssuerStateText`,
                                            "",
                                            { shouldDirty: true }
                                          )
                                          setValue(
                                            `companyApplicants[${index}].issuerLocalTribalCodeText`,
                                            "",
                                            {
                                              shouldDirty: true
                                            }
                                          )
                                          setValue(
                                            `companyApplicants[${index}].otherIssuerLocalTribalText`,
                                            "",
                                            { shouldDirty: true }
                                          )
                                          field.onChange(value)
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                className="mb-3"
                                controlId={`companyApplicants[${index}].otherIssuerStateText-control`}
                              >
                                <Form.Label>b. State</Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 32b – Identifying document issuing
                                        jurisdiction: State:
                                      </strong>{" "}
                                      Enter in item 32a the country/jurisdiction
                                      that issued the company applicant’s
                                      identifying document. If a U.S. Territory
                                      issued the identifying document, select
                                      the applicable U.S. Territory in item 32a
                                      (the same U.S. Territory will then be
                                      automatically populated in item 32b
                                      “State” as a result)
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].otherIssuerStateText`}
                                    control={control}
                                    render={({ field }) => (
                                      <StateSelect
                                        name={field.name}
                                        isInvalid={
                                          !!errors?.companyApplicants?.[index]
                                            ?.otherIssuerStateText
                                        }
                                        countryId={
                                          watch(
                                            `companyApplicants[${index}].otherIssuerCountryText`
                                          ) || "1238"
                                        }
                                        value={field.value}
                                        disabled={isStateDisabled}
                                        onChange={(e) => {
                                          const { value } = e.target
                                          setValue(
                                            `companyApplicants[${index}].issuerLocalTribalCodeText`,
                                            "",
                                            { shouldDirty: true }
                                          )
                                          field.onChange(value)
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                              </Form.Group>
                            </Col>

                            <Col sm={12} md={6}>
                              <Form.Group
                                className="mb-3"
                                controlId={`companyApplicants[${index}].issuerLocalTribalCodeText-control`}
                              >
                                <Form.Label>c. Local/Tribal</Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 32c – Identifying document issuing
                                        jurisdiction: Local/Tribal:
                                      </strong>{" "}
                                      If a local or Tribal government issued the
                                      identifying document, select “United
                                      States” in item 32a and then select the
                                      applicable local or Tribal description in
                                      item 32c. If the name of the relevant
                                      local or Tribal jurisdiction is not
                                      included in the drop-down menu in item
                                      32c, select “Other” and enter the name of
                                      the local or Tribal jurisdiction in item
                                      32d.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].issuerLocalTribalCodeText`}
                                    control={control}
                                    render={({ field }) => (
                                      <TribesSelect
                                        name={field.name}
                                        value={field.value}
                                        disabled={islocalTribalDisabled}
                                        onChange={(e) => {
                                          const value = e.target.value
                                          field.onChange(value)
                                          setValue(
                                            `companyApplicants[${index}].otherIssuerStateText`,
                                            "",
                                            { shouldDirty: true }
                                          )
                                          setValue(
                                            `companyApplicants[${index}].otherIssuerLocalTribalText`,
                                            "",
                                            { shouldDirty: true }
                                          )
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].otherIssuerLocalTribalText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  d. Other local/Tribal description
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 32d – Identifying document issuing
                                        jurisdiction: Other local/Tribal
                                        description:
                                      </strong>{" "}
                                      If a local or Tribal government issued the
                                      identifying document, select “United
                                      States” in item 32a and then select the
                                      applicable local or Tribal description in
                                      item 32c. If the name of the relevant
                                      local or Tribal jurisdiction is not
                                      included in the drop-down menu in item
                                      32c, select “Other” and enter the name of
                                      the local or Tribal jurisdiction in item
                                      32d.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].otherIssuerLocalTribalText`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        disabled={isOtherTribeDisabled}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                              </Form.Group>
                            </Col>

                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`companyApplicants[${index}].file-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 33.
                                  Identifying document image
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 33 – Identifying document image:
                                      </strong>{" "}
                                      Drag a file or click “choose from folder”
                                      to attach a clear, readable image of the
                                      page or side of the identifying document
                                      referenced in item 31 containing the
                                      unique identifying number and other
                                      identifying data. Use the “Remove” button
                                      to remove the attached image if necessary.
                                      An attachment to a BOIR cannot be larger
                                      than four (4) megabytes of data and must
                                      be in one of the following formats:
                                      JPG/JPEG, PNG, or PDF. Only one (1)
                                      attachment file may be added per company
                                      applicant. Attachment file names should
                                      not contain spaces, and can only contain
                                      letters, numbers, or the following
                                      characters !@#$%()_-.=+[]|;~
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`companyApplicants[${index}].file`}
                                    control={control}
                                    render={({ field }) =>
                                      field?.value ? (
                                        <div className="p-2 border">
                                          {watch(
                                            `companyApplicants[${index}].originalAttachmentFileName`
                                          )}{" "}
                                          -{" "}
                                          <Button
                                            onClick={() => {
                                              handleClearSelectedFile(index)
                                            }}
                                            variant="secondary"
                                            size="sm"
                                            type="button"
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      ) : (
                                        <Form.Control
                                          type="file"
                                          // value={field.value?.name}
                                          isInvalid={
                                            !!errors?.companyApplicants?.[index]
                                              ?.file
                                          }
                                          onChange={async (e) => {
                                            const file = e.target.files[0]
                                            if (!file) return

                                            const fileExtension =
                                              getFileExtension(file)
                                            const base64 =
                                              await convertToBase64(file)

                                            setValue(
                                              `companyApplicants[${index}].file`,
                                              file,
                                              {
                                                shouldDirty: true,
                                                shouldValidate: true
                                              }
                                            )
                                            setValue(
                                              `companyApplicants[${index}].ImageFile`,
                                              base64,
                                              {
                                                shouldDirty: true,
                                                shouldValidate: true
                                              }
                                            )
                                            setValue(
                                              `companyApplicants[${index}].PartyIdentificationImageContentType`,
                                              fileExtension,
                                              { shouldDirty: true }
                                            )
                                            setValue(
                                              `companyApplicants[${index}].originalAttachmentFileName`,
                                              file.name,
                                              {
                                                shouldDirty: true,
                                                shouldValidate: true
                                              }
                                            )
                                          }}
                                        />
                                      )
                                    }
                                  />
                                </InputGroupHelpTip>
                                {errors.companyApplicants?.[index]?.file && (
                                  <div className="invalid">
                                    {
                                      errors.companyApplicants?.[index]?.file
                                        .message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </fieldset>
                      </>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            )
          })}
        </Accordion>

        {serverErrors && <ErrorMessages errors={serverErrors} />}

        <div
          style={{ bottom: 0, zIndex: 19 }}
          className="position-sticky bg-white mb-1"
        >
          <hr />
          <Stack direction="horizontal" gap={3} className="pb-3">
            <Button
              type="button"
              onClick={() => {
                setCurrentStep(2)
              }}
            >
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

      {confirmRemoveAppModal.isShown ? (
        <Suspense fallback={null}>
          <ConfirmDialog
            title={`Remove Company Applicant #${confirmRemoveAppModal.appNumber}?`}
            descraption="Are you sure you want to delete this additional Company Applicant page?"
            onApprove={() => {
              handleRemoveApplicant(confirmRemoveAppModal.appNumber)
            }}
            onReject={() => {
              setConfirmRemoveAppModal({ isShown: false, appNumber: null })
            }}
          />
        </Suspense>
      ) : null}

      {checkConfirmModal ? (
        <Suspense fallback={null}>
          <ConfirmDialog
            title="Attention"
            descraption="When Existing Reporting Company is indicated, all Company Applicant fields will be cleared/disabled. Do you wish to continue?"
            onApprove={() => {
              setIsExistReportCheck(true)
              setCheckConfirmModal(false)
              removeAllExceptFirst()
            }}
            onReject={() => {
              setValue("isExistingReportingCompany", false)
              setIsExistReportCheck(false)
              setCheckConfirmModal(false)
            }}
          />
        </Suspense>
      ) : null}
    </>
  )
}

export default CompanyApplicants