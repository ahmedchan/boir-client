/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useMemo, Suspense, lazy, useState } from "react"
import {
  Spinner,
  ProgressBar,
  Container,
  Button,
  Card,
  Collapse
} from "react-bootstrap"
import { MdOutlineKeyboardVoice, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { useFilingForm } from "@/providers/FilingFormProvider"
import WithReportIdHOC from "../WithReportIdHOC"
// lazy
const FilingInformation = lazy(() => import("./FilingInformation"))
const ReportingCompany = lazy(() => import("./ReportingCompany"))
const CompanyApplicants = lazy(() => import("./CompanyApplicants"))
const BeneficialOwners = lazy(() => import("./BeneficialOwners"))
const Submitting = lazy(() => import("./Submitting"))

const MultiStepForm = ({ reportId, clientId, reportData ,boirData}) => {
  const { completedProgress } = useFilingForm()
  // states
  const [currentStep, setCurrentStep] = useState(1)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const stepItems = useMemo(
    () => [
      { label: "Filing Information", value: 1 },
      { label: "Reporting Company", value: 2 },
      { label: "Company Applicant(s)", value: 3 },
      { label: "Beneficial Owner(s)", value: 4 },
      { label: "Submit", value: 5 }
    ],
    []
  )


  const handleStepClick = (stepNumber) => setCurrentStep(stepNumber)

  const showStep = (stepNum) => {
    switch (stepNum) {
      case 1:
        return <FilingInformation setCurrentStep={setCurrentStep} />
      case 2:
        return <ReportingCompany setCurrentStep={setCurrentStep} />
      case 3:
        return <CompanyApplicants setCurrentStep={setCurrentStep} />
      case 4:
        return <BeneficialOwners setCurrentStep={setCurrentStep} />
      default:
        return <Submitting boirData={boirData} setCurrentStep={setCurrentStep} />
    }
  }


  return (
    <Container className="step-wrapper">
      <div
        style={{ top: "56px", zIndex: 20 }}
        className="pt-4 position-sticky bg-white filing-steps-nav pb-2 d-flex justify-content-between align-items-center gap-2"
      >
        {stepItems.map((item, index) => {
          const isActive = item.value === currentStep
          return (
            <div key={`${index}_${item.value}`} className="flex-fill d-grid">
              <Button
                variant={isActive ? "primary" : "secondary"}
                onClick={() => handleStepClick(item.value)}
              >
                {item.label}
              </Button>
            </div>
          )
        })}
      </div>
      <div className="mb-4">
        <ProgressBar
          striped
          animated
          now={completedProgress}
          label={`${completedProgress}%`}
        />
      </div>

      <Suspense fallback={<div className="d-flex justify-content-center align-items-center p-4"><Spinner /></div>}>{showStep(currentStep)}</Suspense>

      {/* help box */}
      <Card className="mb-4">
        <Card.Header
          onClick={() => setShowPrivacy((prev) => !prev)}
          className="cursor-pointer"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2 align-items-center">
              <MdOutlineKeyboardVoice />
              <strong>PRIVACY ACT AND PAPERWORK REDUCTION ACT NOTICE</strong>
            </div>
            {showPrivacy ? (
              <MdKeyboardArrowUp size={22} />
            ) : (
              <MdKeyboardArrowDown size={22} />
            )}
          </div>
        </Card.Header>
        <Collapse in={showPrivacy}>
          <Card.Body>
            <p>
              This notice is given under the Privacy Act of 1974 (Privacy Act)
              and the Paperwork Reduction Act of 1995 (Paperwork Reduction Act).
              The Privacy Act and Paperwork Reduction Act require that FinCEN
              inform persons of the following when requesting and collecting
              information in connection with this collection of information.
            </p>

            <p>
              This collection of information is authorized under 31 U.S.C. 5336
              and 31 C.F.R. 1010.380. The principal purpose of this collection
              of information is to generate a database of information that is
              highly useful in facilitating national security, intelligence, and
              law enforcement activities, as well as compliance with anti-money
              laundering, countering the financing of terrorism, and customer
              due diligence requirements under applicable law. Pursuant to 31
              U.S.C. 5336 and 31 C.F.R. 1010.380, reporting companies and
              certain other persons must provide specified information. The
              provision of that information is mandatory and failure to provide
              that information may result in criminal and civil penalties. The
              provision of information for the purpose of requesting a FinCEN
              Identifier is voluntary; however, failure to provide such
              information may result in the denial of such a request.
            </p>

            <p>
              Generally, the information within this collection of information
              may be shared as a “routine use” with other government agencies
              and financial institutions that meet certain criteria under
              applicable law. The complete list of routine uses of the
              information is set forth in the relevant Privacy Act system of
              record notice available at
              <a
                href="https://www.federalregister.gov/documents/2023/09/13/2023-19814/privacy-act-of-1974-system-of-records"
                target="_blank"
              >
                https://www.federalregister.gov/documents/2023/09/13/2023-19814/privacy-act-of-1974-system-of-records
              </a>
              .
            </p>

            <p>
              According to the Paperwork Reduction Act of 1995, no persons are
              required to respond to a collection of information unless it
              displays a valid OMB control number. The valid OMB control number
              for this information collection is 1506-0076. It expires on
              November 30, 2026.
            </p>

            <p>
              The estimated average burden associated with this collection of
              information from reporting companies is 90 to 650 minutes per
              respondent for reporting companies with simple or complex
              beneficial ownership structures, respectively. The estimated
              average burden associated with reporting companies updating
              information previously provided is 40 to 170 minutes per
              respondent for reporting companies with simple or complex
              beneficial ownership structures, respectively. The estimated
              average burden associated with this collection of information from
              individuals applying for FinCEN identifiers is 20 minutes per
              applicant. The estimated average burden associated with
              individuals who have obtained FinCEN identifiers updating
              information previously provided is 10 minutes per individual.
              Comments regarding the accuracy of this burden estimate, and
              suggestions for reducing the burden should be directed to the
              Financial Crimes Enforcement Network, P. O. Box 39, Vienna, VA
              22183, Attn: Policy Division.
            </p>
          </Card.Body>
        </Collapse>
      </Card>
    </Container>
  )
}

export default WithReportIdHOC(MultiStepForm)