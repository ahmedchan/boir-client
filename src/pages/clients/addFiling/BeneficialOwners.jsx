/* eslint-disable react/prop-types */
import { useState, lazy, Suspense, useEffect } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputGroupHelpTip from "@/components/InputGroupHelpTip"
import {
  MainBeneficialInfo,
  CheckboxInfo,
  BeneficialFinCENInfo,
  ExemptEntityInfo,
  LegalDateOfBirthInfo,
  ResidentialAddressInfo,
  IdentificationJurisdictionInfo
} from "./info/BeneficialInfo"
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
import PartyIdentificationCompanyTypeSelect from "@/components/PartyIdentificationCompanyTypeSelect"
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
  beneficialOwners: yup.array().of(
    yup.object().shape({
      finCenid: yup
        .string()
        .notRequired()
        .test(
          "is-valid-format",
          "FinCenId must be in the format 0000-0000-0000",
          (value) => !value || /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/.test(value)
        ),
      rawIndividualFirstName: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema.required("First name is required")
          }
          return schema
        }),
      rawEntityIndividualLastName: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema.required("Last name is required")
          }
          return schema
        }),
      rawIndividualMiddleName: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema.required("Middle name is required")
          }
          return schema
        }),
      rawIndividualNameSuffixText: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema.required("Suffix is required")
          }
          return schema
        }),
      individualBirthDateText: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema.required("Date of birth is required")
          }
          return schema
        }),
      // 3
      rawStreetAddress1Text: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema.required("Address is required")
          }
          return schema
        }),
      rawCityText: yup.string().when(["finCenid"], ([finCenid], schema) => {
        if (finCenid === "" || finCenid.length < 12) {
          return schema.required("City is required")
        }
        return schema
      }),
      rawCountryCodeText: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema
              .required("Country is required")
              .test("required", "Country is required", (value) => {
                return value !== "1001"
              })
          }
          return schema
        }),
      rawStateCodeText: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema
              .required("State is required")
              .test("required", "State is required", (value) => {
                return value !== "1001"
              })
          }
          return schema
        }),
      rawZipcode: yup.string().when(["finCenid"], ([finCenid], schema) => {
        if (finCenid === "" || finCenid.length < 12) {
          return schema
            .matches(/^[0-9]+$/, "Zip code must be digits only!")
            .min(5, "Zip code must be 5 digits or 9")
            .max(9, "Zip code must be 5 digits or 9")
            .required("Zip code  is required")
        }
        return schema
      }),
      //   4
      partyIdentificationTypeCode: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema
              .required("Identification type is required")
              .test("required", "Identification type is required", (value) => {
                return value !== "0"
              })
          }
          return schema
        }),
      partyIdentificationNumberText: yup
        .string()
        .when(["finCenid"], ([finCenid], schema) => {
          if (finCenid === "" || finCenid.length < 12) {
            return schema.required("Identification number is required")
          }
          return schema
        }),
      imageFile: yup.string().when(["finCenid"], ([finCenid], schema) => {
        if (finCenid === "" || finCenid.length < 12) {
          return yup.string().required("Identification file is required")
        }
        return schema
      }),
      file: yup.mixed().when(["finCenid"], ([finCenid], schema) => {
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
        return schema
      })
    })
  )
})

