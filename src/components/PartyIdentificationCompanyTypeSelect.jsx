/* eslint-disable react/prop-types */
import { Form, Button } from "react-bootstrap"
import { useGetPartyIdentificationCompanyTypeQuery } from "@/services/common.service"

const PartyIdentificationCompanyTypeSelect = ({ required, isInvalid, name, value, onChange, disabled = false }) => {
  const { data, isLoading, isError, refetch } = useGetPartyIdentificationCompanyTypeQuery()

  if (isError) {
    return (
      <div>
        Field to load parties,{" "}
        <Button type="button" onClick={refetch}>
          Try again!
        </Button>
      </div>
    )
  }

  return (
    <Form.Select
      required={required}
      isInvalid={isInvalid}
      name={name}
      value={value}
      onChange={onChange}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <option>Loading parties...</option>
      ) : (
        data?.map((item) => (
          <option key={item?.partyIdentificationTypeCode} value={item?.partyIdentificationTypeCode}>
            {item?.partyIdentificationTypeDesc}
          </option>
        ))
      )}
    </Form.Select>
  )
}

export default PartyIdentificationCompanyTypeSelect
