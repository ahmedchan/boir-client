import { useState } from "react"
import { MdHelp, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { Collapse, Card } from "react-bootstrap"

export const MainApplicantInfo = () => {
  const [show, setShow] = useState(false)
  return (
    <Card className="mb-4">
      <Card.Header
        onClick={() => setShow((prev) => !prev)}
        className="cursor-pointer"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2 align-items-center">
            <MdHelp />
            <strong>Need Help</strong>
          </div>
          {show ? (
            <MdKeyboardArrowUp size={22} />
          ) : (
            <MdKeyboardArrowDown size={22} />
          )}
        </div>
      </Card.Header>
      <Collapse in={show}>
        <Card.Body>
          <div>
            <div className="text-decoration-underline">
              <strong>
                Instructions for Item 16 – Existing reporting company:
              </strong>
            </div>
            <p>
              Check this box if the reporting company was created or registered
              before January 1, 2024. Do not check the box if the reporting
              company was created or registered on or after January 1, 2024.
              Reporting companies that check this box are not required to report
              any company applicants; proceed to Part III.
            </p>
          </div>
        </Card.Body>
      </Collapse>
    </Card>
  )
}

export const ApplicantInformationInfo = () => {
  const [show, setShow] = useState(false)
  return (
    <Card className="mb-2">
      <Card.Header
        onClick={() => setShow((prev) => !prev)}
        className="cursor-pointer"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2 align-items-center">
            <MdHelp />
            <strong>Need Help</strong>
          </div>
          {show ? (
            <MdKeyboardArrowUp size={22} />
          ) : (
            <MdKeyboardArrowDown size={22} />
          )}
        </div>
      </Card.Header>
      <Collapse in={show}>
        <Card.Body>
          <p>
            Company applicant information is entered in fields 18 through 33 of
            the BOIR. Company applicants are individuals; no companies or legal
            entities may be reported as company applicants. Reporting companies
            may also provide FinCEN Identifiers for company applicants instead
            of this information. See detailed description below.
          </p>

          <p>
            Use the “Add Company Applicant” or “Remove Company Applicant” keys
            at the top of this section to add or remove additional company
            applicants. No more than two company applicants should be reported.
          </p>

          <p>
            If existing reporting company was checked in item 16, company
            applicant information is not required; proceed to Part III.
          </p>
        </Card.Body>
      </Collapse>
    </Card>
  )
}

export const ApplicantFinCENInfo = () => {
  const [show, setShow] = useState(false)

  return (
    <Card className="mt-3 mb-4">
      <Card.Header
        onClick={() => setShow((prev) => !prev)}
        className="cursor-pointer"
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2 align-items-center">
            <MdHelp />
            <strong>Need Help</strong>
          </div>
          {show ? (
            <MdKeyboardArrowUp size={22} />
          ) : (
            <MdKeyboardArrowDown size={22} />
          )}
        </div>
      </Card.Header>
      <Collapse in={show}>
        <Card.Body>
          <div>
            <div className="text-decoration-underline">
              <strong>Instructions for Item 18 – FinCEN ID:</strong>
            </div>
            <p>
              Reporting companies may report the FinCEN ID for a company
              applicant instead of the information in fields 19 through 33.
              Enter the FinCEN ID as a single text string. If a FinCEN ID for
              the company applicant is not provided, information about the
              company applicant must be provided in fields 19 through 33.
            </p>
          </div>
        </Card.Body>
      </Collapse>
    </Card>
  )
}

export const LegalDateofBirthInfo = () => {
   const [show, setShow] = useState(false)

   return (
     <Card className="mt-3 mb-4">
       <Card.Header
         onClick={() => setShow((prev) => !prev)}
         className="cursor-pointer"
       >
         <div className="d-flex justify-content-between align-items-center">
           <div className="d-flex gap-2 align-items-center">
             <MdHelp />
             <strong>Need Help</strong>
           </div>
           {show ? (
             <MdKeyboardArrowUp size={22} />
           ) : (
             <MdKeyboardArrowDown size={22} />
           )}
         </div>
       </Card.Header>
       <Collapse in={show}>
         <Card.Body>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 19 – Last name: :</strong>
             </div>
             <p>Enter the company applicant’s legal last name.</p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 20 – First name:</strong>
             </div>
             <p>Enter the company applicant’s legal first name.</p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 21 – Middle name:</strong>
             </div>
             <p>
               Enter the company applicant&apos;s middle name if the company
               applicant’s legal name has a middle name. Leave this item blank
               if the company applicant does not have a middle name.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 22 – Suffix:</strong>
             </div>
             <p>
               Enter the company applicant&apos;s middle name if the company
               applicant’s legal name has a middle name. Leave this item blank
               if the company applicant does not have a middle name.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 23 – Date of birth:</strong>
             </div>
             <p>
               Enter the company applicant’s date of birth using the format
               MM/DD/YYYY where MM = month, DD = day, and YYYY = year (e.g.,
               01/25/1970). The month, day, and year must be provided; no
               partial dates are accepted.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const CurrentAddressInfo = () => {
   const [show, setShow] = useState(false)
   return (
     <Card className="mt-3 mb-4">
       <Card.Header
         onClick={() => setShow((prev) => !prev)}
         className="cursor-pointer"
       >
         <div className="d-flex justify-content-between align-items-center">
           <div className="d-flex gap-2 align-items-center">
             <MdHelp />
             <strong>Need Help</strong>
           </div>
           {show ? (
             <MdKeyboardArrowUp size={22} />
           ) : (
             <MdKeyboardArrowDown size={22} />
           )}
         </div>
       </Card.Header>
       <Collapse in={show}>
         <Card.Body>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 24 – Address type:</strong>
             </div>
             <p>
               Indicate address type as “Business address” or “Residential
               address” for the company applicant. For a company applicant who
               forms or registers an entity in the course of their business,
               such as paralegals, report the street address of such business.
               In any other case, the individual’s residential street address
               must be reported.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>
                 Instructions for Items 25 – 29 – Company applicant address:
               </strong>
             </div>
             <p>
               Enter the company applicant’s street address information,
               including the city, country or jurisdiction, State, and ZIP code
               or foreign postal code. U.S. Territories are included in the
               drop-down menu for “Country/Jurisdiction.” The “State” (item 28)
               will be automatically populated when a U.S. Territory is selected
               in the “Country/Jurisdiction” (item 27). Item 28 “State” is
               required if the country selected in item 27 is the United States,
               Canada, or Mexico.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const IdentificationJurisdictionInfo = () => {
   const [show, setShow] = useState(false)
   return (
     <Card className="mt-3 mb-4">
       <Card.Header
         onClick={() => setShow((prev) => !prev)}
         className="cursor-pointer"
       >
         <div className="d-flex justify-content-between align-items-center">
           <div className="d-flex gap-2 align-items-center">
             <MdHelp />
             <strong>Need Help</strong>
           </div>
           {show ? (
             <MdKeyboardArrowUp size={22} />
           ) : (
             <MdKeyboardArrowDown size={22} />
           )}
         </div>
       </Card.Header>
       <Collapse in={show}>
         <Card.Body>
           <div>
             <div className="text-decoration-underline">
               <strong>
                 Instructions for Item 30 – Identifying document type:
               </strong>
             </div>
             <p>
               Select the company applicant’s identifying document type from the
               list of acceptable documents: a non-expired State-issued driver’s
               license, a non-expired State/local/Tribe-issued identification
               document issued for the purpose of identifying the individual, a
               non-expired U.S. passport, or, only if the company applicant does
               not have one of these identifying documents, a non-expired
               foreign passport.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>
                 Instructions for Item 31 – Identifying document number:
               </strong>
             </div>
             <p>
               Enter the identifying document number from the company
               applicant’s identifying document.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>
                 Instructions for Item 32 – Identifying document issuing
                 jurisdiction:
               </strong>
             </div>
             <p>
               Enter in item 32a the country/jurisdiction that issued the
               company applicant’s identifying document. If a U.S. Territory
               issued the identifying document, select the applicable U.S.
               Territory in item 32a (the same U.S. Territory will then be
               automatically populated in item 32b “State” as a result). Enter
               in 32b the State issuing the identifying document when
               country/jurisdiction is United States, if applicable. If a local
               or Tribal government issued the identifying document, select
               “United States” in item 32a and then select the applicable local
               or Tribal description in item 32c. If the name of the relevant
               local or Tribal jurisdiction is not included in the drop-down
               menu in item 32c, select “Other” and enter the name of the local
               or Tribal jurisdiction in item 32d.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>
                 Instructions for Item 33 – Identifying document image:
               </strong>
             </div>
             <p>
               Drag a file or click “choose from folder” to attach a clear,
               readable image of the page or side of the identifying document
               referenced in item 31 containing the unique identifying number
               and other identifying data. Use the “Remove” button to remove the
               attached image if necessary. An attachment to a BOIR cannot be
               larger than four (4) megabytes of data and must be in one of the
               following formats: JPG/JPEG, PNG, or PDF. Only one (1) attachment
               file may be added per company applicant. Attachment file names
               should not contain spaces, and can only contain letters, numbers,
               or the following characters !@#$%()_-.=+[]|;~
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}