const BeneficialOwners = ({ setCurrentStep }) => {
  const { formData, setFormData } = useFilingForm()
  const [serverErrors, setServerErrors] = useState(null)
  const [activeIndexes, setActiveIndexes] = useState([1])
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
    resolver: yupResolver(schema),
    defaultValues: {
      beneficialOwners: formData.beneficialOwners
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "beneficialOwners" // name of the array in form
  })

  const handleRemoveApplicant = (number) => {
    remove(number)
    setFormData((prev) => ({
      ...prev,
      beneficialOwners: prev.beneficialOwners.filter((b, i) => i !== number)
    }))
    setConfirmRemoveAppModal({ isShown: false, appNumber: null })
  }

  const onSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      beneficialOwners: data.beneficialOwners
    }))

    setTimeout(() => {
      setCurrentStep(5)
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
    setValue(`beneficialOwners[${index}].imageFile`, "", {
      shouldDirty: true,
      shouldValidate: true
    })
    setValue(`beneficialOwners[${index}].file`, "", {
      shouldDirty: true,
      shouldValidate: true
    })
    setValue(
      `beneficialOwners[${index}].PartyIdentificationImageContentType`,
      "",
      { shouldDirty: true }
    )
    setValue(`beneficialOwners[${index}].originalAttachmentFileName`, "", {
      shouldDirty: true
    })
    setFormData((prev) => ({
      ...prev,
      beneficialOwners: prev.beneficialOwners.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            imageFile: "",
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
      beneficialOwners: getValues("beneficialOwners")
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
        beneficialOwners: watch("beneficialOwners")
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
        <div className="d-flex flex-column mb-4">
          <div className="font-italic">
            34. (This item is reserved for future use)
          </div>
        </div>

        <Stack direction="horizontal" gap={3} className="mb-2">
          <h5>Part III. Beneficial Owner Information</h5>
          <Button
            variant="primary"
            className="ms-auto"
            onClick={() => {
              append(formData?.beneficialOwners[0])
              setFormData((prev) => ({
                ...prev,
                beneficialOwners: [
                  ...prev.beneficialOwners,
                  formData?.beneficialOwners[0]
                ]
              }))
            }}
          >
            Add Beneficial Owner
          </Button>
        </Stack>

        {/* help tip */}
        <MainBeneficialInfo />

        <Accordion alwaysOpen>
          {fields.map((field, index) => {
            const fincenIdWatcher = watch(`beneficialOwners[${index}].finCenid`)
            const idJurisdiction = watch(
              `beneficialOwners[${index}].otherIssuerCountryText`
            )
            const stateWatcher = watch(
              `beneficialOwners[${index}].otherIssuerStateText`
            )
            const idLocalTribal = watch(
              `beneficialOwners[${index}].issuerLocalTribalCodeText`
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
                  Beneficial Owner #{index + 1}
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
                    <fieldset>
                      {/* help tip */}
                      <CheckboxInfo />

                      <Form.Group
                        controlId={`beneficialOwners[${index}].parentOrLegalGuardianForMinorChildIndicator-control`}
                        className="mb-3"
                      >
                        <Controller
                          name={`beneficialOwners[${index}].parentOrLegalGuardianForMinorChildIndicator`}
                          control={control}
                          render={({ field }) => (
                            <OverlayTrigger
                              placement="right-start"
                              overlay={
                                <Tooltip>
                                  <strong>
                                    Item 35 – Parent/Guardian information
                                    instead of minor child:
                                  </strong>{" "}
                                  If the beneficial owner for the reporting
                                  company is a minor child, you may check this
                                  box and complete Part III with information
                                  about a parent or legal guardian of the minor
                                  child.
                                </Tooltip>
                              }
                            >
                              <div style={{ width: "fit-content" }}>
                                <Form.Check
                                  {...field}
                                  label="35. Parent/Guardian information instead of minor child"
                                  type="checkbox"
                                  id={`beneficialOwners[${index}].parentOrLegalGuardianForMinorChildIndicator`}
                                  checked={field.value}
                                  onChange={(e) => {
                                    const { checked } = e.target
                                    field.onChange(checked)
                                  }}
                                />
                              </div>
                            </OverlayTrigger>
                          )}
                        />
                        <Form.Text muted>
                          (check if the Beneficial Owner is a minor child and
                          the parent/guardian information is provided instead)
                        </Form.Text>
                      </Form.Group>
                    </fieldset>

                    <hr className="my-4" />

                    {/* 2 */}
                    <fieldset>
                      <h5>Beneficial Owner FinCEN ID</h5>
                      {/* help tip */}
                      <BeneficialFinCENInfo />

                      <Row>
                        <Col sm={12} md={8}>
                          <Form.Group
                            controlId={`beneficialOwners[${index}].finCenid-control`}
                            className="mb-3"
                          >
                            <Form.Label>36. FinCEN ID</Form.Label>
                            <InputGroupHelpTip
                              tipElement={
                                <div>
                                  <strong>Item 36 – FinCEN ID:</strong>{" "}
                                  Reporting companies may provide a FinCEN
                                  Identifier for a beneficial owner instead of
                                  Items 37 through 51. Enter the FinCEN ID as a
                                  single text string. If a FinCEN ID for the
                                  beneficial owner is not provided, information
                                  about the beneficial owner must be provided in
                                  fields 37 through 51.
                                </div>
                              }
                            >
                              <Controller
                                name={`beneficialOwners[${index}].finCenid`}
                                control={control}
                                rules={{
                                  pattern: /^[0-9]{4}-[0-9]{4}-[0-9]{4}$/
                                }}
                                render={({ field }) => (
                                  <Form.Control
                                    {...field}
                                    placeholder="0000-0000-0000"
                                    maxLength={14} // 12 digits + 2 dashes
                                    isInvalid={
                                      !!errors?.beneficialOwners?.[index]
                                        ?.finCenid
                                    }
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
                            {errors?.beneficialOwners?.[index]?.finCenid && (
                              <div className="invalid">
                                {
                                  errors.beneficialOwners[index].finCenid
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

                        {/* 3 */}
                        <fieldset>
                          <h5>Exempt entity</h5>
                          {/* help tip */}
                          <ExemptEntityInfo />

                          <Form.Group
                            controlId={`beneficialOwners[${index}].exemptIndicator-control`}
                            className="mb-3"
                          >
                            <Controller
                              name={`beneficialOwners[${index}].exemptIndicator`}
                              control={control}
                              render={({ field }) => (
                                <OverlayTrigger
                                  placement="right-start"
                                  overlay={
                                    <Tooltip>
                                      <strong>Item 37 – Exempt entity:</strong>{" "}
                                      Check this box if the beneficial owner
                                      holds its ownership interest in the
                                      reporting company exclusively through one
                                      or more exempt entities, and the name of
                                      that exempt entity or entities are being
                                      reported in lieu of the beneficial owner’s
                                      information. If checked, provide the legal
                                      name of the exempt entity in field 38.
                                    </Tooltip>
                                  }
                                >
                                  <div style={{ width: "fit-content" }}>
                                    <Form.Check
                                      {...field}
                                      label="37. Exempt entity"
                                      type="checkbox"
                                      id={`beneficialOwners[${index}].exemptIndicator-checkbox`}
                                      checked={field.value}
                                      onChange={(e) => {
                                        const { checked } = e.target
                                        field.onChange(checked)
                                      }}
                                    />
                                  </div>
                                </OverlayTrigger>
                              )}
                            />
                          </Form.Group>
                        </fieldset>

                        <hr className="my-4" />

                        {/* 4 */}
                        <fieldset>
                          <h5>Legal name and date of birth</h5>
                          {/* help tip */}
                          <LegalDateOfBirthInfo />

                          <Row>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawEntityIndividualLastName-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 38.
                                  Individual&apos;s last name or entity&apos;s
                                  legal name
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 38 – Individual’s last name or
                                        entity’s legal name:
                                      </strong>{" "}
                                      Enter the beneficial owner&apos;s legal
                                      last name or the exempt entity&apos;s
                                      legal name. An entity’s legal name is the
                                      name on the articles of incorporation or
                                      other document that created or registered
                                      the entity. Do not abbreviate names unless
                                      an abbreviation is part of the legal name.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawEntityIndividualLastName`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawEntityIndividualLastName
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.rawEntityIndividualLastName && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.rawEntityIndividualLastName.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawIndividualFirstName-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 39.
                                  First Name
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 39 – First name:</strong>{" "}
                                      Enter the beneficial owner&apos;s legal
                                      first name.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawIndividualFirstName`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawIndividualFirstName
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.rawIndividualFirstName && (
                                  <div className="invalid">
                                    {
                                      errors.beneficialOwners?.[index]
                                        ?.rawIndividualFirstName.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawIndividualMiddleName-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 40.
                                  Middle name
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 40 – Middle name:</strong>{" "}
                                      Enter the beneficial owner&apos;s middle
                                      name if the beneficial owner’s legal name
                                      includes a middle name. Leave this item
                                      blank if the beneficial owner does not
                                      have a middle name.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawIndividualMiddleName`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawIndividualMiddleName
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.rawIndividualMiddleName && (
                                  <div className="invalid">
                                    {
                                      errors.beneficialOwners?.[index]
                                        ?.rawIndividualMiddleName.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawIndividualNameSuffixText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 41.
                                  Suffix
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 41 – Suffix:</strong> Enter
                                      the beneficial owner’s suffix such as JR,
                                      SR, III, etc., if the beneficial owner has
                                      a suffix to their legal name. Leave this
                                      item blank if the beneficial owner’s legal
                                      name does not include a suffix.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawIndividualNameSuffixText`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawIndividualNameSuffixText
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.rawIndividualNameSuffixText && (
                                  <div className="invalid">
                                    {
                                      errors.beneficialOwners?.[index]
                                        ?.rawIndividualNameSuffixText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].individualBirthDateText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 42.
                                  Date of birth
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>Item 42 – Date of birth:</strong>{" "}
                                      Enter the beneficial owner’s date of
                                      birth, using the format MM/DD/YYYY where
                                      MM = month, DD = day, and YYYY = year
                                      (e.g., 01/25/1970). The month, day, and
                                      year must be provided; no partial dates
                                      will be accepted.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].individualBirthDateText`}
                                    control={control}
                                    render={({ field }) => (
                                      <CustomDatePicker
                                        wrapperClassName="datepicker"
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                        selected={new Date(field.value)}
                                        onChange={(date) => {
                                          const d = date?.toISOString()
                                          field.onChange(d)
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.individualBirthDateText && (
                                  <div className="invalid">
                                    {
                                      errors.beneficialOwners?.[index]
                                        ?.individualBirthDateText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </fieldset>

                        <hr className="my-4" />

                        {/* 5 */}
                        <fieldset>
                          <h5>Residential address</h5>
                          {/* help tip */}
                          <ResidentialAddressInfo />

                          <Row>
                            <Col sm={12} md={8}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawStreetAddress1Text-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 43.
                                  Address (number, street, and apt. or suite
                                  no.)
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 43 – Beneficial owner address::
                                        (number, street, and apt. or suite no.):
                                      </strong>{" "}
                                      Enter the beneficial owner’s residential
                                      street address information, including the
                                      city, country or jurisdiction, State, and
                                      ZIP code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 46) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/ Jurisdiction”
                                      (item 45). Item 46 “State” is required if
                                      the country selected in item 45 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawStreetAddress1Text`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawStreetAddress1Text
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.rawStreetAddress1Text && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.rawStreetAddress1Text.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={4}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawCityText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 44.
                                  City
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 44 – Beneficial owner address:
                                        City:
                                      </strong>{" "}
                                      Enter the beneficial owner’s residential
                                      street address information, including the
                                      city, country or jurisdiction, State, and
                                      ZIP code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 46) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/ Jurisdiction”
                                      (item 45). Item 46 “State” is required if
                                      the country selected in item 45 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawCityText`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawCityText
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.rawCityText && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.rawCityText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawCountryCodeText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 45.
                                  Country/Jurisdiction
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 45 – Beneficial owner address:
                                        Country/Jurisdiction:
                                      </strong>{" "}
                                      Enter the beneficial owner’s residential
                                      street address information, including the
                                      city, country or jurisdiction, State, and
                                      ZIP code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 46) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/ Jurisdiction”
                                      (item 45). Item 46 “State” is required if
                                      the country selected in item 45 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawCountryCodeText`}
                                    control={control}
                                    render={({ field }) => (
                                      <CountriesSelect
                                        name={field.name}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            .rawCountryCodeText
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
                                {errors?.beneficialOwners?.[index]
                                  ?.rawCountryCodeText && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.rawCountryCodeText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                className="mb-3"
                                controlId={`beneficialOwners[${index}].rawStateCodeText-control`}
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 28.
                                  State
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 46 – Beneficial owner address:
                                        State:
                                      </strong>{" "}
                                      Enter the beneficial owner’s residential
                                      street address information, including the
                                      city, country or jurisdiction, State, and
                                      ZIP code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 46) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/ Jurisdiction”
                                      (item 45). Item 46 “State” is required if
                                      the country selected in item 45 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawStateCodeText`}
                                    control={control}
                                    render={({ field }) => (
                                      <StateSelect
                                        name={field.name}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawStateCodeText
                                        }
                                        countryId={watch(
                                          `beneficialOwners[${index}].rawCountryCodeText`
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
                                {errors?.beneficialOwners?.[index]
                                  ?.rawStateCodeText && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.rawStateCodeText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].rawZipcode-control`}
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
                                        Item 47 – Beneficial owner address:
                                        ZIP/Foreign postal code:
                                      </strong>{" "}
                                      Enter the beneficial owner’s residential
                                      street address information, including the
                                      city, country or jurisdiction, State, and
                                      ZIP code or foreign postal code. U.S.
                                      Territories are included in the drop-down
                                      menu for “Country/Jurisdiction.” The
                                      “State” (item 46) will be automatically
                                      populated when a U.S. Territory is
                                      selected in the “Country/ Jurisdiction”
                                      (item 45). Item 46 “State” is required if
                                      the country selected in item 45 is the
                                      United States, Canada, or Mexico.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].rawZipcode`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.rawZipcode
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.rawZipcode && (
                                  <div className="invalid">
                                    {
                                      errors.beneficialOwners[index].rawZipcode
                                        .message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        </fieldset>

                        <hr className="my-4" />

                        {/* 6 */}
                        <fieldset>
                          <h5>
                            Form of identification and issuing jurisdiction
                          </h5>
                          {/* help tip */}
                          <IdentificationJurisdictionInfo />

                          <Row>
                            <Col sm={12} md={6}>
                              <Form.Group
                                className="mb-3"
                                controlId={`beneficialOwners[${index}].partyIdentificationTypeCode-control`}
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 48.
                                  Identifying document type
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 48 – Identifying document type:
                                      </strong>{" "}
                                      Select the beneficial owner’s non-expired
                                      identifying document type from the list of
                                      acceptable identification documents: a
                                      State-issued driver’s license, a
                                      State/local/Tribe-issued identification
                                      document issued for the purpose of
                                      identifying the individual, a U.S.
                                      passport, or, only if the beneficial owner
                                      does not have one of these three types of
                                      identifying documents, a foreign passport.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].partyIdentificationTypeCode`}
                                    control={control}
                                    render={({ field }) => (
                                      <PartyIdentificationCompanyTypeSelect
                                        value={field.value}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.partyIdentificationTypeCode
                                        }
                                        name={field.name}
                                        onChange={(e) => {
                                          const { value } = e.target
                                          field.onChange(value)
                                        }}
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.partyIdentificationTypeCode && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.partyIdentificationTypeCode.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col sm={12} md={6}>
                              <Form.Group
                                controlId={`beneficialOwners[${index}].partyIdentificationNumberText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 49.
                                  Identifying document number
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 49 – Identifying document number:
                                      </strong>{" "}
                                      Enter the identifying document number from
                                      the beneficial owner’s identifying
                                      document.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].partyIdentificationNumberText`}
                                    control={control}
                                    render={({ field }) => (
                                      <Form.Control
                                        {...field}
                                        isInvalid={
                                          !!errors?.beneficialOwners?.[index]
                                            ?.partyIdentificationNumberText
                                        }
                                      />
                                    )}
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.partyIdentificationNumberText && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.partyIdentificationNumberText.message
                                    }
                                  </div>
                                )}
                              </Form.Group>
                            </Col>

                            <Col sm={12} className="mt-3">
                              <Form.Label>
                                <strong className="text-danger">*</strong> 50.
                                Identifying document issuing jurisdiction
                              </Form.Label>
                            </Col>

                            <Col sm={12} md={6}>
                              <Form.Group
                                className="mb-3"
                                controlId={`beneficialOwners[${index}].otherIssuerCountryText-control`}
                              >
                                <Form.Label>a. Country/Jurisdiction</Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 50a – Identifying document issuing
                                        jurisdiction: Country/Jurisdiction:
                                      </strong>{" "}
                                      Enter in item 50a the country/jurisdiction
                                      that issued the beneficial owner’s
                                      identifying document. If a U.S. Territory
                                      issued the identifying document, select
                                      the applicable U.S. Territory in item 50a
                                      (the same U.S. Territory will then be
                                      automatically populated in item 50b
                                      “State” as a result).
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].otherIssuerCountryText`}
                                    control={control}
                                    render={({ field }) => (
                                      <CountriesSelect
                                        name={field.name}
                                        value={field.value}
                                        onChange={(e) => {
                                          const { value } = e.target
                                          setValue(
                                            `beneficialOwners[${index}].otherIssuerStateText`,
                                            "",
                                            {
                                              shouldDirty: true
                                            }
                                          )
                                          setValue(
                                            `beneficialOwners[${index}].issuerLocalTribalCodeText`,
                                            "",
                                            {
                                              shouldDirty: true
                                            }
                                          )
                                          setValue(
                                            `beneficialOwners[${index}].otherIssuerLocalTribalText`,
                                            "",
                                            {
                                              shouldDirty: true
                                            }
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
                                controlId={`beneficialOwners[${index}].otherIssuerStateText-control`}
                              >
                                <Form.Label>b. State</Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 50b – Identifying document issuing
                                        jurisdiction: State:
                                      </strong>{" "}
                                      Enter in item 50b the the State that
                                      issued the beneficial owner’s identifying
                                      document. If a U.S. Territory issued the
                                      identifying document, select the
                                      applicable U.S. Territory in item 50a (the
                                      same U.S. Territory will then be
                                      automatically populated in item 50b
                                      “State” as a result).
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].otherIssuerStateText`}
                                    control={control}
                                    render={({ field }) => (
                                      <StateSelect
                                        name={field.name}
                                        countryId={watch(
                                          `beneficialOwners[${index}].otherIssuerCountryText`
                                        )}
                                        disabled={isStateDisabled}
                                        value={field.value}
                                        onChange={(e) => {
                                          const { value } = e.target
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
                                controlId={`beneficialOwners[${index}].issuerLocalTribalCodeText-control`}
                              >
                                <Form.Label>c. Local/Tribal</Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 50c – Identifying document issuing
                                        jurisdiction: Local/Tribal:
                                      </strong>{" "}
                                      If a local or Tribal government issued the
                                      identifying document, select “United
                                      States” in 50a and then select the
                                      applicable local or Tribal description in
                                      item 50c. If the name of the relevant
                                      local or Tribal jurisdiction is not
                                      included in the drop-down menu in item
                                      50c, select “Other” and enter the name of
                                      the local or Tribal jurisdiction in item
                                      50d.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].issuerLocalTribalCodeText`}
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
                                            `beneficialOwners[${index}].otherIssuerLocalTribalText`,
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
                                controlId={`beneficialOwners[${index}].otherIssuerLocalTribalText-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  d. Other local/Tribal description
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 50d – Identifying document issuing
                                        jurisdiction: Other local/Tribal
                                        description:
                                      </strong>{" "}
                                      If a local or Tribal government issued the
                                      identifying document, select “United
                                      States” in 50a and then select the
                                      applicable local or Tribal description in
                                      item 50c. If the name of the relevant
                                      local or Tribal jurisdiction is not
                                      included in the drop-down menu in item
                                      50c, select “Other” and enter the name of
                                      the local or Tribal jurisdiction in item
                                      50d.
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].otherIssuerLocalTribalText`}
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
                                controlId={`beneficialOwners[${index}].imageFile-control`}
                                className="mb-3"
                              >
                                <Form.Label>
                                  <strong className="text-danger">*</strong> 51.
                                  Identifying document image
                                </Form.Label>
                                <InputGroupHelpTip
                                  tipElement={
                                    <div>
                                      <strong>
                                        Item 51 – Identifying document image:
                                      </strong>{" "}
                                      Drag a file or click “choose from folder”
                                      to attach a clear, readable image of the
                                      page or side of the identifying document
                                      referenced in item 49 containing the
                                      unique identifying number and other
                                      identifying data. Use the “Remove” button
                                      to remove the attached image if necessary.
                                      An attachment to a BOIR cannot be larger
                                      than four (4) megabytes of data and must
                                      be in one of the following formats:
                                      JPG/JPEG, PNG, or PDF. Only one (1)
                                      attachment file may be added per
                                      beneficial owner. Attachment file names
                                      should not contain spaces, and can only
                                      contain letters, numbers, or the following
                                      characters !@#$%()_-.=+[]|;~
                                    </div>
                                  }
                                >
                                  <Controller
                                    name={`beneficialOwners[${index}].file`}
                                    control={control}
                                    render={({ field }) =>
                                      field?.value ? (
                                        <div className="p-2 border">
                                          {field.value?.name} -{" "}
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
                                            !!errors.beneficialOwners?.[index]
                                              ?.file
                                          }
                                          onChange={async (e) => {
                                            const file = e.target.files[0]
                                            if (!file) return

                                            const fileExtension =
                                              getFileExtension(file)
                                            const base64 =
                                              await convertToBase64(file)

                                            if (file) {
                                              setValue(
                                                `beneficialOwners[${index}].file`,
                                                file,
                                                {
                                                  shouldDirty: true,
                                                  shouldValidate: true
                                                }
                                              )
                                              setValue(
                                                `beneficialOwners[${index}].ImageFile`,
                                                base64,
                                                {
                                                  shouldDirty: true,
                                                  shouldValidate: true
                                                }
                                              )
                                              setValue(
                                                `beneficialOwners[${index}].PartyIdentificationImageContentType`,
                                                fileExtension,
                                                { shouldDirty: true }
                                              )
                                              setValue(
                                                `beneficialOwners[${index}].originalAttachmentFileName`,
                                                file.name,
                                                {
                                                  shouldDirty: true,
                                                  shouldValidate: true
                                                }
                                              )
                                            }
                                          }}
                                        />
                                      )
                                    }
                                  />
                                </InputGroupHelpTip>
                                {errors?.beneficialOwners?.[index]
                                  ?.imageFile && (
                                  <div className="invalid">
                                    {
                                      errors?.beneficialOwners?.[index]
                                        ?.imageFile.message
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
                setCurrentStep(3)
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
    </>
  )
}

export default BeneficialOwners