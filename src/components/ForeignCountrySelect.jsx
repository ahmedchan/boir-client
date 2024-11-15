/* eslint-disable react/prop-types */
import { Form, Button } from "react-bootstrap"
import { useGetForeignCountriesQuery } from "@/services/common.service"

const ForeignCountrySelect = ({ required, isInvalid, name, value, onChange, disabled = false }) => {
  const { data, isLoading, isError, refetch } = useGetForeignCountriesQuery()

  if (isError) {
    return (
      <div>
        Field to load countris,{" "}
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
        <option>Loading countries...</option>
      ) : (
        data?.map((item) => (
          <option key={item?.countryCodeId} value={item?.countryCodeId}>
            {item?.countryName}
          </option>
        ))
      )}
    </Form.Select>
  )
}

export default ForeignCountrySelect
