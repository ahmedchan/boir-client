import { useEffect, useState } from "react"
import {
  useGetReportByIdQuery,
  useGetBOIRbillingDataQuery
} from "@/services/reports.sevice"
import { Spinner, Alert } from "react-bootstrap"
import { useParams } from "react-router-dom"
import { useFilingForm } from "@/providers/FilingFormProvider"

const WithReportIdHOC = (Component) => {
  const SubComponent = (props) => {
    const dateNow = new Date()
    const { reportId, Clientid } = useParams()
    const { setFormData } = useFilingForm()
    const [pass, setPass] = useState(false)
    // api
    const { data, isError, isLoading, error } = useGetReportByIdQuery({
      reportId
    })
    const { data: boirData, isLoading: isLoadingBoirData } =
      useGetBOIRbillingDataQuery(
        { reportIds: [reportId] },
        { skip: !reportId, refetchOnMountOrArgChange: true }
      )

    useEffect(() => {
      if (data) {
        setFormData({
          filingInformation: {
            activityId: data.filingInformation.activityId,
            boireportId: data.filingInformation.boireportId,
            boirfilingTypeId: data.filingInformation.boirfilingTypeId,
            efilingPriorReportingCompanyName:
              data.filingInformation.efilingPriorReportingCompanyName,
            efilingPriorReportingCompanyIdentificationTypeCode:
              data.filingInformation
                .efilingPriorReportingCompanyIdentificationTypeCode,
            efilingPriorReportingCompanyIdentificationNumberText:
              data.filingInformation
                .efilingPriorReportingCompanyIdentificationNumberText,
            efilingPriorReportingCompanyIssuerCountryCodeText:
              data.filingInformation
                .efilingPriorReportingCompanyIssuerCountryCodeText,
            filingDateText:
              data.filingInformation.filingDateText || dateNow.toISOString()
          },
          reportingCompany: {
            companyName: data.reportingCompany.companyName?.$values?.map(
              (i) => ({
                companyName: i.companyName,
                companyNameTypeCode: i.companyNameTypeCode,
                partyNameId: i.partyNameId
              })
            ),
            existingReportingCompanyIndicator:
              data.reportingCompany.existingReportingCompanyIndicator,
            formationCountryCodeText:
              data.reportingCompany?.formationCountryCodeText?.toString(),
            formationLocalTribalCodeText:
              data.reportingCompany?.formationLocalTribalCodeText || "",
            formationStateCodeText:
              data.reportingCompany?.formationStateCodeText?.toString() || "",
            organizationTypeId: data.reportingCompany?.organizationTypeId,
            otherFormationLocalTribalText:
              data.reportingCompany?.otherFormationLocalTribalText || "",
            otherIssuerCountryText:
              data.reportingCompany?.otherIssuerCountryText?.toString() || "",
            otherIssuerStateText:
              data.reportingCompany?.otherIssuerStateText?.toString() || "",
            partyAddressId: data.reportingCompany?.partyAddressId,
            partyId: data.reportingCompany?.partyId,
            partyIdentificationId: data.reportingCompany?.partyIdentificationId,
            partyIdentificationNumberText:
              data.reportingCompany?.partyIdentificationNumberText,
            partyIdentificationTypeCode:
              data.reportingCompany?.partyIdentificationTypeCode?.toString(),
            rawCityText: data.reportingCompany?.rawCityText,
            rawCountryCodeText:
              data.reportingCompany?.rawCountryCodeText?.toString() || "",
            rawStateCodeText:
              data.reportingCompany?.rawStateCodeText?.toString() || "",
            rawStreetAddress1Text: data.reportingCompany?.rawStreetAddress1Text,
            rawZipcode: data.reportingCompany?.rawZipcode,
            requestFinCenidindicator:
              data.reportingCompany?.requestFinCenidindicator
          },
          companyApplicants: data.companyApplicants?.$values?.map((i) => ({
            existingReportingCompanyIndicator:
              data.reportingCompany.existingReportingCompanyIndicator,
            businessAddressIndicator: i.businessAddressIndicator,
            finCenid: i.finCenid || "",
            individualBirthDateText:
              i.individualBirthDateText || dateNow.toISOString(),
            issuerLocalTribalCodeText: i.issuerLocalTribalCodeText || "",
            originalAttachmentFileName: i.originalAttachmentFileName || "",
            otherIssuerCountryText: i.otherIssuerCountryText?.toString() || "",
            otherIssuerLocalTribalText:
              i.otherIssuerLocalTribalText?.toString() || "",
            otherIssuerStateText: i.otherIssuerStateText?.toString() || "",
            partyAddressId: i.partyAddressId,
            partyId: i.partyId,
            partyIdentificationId: i.partyIdentificationId,
            partyIdentificationImage: i.partyIdentificationImage || "",
            partyIdentificationNumberText: i.partyIdentificationNumberText,
            partyIdentificationTypeCode: i.partyIdentificationTypeCode,
            partyNameId: i.partyNameId,
            rawCityText: i.rawCityText,
            rawCountryCodeText: i.rawCountryCodeText?.toString() || "",
            rawEntityIndividualLastName: i.rawEntityIndividualLastName,
            rawIndividualFirstName: i.rawIndividualFirstName,
            rawIndividualMiddleName: i.rawIndividualMiddleName,
            rawIndividualNameSuffixText: i.rawIndividualNameSuffixText || "",
            rawStateCodeText: i.rawStateCodeText?.toString() || "",
            rawStreetAddress1Text: i.rawStreetAddress1Text,
            rawZipcode: i.rawZipcode,
            ImageFile: i.imageFile || "",
            PartyIdentificationImageContentType:
              i?.PartyIdentificationImageContentType || ""
          })),
          beneficialOwners: data.beneficialOwners?.$values
            ?.map((i) => ({
              exemptIndicator: i.exemptIndicator,
              finCenid: i.finCenid || "",
              individualBirthDateText:
                i.individualBirthDateText || dateNow.toISOString(),
              issuerLocalTribalCodeText: i.issuerLocalTribalCodeText || "",
              originalAttachmentFileName: i.originalAttachmentFileName || "",
              otherIssuerCountryText:
                i.otherIssuerCountryText?.toString() || "",
              otherIssuerLocalTribalText: i.otherIssuerLocalTribalText || "",
              otherIssuerStateText: i.otherIssuerStateText?.toString() || "",
              parentOrLegalGuardianForMinorChildIndicator:
                i.parentOrLegalGuardianForMinorChildIndicator,
              partyAddressId: i.partyAddressId,
              partyId: i.partyId,
              partyIdentificationId: i.partyIdentificationId,
              partyIdentificationImage: i.partyIdentificationImage || "",
              partyIdentificationNumberText: i.partyIdentificationNumberText,
              partyIdentificationTypeCode: i.partyIdentificationTypeCode,
              partyNameId: i.partyNameId,
              partyNameTypeCode: i.partyNameTypeCode,
              rawCityText: i.rawCityText,
              rawCountryCodeText: i.rawCountryCodeText?.toString() || "",
              rawEntityIndividualLastName: i.rawEntityIndividualLastName,
              rawIndividualFirstName: i.rawIndividualFirstName,
              rawIndividualMiddleName: i.rawIndividualMiddleName,
              rawIndividualNameSuffixText: i.rawIndividualNameSuffixText || "",
              rawStateCodeText: i.rawStateCodeText?.toString() || "",
              rawStreetAddress1Text: i.rawStreetAddress1Text,
              rawZipcode: i.rawZipcode,
              imageFile: i.imageFile || "",
              PartyIdentificationImageContentType:
                i?.PartyIdentificationImageContentType || ""
            }))
            ?.reverse(),
          submissionInformation: {
            email: data.submissionInformation.email,
            firstName: data.submissionInformation.firstName,
            lastName: data.submissionInformation.lastName,
            authorized: data.submissionInformation.authorized
          }
        })

        setTimeout(() => {
          setPass(true)
        }, 0)
      }
    }, [data])

    if (isLoading || isLoadingBoirData || !pass) {
      return (
        <div className="d-flex align-items-center justify-content-center w-100 p-4">
          <Spinner size="lg" />
        </div>
      )
    }

    if (isError) {
      return (
        <Alert variant="danger">
          {error?.data ? error.data : "Error loading report data!"}
        </Alert>
      )
    }

    return (
      data &&
      boirData &&
      pass && (
        <Component
          {...props}
          reportId={reportId}
          clientId={Clientid}
          reportData={data}
          boirData={boirData?.$values[0]}
        />
      )
    )
  }

  return SubComponent
}

export default WithReportIdHOC
