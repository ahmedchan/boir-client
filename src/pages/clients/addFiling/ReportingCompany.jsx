/* eslint-disable react/prop-types */
import { useState, useEffect, Suspense, lazy } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useFilingForm } from "@/providers/FilingFormProvider"
import InputGroupHelpTip from "@/components/InputGroupHelpTip"
import {
  MainReportCompanyInfo,
  LegalAlternateInfo,
  IdentificationFormInfo,
  JurisdictionFormationInfo,
  CurrentUSAddressInfo
} from "./info/ReportingCompanyInfo"
import PartyIdentificationCompanyTypeSelect from "@/components/PartyIdentificationCompanyTypeSelect"
import {
  Form,
  Button,
  Row,
  Col,
  Stack,
  OverlayTrigger,
  Tooltip,
  Spinner
} from "react-bootstrap"
import { useDynamicList } from "ahooks"
import { OrganizationClassificationTypeSubtype, PartyNameType } from "@/enums"
import CountriesSelect from "@/components/CountriesSelect"
import ForeignCountrySelect from "@/components/ForeignCountrySelect"
import AmericanCountrySelect from "@/components/AmericanCountrySelect"
import TribesSelect from "@/components/TribesSelect"
import StateSelect from "@/components/StateSelect"
import { useSaveReportMutation } from "@/services/reports.sevice"
import toast from "react-hot-toast"
import ErrorMessages from "@/components/ErrorMessages"
// lazy
const ConfirmDialog = lazy(() => import("@/components/ConfirmDialog"))

// Yup schema for form validation
const schema = yup.object().shape({
  companyName: yup.array().of(
    yup.object().shape({
      companyName: yup.string().required("Legal name is required"),
      companyNameTypeCode: yup.string(),
      partyNameId: yup.string()
    })
  ),
  partyIdentificationTypeCode: yup
    .string()
    .required("Tax Identification type is required")
    .test("stillRequired", "Tax Identification type is required", (value) => {
      return value && value !== "0"
    }),
  partyIdentificationNumberText: yup
    .string()
    .required("Identification number is required"),
  otherIssuerCountryText: yup
    .string()
    .when(
      ["partyIdentificationTypeCode"],
      ([partyIdentificationTypeCode], schema) => {
        if (partyIdentificationTypeCode === "9") {
          return yup.string().required("Country is required for foreign tax ID")
        }
        return schema
      }
    ),
  otherIssuerStateText: yup.string(),
  formationCountryCodeText: yup
    .string()
    .required("Jurisdiction of formation is required")
    .test("stillRequired", "Jurisdiction of formation is required", (value) => {
      return value && value !== "1001"
    }),
  formationStateCodeText: yup
    .string()
    .when(
      ["formationCountryCodeText"],
      ([formationCountryCodeText], schema) => {
        if (
          formationCountryCodeText === "1001" ||
          formationCountryCodeText === "1238"
        ) {
          return yup
            .string()
            .required("Select a valid state")
            .test("stillRequired", "Select a valid state", (value) => {
              return value && value !== "1001"
            })
        }
        return schema
      }
    ),
  formationLocalTribalCodeText: yup.string(),
  otherFormationLocalTribalText: yup
    .string()
    .when(
      ["formationLocalTribalCodeText"],
      ([formationLocalTribalCodeText], schema) => {
        if (formationLocalTribalCodeText === "1000") {
          return yup.string().required("please write down your triba!")
        }
        return schema
      }
    ),

  rawStreetAddress1Text: yup.string().required("Address is required"),
  rawCityText: yup.string().required("City is required"),
  rawCountryCodeText: yup.string().required("Country is required"),
  rawStateCodeText: yup.string().required("State is required"),
  rawZipcode: yup
    .string()
    .matches(/^[0-9]+$/, "Zip code must be digits only!")
    .min(5, "Zip code must be 5 digits or 9")
    .max(9, "Zip code must be 5 digits or 9")
    .required("Zip code is required")
})

