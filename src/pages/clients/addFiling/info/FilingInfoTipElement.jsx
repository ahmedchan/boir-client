
export const FilingInfoTip = () => (
  <div>
    <p>
      <strong>Item 1 – Type of filing: </strong>
      If type of filing 1b, 1c, or 1d is selected, enter values for 1e “Legal
      name”, 1f “Tax identification type”, and 1g “Tax identification number”
      for the reporting company that match the most recently filed BOIR. For
      example, if the reporting company previously filed an initial report and
      then an updated report, the reporting company information in the next
      updated report should match the reporting company information provided on
      the most recently filed updated report rather than the initial report
    </p>
    <p>
      For 1f, select the tax identification type (i.e., a U.S. Employer
      Identification Number (EIN), a U.S. Social Security Number or Individual
      Taxpayer Identification Number (SSN-ITIN), or foreign taxpayer
      identification number (Foreign)) the reporting company reported in the
      most recently filed BOIR. If tax identification type entered in 1f is
      “Foreign”, select the corresponding foreign country/jurisdiction in 1h
      “Country/Jurisdiction (if foreign tax ID only)” associated with the
      foreign tax identification number.
    </p>
  </div>
)

export const MainFilingInfoTip = () => {
  return (
    <>
      <h5>Instructions for Item 1 – Type of filing:</h5>
      <ul>
        <li>
          Check box 1a “Initial report” if this is the first BOIR filed for the
          reporting company.
        </li>
        <li>
          Check box 1b “Correct prior report” if the report corrects inaccurate
          information from a previously filed BOIR.
        </li>
        <li>
          Check box 1c “Update prior report” if the report updates a previously
          filed BOIR, for example, to include one or more new beneficial owners.
        </li>
        <li>
          Check box 1d “Newly exempt entity” if, after having filed a BOIR, the
          reporting company is now exempt from BOI reporting requirements. If
          this checkbox is selected, then filer must fill out fields 1e–1h
          (reporting company information associated with most recent report) and
          no other fields in the BOIR.
        </li>
        <li>
          If type of filing 1b, 1c, or 1d is selected, enter values for 1e
          “Legal name”, 1f “Tax identification type”, and 1g “Tax identification
          number” for the reporting company that match the most recently filed
          BOIR. For example, if the reporting company previously filed an
          initial report and then an updated report, the reporting company
          information in the next updated report should match the reporting
          company information provided on the most recently filed updated report
          rather than the initial report.
        </li>
        <li>
          For 1f, select the tax identification type (i.e., a U.S. Employer
          Identification Number (EIN), a U.S. Social Security Number or
          Individual Taxpayer Identification Number (SSN-ITIN), or foreign
          taxpayer identification number (Foreign)) the reporting company
          reported in the most recently filed BOIR. If tax identification type
          entered in 1f is “Foreign”, select the corresponding foreign
          country/jurisdiction in 1h “Country/Jurisdiction (if foreign tax ID
          only)” associated with the foreign tax identification number.
        </li>
      </ul>
      <h4>Instructions for Item 2 – Date prepared:</h4>
      <p>This item is automatically populated with the current date.</p>
    </>
  )
}