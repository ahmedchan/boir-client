import { useState } from "react"
import { MdHelp, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { Collapse, Card } from "react-bootstrap"

export const MainReportCompanyInfo = () => {
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
          <p>
            Reporting company information is entered in fields 3 through 16 of
            the BOIR.
          </p>
          <div>
            <div className="text-decoration-underline">
              <strong>
                Instructions for Item 3 – Request to receive FinCEN Identifier
                (FinCEN ID):
              </strong>
            </div>
            <p>
              Check this box to receive a unique FinCEN Identifier for the
              reporting company. The FinCEN Identifier will be provided in the
              submission confirmation details provided to the filer after the
              BOIR is accepted.
            </p>
          </div>
          <div>
            <div className="text-decoration-underline">
              <strong>
                Instructions for Item 4 – Foreign pooled investment vehicle:
              </strong>
            </div>
            <p>
              Check this box if the reporting company is a foreign pooled
              investment vehicle required to report information pursuant to 31
              CFR 1010.380(b)(2)(iii).
            </p>
          </div>
          <ul>
            <li>
              If the reporting company is a foreign pooled investment vehicle,
              the company need only report one beneficial owner who exercises
              substantial control over the entity. If more than one individual
              exercise substantial control over the entity, the entity shall
              report information with respect to the individual who has the
              greatest authority over the strategic management of the entity.
              The report should not include any information about company
              applicants.
            </li>
          </ul>
        </Card.Body>
      </Collapse>
    </Card>
  )
}

export const LegalAlternateInfo = () => {
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
                 Instructions for Item 5 – Reporting company legal name:
               </strong>
             </div>
             <p>
               Enter the reporting company’s full legal name as recorded on the
               articles of incorporation or other documents creating or
               registering the entity.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 6 – Alternate name:</strong>
             </div>
             <p>
               Enter any of the reporting company’s trade names, “doing business
               as” or DBA names, or “trading as” or T/A names. If the reporting
               company has multiple alternate names, use the “+” or “-“ buttons
               in the BOIR to add additional alternate name fields (one field
               for each alternate name). Do not include the acronyms DBA or AKA
               with the alternate name.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const IdentificationFormInfo = () => {
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
                 Instructions for Item 7 – Tax identification type:
               </strong>
             </div>
             <p>
               Select “EIN” if the reporting company has a U.S. Employer
               Identification Number (EIN). Select “SSN-ITIN” if the reporting
               company utilizes a U.S. Social Security Number (SSN) or
               Individual Taxpayer Identification Number (ITIN) as a tax
               identification number. Select “Foreign” if the reporting company
               has a tax identification number issued by a foreign jurisdiction
               and does not have a U.S. tax identification number.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>
                 Instructions for Item 8 – Tax identification number:
               </strong>
             </div>
             <p>
               Enter the tax identification number for the reporting company.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 9 – Country/Jurisdiction:</strong>
             </div>
             <p>
               If the tax identification type in item 7 is “Foreign”, select the
               foreign country/jurisdiction that issued the foreign tax
               identification number.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const JurisdictionFormationInfo = () => {
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
             <span>Need Help</span>
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
                 Instructions for Item 10 – Jurisdiction of formation or first
                 registration:
               </strong>
             </div>
             <p>
               Enter the country/jurisdiction of formation in item 10a. If
               United States is selected in 10a, then items 10b–10d should be
               completed, identifying the State or Tribal jurisdiction of
               formation. If a U.S. Territory is selected in 10a, then item 10b
               is automatically populated with the relevant U.S. Territory, and
               items 10c and 10d are unavailable. If Item 10a is a foreign
               country, then item 10e – 10f should be completed, identifying the
               State/U.S. Territory or Tribal jurisdiction in which the foreign
               reporting company first registered to do business in the United
               States. If the Tribal jurisdiction of formation (10c) or Tribal
               jurisdiction of first registration (10f) is not listed in the
               drop-down, select “Other” and enter the name of the Tribe in 10d
               or 10g.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const CurrentUSAddressInfo = () => {
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
                 Instructions for Items 11 – 15 – Reporting company address:
               </strong>
             </div>
             <p>
               Enter the reporting company’s complete current street address
               information, including city, State, ZIP Code, and select in item
               13 whether the address is in the United States or a specific U.S.
               Territory. If the reporting company has a principal place of
               business in the United States or U.S. Territory, the street
               address should be that of the principal place of business.
               Otherwise, the street address should be the primary location in
               the United States or U.S. Territory where the reporting company
               conducts business. If a U.S. Territory is selected in item 13,
               then item 14 is automatically populated with the relevant U.S.
               Territory.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}