const ReportingCompanyFormStep = ({ setCurrentStep }) => {
  const { formData, setFormData } = useFilingForm()
  const { list, remove, push, replace } = useDynamicList(
    formData?.reportingCompany?.companyName
  )
  // pending checkbox
  const [serverErrors, setServerErrors] = useState(null)
  const [pendingCheck, setPendingCheck] = useState(false)
  const [isForigenChecked, setIsForigenChecked] = useState(
    formData.reportingCompany?.organizationTypeId ==
      OrganizationClassificationTypeSubtype.FOREIGN_POOLED_INVESTMENT_VEHICLE
  )
  const [checkConfirmModal, setCheckConfirmModal] = useState(false)

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
      partyId: formData.reportingCompany.partyId,
      requestFinCenidindicator:
        formData.reportingCompany?.requestFinCenidindicator,
      organizationTypeId: formData.reportingCompany?.organizationTypeId,
      companyName: list,
      partyIdentificationTypeCode:
        formData?.reportingCompany?.partyIdentificationTypeCode,
      partyIdentificationNumberText:
        formData.reportingCompany?.partyIdentificationNumberText,
      otherIssuerCountryText: formData.reportingCompany?.otherIssuerCountryText,
      otherIssuerStateText: formData.reportingCompany?.otherIssuerStateText,
      formationCountryCodeText:
        formData.reportingCompany?.formationCountryCodeText,
      formationStateCodeText: formData.reportingCompany?.formationStateCodeText,
      formationLocalTribalCodeText:
        formData.reportingCompany?.formationLocalTribalCodeText,
      otherFormationLocalTribalText:
        formData.reportingCompany?.otherFormationLocalTribalText,
      rawStreetAddress1Text: formData.reportingCompany?.rawStreetAddress1Text,
      rawCityText: formData.reportingCompany?.rawCityText,
      rawCountryCodeText: formData.reportingCompany?.rawCountryCodeText,
      rawStateCodeText: formData.reportingCompany?.rawStateCodeText,
      rawZipcode: formData.reportingCompany?.rawZipcode
    }
  })
  // watchers
  const partyIdentificationTypeCodeWatcher = watch(
    "partyIdentificationTypeCode"
  )
  const otherIssuerCountryTextWatcher = watch("otherIssuerCountryText")
  const formationCountryCodeTextWatcher = watch("formationCountryCodeText")
  const formationLocalTribalCodeTextWatcher = watch(
    "formationLocalTribalCodeText"
  )
  const rawCountryCodeTextWatcher = watch("rawCountryCodeText")

  // Open confirmation modal
  const handleCheckboxClick = (e) => {
    const checked = e.target.checked
    setPendingCheck(!pendingCheck) // Store the intended check state
    if (isForigenChecked) {
      // setValue("organizationTypeId", OrganizationClassificationTypeSubtype.FOREIGN_POOLED_INVESTMENT_VEHICLE)
      setIsForigenChecked(checked)
    } else {
      setCheckConfirmModal(true) // Show modal for confirmation
      // setValue("organizationTypeId", OrganizationClassificationTypeSubtype.NOT_APPLICABLE)
    }

    const value = checked
      ? OrganizationClassificationTypeSubtype.FOREIGN_POOLED_INVESTMENT_VEHICLE
      : OrganizationClassificationTypeSubtype.NOT_APPLICABLE
    setValue("organizationTypeId", value)
  }

  useEffect(() => {
    setValue("companyName", list)
  }, [list, setValue])

  const onSubmit = (data) => {
    setFormData((prev) => ({
      ...prev,
      reportingCompany: { ...prev.reportingCompany, ...data }
    }))

    setTimeout(() => {
      setCurrentStep(3)
    }, 0)
  }

  const handleOnSaveDraft = async () => {
    const json = { ...formData, reportingCompany: getValues() }
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

  // save local date when unmout component only
  useEffect(() => {
    return () => {
      setFormData((prev) => ({
        ...prev,
        reportingCompany: watch()
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
        <h4>Part 1: Reporting Company Information</h4>

        {/* help box */}
        <MainReportCompanyInfo />

        <div className="d-flex flex-column gap-2 mb-4">
          <Controller
            name="requestFinCenidindicator"
            control={control}
            render={({ field }) => (
              <OverlayTrigger
                placement="right-start"
                overlay={
                  <Tooltip>
                    <strong>
                      Item 3 – Request to receive FinCEN Identifier (FinCEN ID):
                    </strong>{" "}
                    Check this box to receive a unique FinCEN Identifier for the
                    reporting company. The FinCEN Identifier will be provided in
                    the submission confirmation details provided to the filer
                    after the BOIR is accepted.
                  </Tooltip>
                }
              >
                <div style={{ width: "fit-content" }}>
                  <Form.Check
                    {...field}
                    label="3. Request to receive FinCEN ID"
                    type="checkbox"
                    id={`requestToReciveCheckbox`}
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

          <OverlayTrigger
            placement="right-start"
            overlay={
              <Tooltip>
                <strong>Item 4 – Foreign pooled investment vehicle:</strong>{" "}
                Check this box if the reporting company is a foreign pooled
                investment vehicle required to report information pursuant to 31
                CFR 1010.380(b)(2)(iii). If the reporting company is a foreign
                pooled investment vehicle, the company need only report one
                beneficial owner who exercises substantial control over the
                entity. If more than one individual exercise substantial control
                over the entity, the entity shall report information with
                respect to the individual who has the greatest authority over
                the strategic management of the entity. The report should not
                include any information about company applicants.
              </Tooltip>
            }
          >
            <div style={{ width: "fit-content" }}>
              <Form.Check
                name="organizationTypeId"
                label="4. Foreign pooled investment vehicle"
                type="checkbox"
                id={`forigenCheckbox`}
                checked={isForigenChecked}
                onChange={handleCheckboxClick} // Capture the checkbox click event
              />
            </div>
          </OverlayTrigger>
        </div>

        <hr className="my-4" />

        <fieldset>
          <h5>Legal name and alternate name(s)</h5>

          {/* help box */}
          <LegalAlternateInfo />

          {list.map((item, index) => {
            return (
              <Row className="mb-3" key={index}>
                <Col sm={12} md={9}>
                  <Form.Group
                    controlId={`companyName[${index}].companyName-control`}
                  >
                    <Form.Label>
                      {index === 0
                        ? "5. Reporting Company legal name"
                        : "6. Alternate name (e.g. trade name, DBA)"}
                    </Form.Label>
                    <InputGroupHelpTip
                      tipElement={
                        index === 0 ? (
                          <div>
                            <strong>
                              Item 5 – Reporting company legal name:
                            </strong>{" "}
                            Enter the reporting company’s full legal name as
                            recorded on the articles of incorporation or other
                            documents creating or registering the entity.
                          </div>
                        ) : (
                          <div>
                            <strong>Item 6 – Alternate name:</strong> Enter any
                            of the reporting company’s trade names, “doing
                            business as” or DBA names, or “trading as” or T/A
                            names. If the reporting company has multiple
                            alternate names, use the “+” or “-“ buttons in the
                            BOIR to add additional alternate name fields (one
                            field for each alternate name). Do not include the
                            acronyms DBA or AKA with the alternate name.
                          </div>
                        )
                      }
                    >
                      <Controller
                        name={`companyName[${index}].companyName`}
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            isInvalid={
                              !!errors?.companyName?.[index]?.companyName
                            }
                            value={field.value}
                            onChange={(e) => {
                              const { value } = e.target
                              field.onChange(value)
                              replace(index, {
                                companyName: value,
                                companyNameTypeCode: watch(
                                  `companyName[${index}].companyNameTypeCode`
                                ),
                                partyNameId: watch(
                                  `companyName[${index}].partyNameId`
                                )
                              })
                            }}
                          />
                        )}
                      />
                    </InputGroupHelpTip>

                    {errors?.companyName?.[index]?.companyName && (
                      <div className="invalid">
                        {errors?.companyName?.[index]?.companyName.message}
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group>
                    <Form.Label>&nbsp;</Form.Label>
                    <div>
                      {list.length > 1 && index !== 0 && (
                        <Button
                          type="button"
                          key={index}
                          variant="secondary"
                          onClick={() => {
                            remove(index)
                          }}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )
          })}

          <Button
            type="button"
            variant="primary"
            onClick={() => {
              push({
                companyName: "",
                companyNameTypeCode: PartyNameType.DBA_NAME,
                partyNameId:
                  formData?.reportingCompany?.companyName[0].partyNameId
              })
            }}
          >
            Add Alternate Name
          </Button>
        </fieldset>

        <hr className="my-4" />

        <fieldset>
          <h5>Form of identification</h5>

          {/* help box */}
          <IdentificationFormInfo />

          <Row>
            <Col sm={12} md={9}>
              <Form.Group
                className="mb-3"
                controlId="partyIdentificationTypeCode-control"
              >
                <Form.Label>
                  <strong className="text-danger">*</strong> 7. Tax
                  Identification type
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>Item 7 – Tax identification type:</strong> Select
                      “EIN” if the reporting company has a U.S. Employer
                      Identification Number (EIN). Select “SSN-ITIN” if the
                      reporting company utilizes a U.S. Social Security Number
                      (SSN) or Individual Taxpayer Identification Number (ITIN)
                      as a tax identification number. Select “Foreign” if the
                      reporting company has a tax identification number issued
                      by a foreign jurisdiction and does not have a U.S. tax
                      identification number.
                    </div>
                  }
                >
                  <Controller
                    name="partyIdentificationTypeCode"
                    control={control}
                    render={({ field }) => (
                      <PartyIdentificationCompanyTypeSelect
                        name={field.name}
                        isInvalid={!!errors?.partyIdentificationTypeCode}
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </InputGroupHelpTip>

                {errors?.partyIdentificationTypeCode && (
                  <div className="invalid">
                    {errors.partyIdentificationTypeCode.message}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={12} md={9}>
              <Form.Group
                className="mb-3"
                controlId="partyIdentificationNumberText-control"
              >
                <Form.Label>
                  <span className="text-danger">*</span> 8. Tax Identification
                  number
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>Item 8 – Tax identification number:</strong> Enter
                      the tax identification number for the reporting company.
                    </div>
                  }
                >
                  <Controller
                    name="partyIdentificationNumberText"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        disabled={
                          partyIdentificationTypeCodeWatcher === "1001" ||
                          partyIdentificationTypeCodeWatcher === 0
                        }
                        isInvalid={!!errors?.partyIdentificationNumberText}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors?.partyIdentificationNumberText && (
                  <div className="invalid">
                    {errors.partyIdentificationNumberText.message}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={12} md={6}>
              <Form.Group
                className="mb-3"
                controlId="otherIssuerCountryText-control"
              >
                <Form.Label>
                  9a. Country/Jurisdiction (if foreign tax ID only)
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>Item 9 – Country/Jurisdiction:</strong> If the tax
                      identification type in item 7 is “Foreign”, select the
                      foreign country/jurisdiction that issued the foreign tax
                      identification number.
                    </div>
                  }
                >
                  <Controller
                    name="otherIssuerCountryText"
                    control={control}
                    render={({ field }) => (
                      <ForeignCountrySelect
                        name={field.name}
                        disabled={partyIdentificationTypeCodeWatcher !== "9"}
                        isInvalid={!!errors?.otherIssuerCountryText}
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors?.otherIssuerCountryText && (
                  <div className="invalid">
                    {errors.otherIssuerCountryText.message}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={12} md={6}>
              <Form.Group
                className="mb-3"
                controlId="otherIssuerStateText-control"
              >
                <Form.Label>9b. State (if foreign tax ID only)</Form.Label>
                <Controller
                  name="otherIssuerStateText"
                  control={control}
                  render={({ field }) => (
                    <StateSelect
                      countryId={otherIssuerCountryTextWatcher}
                      name={field.name}
                      disabled={
                        watch("otherIssuerCountryText") === "" ||
                        watch("otherIssuerCountryText") === "1001"
                      }
                      value={field.value}
                      onChange={(e) => {
                        const { value } = e.target
                        field.onChange(value)
                      }}
                    />
                  )}
                />
              </Form.Group>
            </Col>
          </Row>
        </fieldset>

        <hr className="my-4" />

        <fieldset>
          <h5>Jurisdiction of formation or first registration</h5>

          {/* help box */}
          <JurisdictionFormationInfo />

          <Row>
            <Col sm={12} md={9}>
              <Form.Group
                className="mb-3"
                controlId="formationCountryCodeText-control"
              >
                <Form.Label>
                  <strong className="text-danger">*</strong> 10. a.
                  Country/Jurisdiction of formation
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>
                        Item 10 – Jurisdiction of formation or first
                        registration:
                      </strong>{" "}
                      Enter the country/jurisdiction of formation in item 10a.
                      If United States is selected in 10a, then items 10b–10d
                      should be completed, identifying the State or Tribal
                      jurisdiction of formation. If a U.S. Territory is selected
                      in 10a, then item 10b is automatically populated with the
                      relevant U.S. Territory, and items 10c and 10d are
                      unavailable. If Item 10a is a foreign country, then item
                      10e – 10f should be completed, identifying the State/U.S.
                      Territory or Tribal jurisdiction in which the foreign
                      reporting company first registered to do business in the
                      United States. If the Tribal jurisdiction of formation
                      (10c) or Tribal jurisdiction of first registration (10f)
                      is not listed in the drop-down, select “Other” and enter
                      the name of the Tribe in 10d or 10g.
                    </div>
                  }
                >
                  <Controller
                    name="formationCountryCodeText"
                    control={control}
                    render={({ field }) => (
                      <CountriesSelect
                        name={field.name}
                        isInvalid={!!errors?.formationCountryCodeText}
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors?.formationCountryCodeText && (
                  <div className="invalid">
                    {errors.formationCountryCodeText.message}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          {formationCountryCodeTextWatcher &&
          formationCountryCodeTextWatcher !== "1001" ? (
            <>
              <h5 className="mt-2">Domestic Reporting Company</h5>

              <Row className="mt-3">
                <Col sm={7}>
                  <Form.Group
                    className="mb-3"
                    controlId="formationStateCodeText-control"
                  >
                    <Form.Label>b. State of formation</Form.Label>
                    <Controller
                      name="formationStateCodeText"
                      control={control}
                      render={({ field }) => (
                        <StateSelect
                          name={field.name}
                          disabled={formationCountryCodeTextWatcher === "1001"}
                          isInvalid={!!errors?.formationStateCodeText}
                          countryId={formationCountryCodeTextWatcher}
                          value={field.value}
                          onChange={(e) => {
                            const { value } = e.target
                            field.onChange(value)
                          }}
                        />
                      )}
                    />
                    {errors.formationStateCodeText && (
                      <div className="invalid">
                        {errors.formationStateCodeText.message}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </>
          ) : null}

          {formationCountryCodeTextWatcher &&
          formationCountryCodeTextWatcher !== "1001" &&
          formationCountryCodeTextWatcher !== "1238" ? (
            <Row className="mt-3">
              <Col sm={12} md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="formationLocalTribalCodeText-control"
                >
                  <Form.Label>c. Tribal jurisdiction of formation</Form.Label>
                  <Controller
                    name="formationLocalTribalCodeText"
                    control={control}
                    render={({ field }) => (
                      <TribesSelect
                        name={field.name}
                        disabled={
                          formationCountryCodeTextWatcher === "1001" ||
                          formationCountryCodeTextWatcher === "1238"
                        }
                        isInvalid={!!errors?.formationLocalTribalCodeText}
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                  {errors?.formationLocalTribalCodeText && (
                    <div className="invalid">
                      {errors.formationLocalTribalCodeText.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group
                  className="mb-3"
                  controlId="otherFormationLocalTribalText-control"
                >
                  <Form.Label>d. Name of the other Tribe</Form.Label>
                  <Controller
                    name="otherFormationLocalTribalText"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        disabled={
                          formationLocalTribalCodeTextWatcher !== "1000"
                        }
                        isInvalid={!!errors?.otherFormationLocalTribalText}
                      />
                    )}
                  />
                  {errors?.otherFormationLocalTribalText && (
                    <div className="invalid">
                      {errors.otherFormationLocalTribalText.message}
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          ) : null}
        </fieldset>

        <hr className="my-4" />

        <fieldset>
          <h5>Current U.S. address</h5>

          {/* help box */}
          <CurrentUSAddressInfo />

          <Row>
            <Col sm={12} md={8}>
              <Form.Group
                controlId="rawStreetAddress1Text-control"
                className="mb-3"
              >
                <Form.Label>
                  <strong className="text-danger">*</strong>
                  11. Address (number, street, and apt. or suite no.)
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>
                        Item 11 – Reporting company address: registration:
                      </strong>{" "}
                      Enter the reporting company’s complete current street
                      address information, including city, State, ZIP Code, and
                      select in item 13 whether the address is in the United
                      States or a specific U.S. Territory. If the reporting
                      company has a principal place of business in the United
                      States or U.S. Territory, the street address should be
                      that of the principal place of business. Otherwise, the
                      street address should be the primary location in the
                      United States or U.S. Territory where the reporting
                      company conducts business. If a U.S. Territory is selected
                      in item 13, then item 14 is automatically populated with
                      the relevant U.S. Territory.
                    </div>
                  }
                >
                  <Controller
                    name="rawStreetAddress1Text"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        isInvalid={!!errors?.rawStreetAddress1Text}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors?.rawStreetAddress1Text && (
                  <div className="invalid">
                    {errors.rawStreetAddress1Text.message}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={12} md={4}>
              <Form.Group controlId="rawCityText-control" className="mb-3">
                <Form.Label>
                  <strong className="text-danger">*</strong>
                  12. City
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>
                        Item 12 – Reporting company address: registration:
                      </strong>{" "}
                      Enter the reporting company’s complete current street
                      address information, including city, State, ZIP Code, and
                      select in item 13 whether the address is in the United
                      States or a specific U.S. Territory. If the reporting
                      company has a principal place of business in the United
                      States or U.S. Territory, the street address should be
                      that of the principal place of business. Otherwise, the
                      street address should be the primary location in the
                      United States or U.S. Territory where the reporting
                      company conducts business. If a U.S. Territory is selected
                      in item 13, then item 14 is automatically populated with
                      the relevant U.S. Territory.
                    </div>
                  }
                >
                  <Controller
                    name="rawCityText"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        isInvalid={!!errors?.rawCityText}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors?.rawCityText && (
                  <div className="invalid">{errors.rawCityText.message}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="rawCountryCodeText-control"
              >
                <Form.Label>
                  <strong className="text-danger">*</strong> 13. U.S. or U.S.
                  Territory
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>
                        Item 13 – Reporting company address: registration:
                      </strong>{" "}
                      Enter the reporting company’s complete current street
                      address information, including city, State, ZIP Code, and
                      select in item 13 whether the address is in the United
                      States or a specific U.S. Territory. If the reporting
                      company has a principal place of business in the United
                      States or U.S. Territory, the street address should be
                      that of the principal place of business. Otherwise, the
                      street address should be the primary location in the
                      United States or U.S. Territory where the reporting
                      company conducts business. If a U.S. Territory is selected
                      in item 13, then item 14 is automatically populated with
                      the relevant U.S. Territory.
                    </div>
                  }
                >
                  <Controller
                    name="rawCountryCodeText"
                    control={control}
                    render={({ field }) => (
                      <AmericanCountrySelect
                        name={field.name}
                        isInvalid={!!errors?.rawCountryCodeText}
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors?.rawCountryCodeText && (
                  <div className="invalid">
                    {errors.rawCountryCodeText.message}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="rawStateCodeText-control">
                <Form.Label>
                  <strong className="text-danger">*</strong> 14. State
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>
                        Item 14 – Reporting company address: registration:
                      </strong>{" "}
                      Enter the reporting company’s complete current street
                      address information, including city, State, ZIP Code, and
                      select in item 13 whether the address is in the United
                      States or a specific U.S. Territory. If the reporting
                      company has a principal place of business in the United
                      States or U.S. Territory, the street address should be
                      that of the principal place of business. Otherwise, the
                      street address should be the primary location in the
                      United States or U.S. Territory where the reporting
                      company conducts business. If a U.S. Territory is selected
                      in item 13, then item 14 is automatically populated with
                      the relevant U.S. Territory.
                    </div>
                  }
                >
                  <Controller
                    name="rawStateCodeText"
                    control={control}
                    render={({ field }) => (
                      <StateSelect
                        name={field.name}
                        isInvalid={!!errors?.rawStateCodeText}
                        countryId={rawCountryCodeTextWatcher}
                        disabled={rawCountryCodeTextWatcher === "1001"}
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors?.rawStateCodeText && (
                  <div className="invalid">
                    {errors.rawStateCodeText.message}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="rawZipcode-control" className="mb-3">
                <Form.Label>
                  <strong className="text-danger">*</strong>
                  15. ZIP code
                </Form.Label>
                <InputGroupHelpTip
                  tipElement={
                    <div>
                      <strong>
                        Item 15 – Reporting company address: registration:
                      </strong>{" "}
                      Enter the reporting company’s complete current street
                      address information, including city, State, ZIP Code, and
                      select in item 13 whether the address is in the United
                      States or a specific U.S. Territory. If the reporting
                      company has a principal place of business in the United
                      States or U.S. Territory, the street address should be
                      that of the principal place of business. Otherwise, the
                      street address should be the primary location in the
                      United States or U.S. Territory where the reporting
                      company conducts business. If a U.S. Territory is selected
                      in item 13, then item 14 is automatically populated with
                      the relevant U.S. Territory.
                    </div>
                  }
                >
                  <Controller
                    name="rawZipcode"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        isInvalid={!!errors?.rawZipcode}
                      />
                    )}
                  />
                </InputGroupHelpTip>
                {errors.rawZipcode && (
                  <div className="invalid">{errors.rawZipcode.message}</div>
                )}
              </Form.Group>
            </Col>
          </Row>
        </fieldset>

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
                setCurrentStep(1)
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

      {checkConfirmModal ? (
        <Suspense fallback={null}>
          <ConfirmDialog
            title="Attention"
            descraption="When foreign pooled investment vehicle is indicated, all Company Applicant fields and all Beneficial Owners (except the first Beneficial Owner) will be cleared/disabled. Do you wish to continue?"
            onApprove={() => {
              setValue(
                "organizationTypeId",
                OrganizationClassificationTypeSubtype.FOREIGN_POOLED_INVESTMENT_VEHICLE
              )
              setIsForigenChecked(true)
              setCheckConfirmModal(false)
            }}
            onReject={() => {
              setValue(
                "organizationTypeId",
                OrganizationClassificationTypeSubtype.NOT_APPLICABLE
              )
              setIsForigenChecked(false)
              setCheckConfirmModal(false)
            }}
          />
        </Suspense>
      ) : null}
    </>
  )
}

export default ReportingCompanyFormStep
