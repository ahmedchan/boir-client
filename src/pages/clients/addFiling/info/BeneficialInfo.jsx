import { useState } from "react"
import { MdHelp, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md"
import { Collapse, Card } from "react-bootstrap"

export const MainBeneficialInfo = () => {
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
             Beneficial owner information is entered in fields 35 through 51 of
             the BOIR. Reporting companies may also report a FinCEN Identifier
             for a beneficial owner instead of this information. See detailed
             description below.
           </p>

           <p>
             Use the “Add Beneficial Owner” or “Remove Beneficial Owner” keys at
             the top of this section to add or remove additional beneficial
             owners. There is no limit on the number of beneficial owners that
             may be reported.
           </p>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const CheckboxInfo = () => {
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
                 Instructions for Item 35 – Parent/Guardian information instead
                 of minor child:
               </strong>
             </div>
             <p>
               If the beneficial owner for the reporting company is a minor
               child, you may check this box and complete Part III with
               information about a parent or legal guardian of the minor child.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const BeneficialFinCENInfo = () => {
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
               <strong>Instructions for Item 36 – FinCEN ID:</strong>
             </div>
             <p>
               Reporting companies may provide a FinCEN Identifier for a
               beneficial owner instead of Items 37 through 51. Enter the FinCEN
               ID as a single text string. If a FinCEN ID for the beneficial
               owner is not provided, information about the beneficial owner
               must be provided in fields 37 through 51.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const ExemptEntityInfo = () => {
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
               <strong>Instructions for Item 37 – Exempt entity:</strong>
             </div>
             <p>
               Check this box if the beneficial owner holds its ownership
               interest in the reporting company exclusively through one or more
               exempt entities, and the name of that exempt entity or entities
               are being reported in lieu of the beneficial owner’s information.
               If checked, provide the legal name of the exempt entity in field
               38.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const LegalDateOfBirthInfo = () => {
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
                 Instructions for Item 38 – Individual&apos;s last name or
                 entity&apos;s legal name:
               </strong>
             </div>
             <p>
               Enter the beneficial owner&apos;s legal last name or the exempt
               entity&apos;s legal name. An entity’s legal name is the name on
               the articles of incorporation or other document that created or
               registered the entity. Do not abbreviate names unless an
               abbreviation is part of the legal name.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 39 – First name:</strong>
             </div>
             <p>Enter the beneficial owner&apos;s legal first name.</p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 40 – Middle name:</strong>
             </div>
             <p>
               Enter the beneficial owner&apos;s middle name if the beneficial
               owner&apos;s legal name includes a middle name. Leave this item
               blank if the beneficial owner does not have a middle name.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 41 – Suffix:</strong>
             </div>
             <p>
               Enter the beneficial owner’s suffix such as JR, SR, III, etc., if
               the beneficial owner has a suffix to their legal name. Leave this
               item blank if the beneficial owner’s legal name does not include
               a suffix.
             </p>
           </div>
           <div>
             <div className="text-decoration-underline">
               <strong>Instructions for Item 42 – Date of birth:</strong>
             </div>
             <p>
               Enter the beneficial owner’s date of birth, using the format
               MM/DD/YYYY where MM = month, DD = day, and YYYY = year (e.g.,
               01/25/1970). The month, day, and year must be provided; no
               partial dates will be accepted.
             </p>
           </div>
         </Card.Body>
       </Collapse>
     </Card>
   )
}

export const ResidentialAddressInfo = () => {
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
                 Instructions for Items 43 – 47 – Beneficial owner address:
               </strong>
             </div>
             <p>
               Enter the beneficial owner’s residential street address
               information, including the city, country or jurisdiction, State,
               and ZIP code or foreign postal code. U.S. Territories are
               included in the drop-down menu for “Country/Jurisdiction.” The
               “State” (item 46) will be automatically populated when a U.S.
               Territory is selected in the “Country/ Jurisdiction” (item 45).
               Item 46 “State” is required if the country selected in item 45 is
               the United States, Canada, or Mexico.
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
              not have one of these identifying documents, a non-expired foreign
              passport.
            </p>
          </div>
          <div>
            <div className="text-decoration-underline">
              <strong>
                Instructions for Item 31 – Identifying document number:
              </strong>
            </div>
            <p>
              Enter the identifying document number from the company applicant’s
              identifying document.
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
              Enter in item 32a the country/jurisdiction that issued the company
              applicant’s identifying document. If a U.S. Territory issued the
              identifying document, select the applicable U.S. Territory in item
              32a (the same U.S. Territory will then be automatically populated
              in item 32b “State” as a result). Enter in 32b the State issuing
              the identifying document when country/jurisdiction is United
              States, if applicable. If a local or Tribal government issued the
              identifying document, select “United States” in item 32a and then
              select the applicable local or Tribal description in item 32c. If
              the name of the relevant local or Tribal jurisdiction is not
              included in the drop-down menu in item 32c, select “Other” and
              enter the name of the local or Tribal jurisdiction in item 32d.
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
              referenced in item 31 containing the unique identifying number and
              other identifying data. Use the “Remove” button to remove the
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