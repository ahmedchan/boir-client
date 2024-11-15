/* eslint-disable react/prop-types */
import { Form, Button } from "react-bootstrap"
import { useGetStatesByCountryQuery } from "@/services/common.service"

const StateSelect = ({
  countryId,
  required,
  isInvalid,
  name,
  value,
  onChange,
  disabled = false
}) => {
  const { data, isLoading, isError, refetch } = useGetStatesByCountryQuery(
    { countryId },
    { skip: !countryId, refetchOnMountOrArgChange: true }
  )

  if (isError) {
    return (
      <div>
        Field to load states,{" "}
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
      disabled={isLoading || disabled || !countryId}
    >
      {!countryId ? (
        <option>Select country first--</option>
      ) : isLoading ? (
        <option>Loading states...</option>
      ) : (
        <>
            <option>select state--</option>
            {data?.map((item) => (
          <option key={item?.stateCodeId} value={item?.stateCodeId}>
            {item?.stateName}
          </option>
        ))}
        </>
      )}
    </Form.Select>
  )
}

export default StateSelect
