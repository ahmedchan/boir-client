import React, { useMemo } from "react"
import { Container, Row, Col, Table, Spinner, Alert } from "react-bootstrap"
import StripeContainer from "@/components/payment/StripeContainer"
import { useGetBOIRbillingDataQuery } from "@/services/reports.sevice"
import { formatAmount } from "@/utility/utils"

const PaymentContainer = ({ reportIds, clientId, closeModal }) => {
  const { data, isLoading, isError, error } = useGetBOIRbillingDataQuery(
    { reportIds },
    { skip: reportIds.length === 0, refetchOnMountOrArgChange: true }
  )

  const total = useMemo(() => {
    return data?.$values?.reduce((acc, currentVal) => {
      return acc + currentVal.invoiceAmount
    }, 0)
  }, [data])

  const invoiceIds = useMemo(() => {
    return data?.$values?.map((i) => i.billingInvoiceId)
  }, [data])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-3">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="danger">
        {error?.data || "Something went wrong, please try again later."}
      </Alert>
    )
  }

  return (
    <div className="px-2 py-4">
      <Container>
        <Row>
          <Col xs={12}>
            <h3>{data?.$values[0]?.companyName}</h3>
            <p className="text-secondary">
              {data?.$values[0]?.masterBillingDesc}
            </p>
            <Table striped className="mt-2">
              <thead>
                <tr>
                  <th width="100%">&nbsp;</th>
                  <th>Fees</th>
                  <th>Discount</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.$values?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td width="100%">
                        <div>{item?.masterBillingDesc}</div>
                        <div className="text-muted">
                          <small>
                            Boir No: <strong>{item?.reportNo}</strong>
                          </small>
                        </div>
                      </td>
                      <td className="text-center">
                        ${formatAmount(item?.filingFee)}
                      </td>
                      <td className="text-center text-muted">
                        {item?.discountPercentage}%
                      </td>
                      <td className="text-center">
                        ${formatAmount(item?.invoiceAmount)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
            <div className="mt-2 d-flex justify-content-end align-items-center">
              <span>Finial Fees:</span> &nbsp;
              <strong className="text-primary" style={{ fontSize: "1.5rem" }}>
                ${formatAmount(total)}
              </strong>
            </div>
          </Col>
          <Col xs={12}>
            <div className="mt-5">
              {total && (
                <StripeContainer
                  reportIds={reportIds}
                  invoiceIds={invoiceIds}
                  clientId={clientId}
                  closeModal={closeModal}
                  amount={total}
                  pt="report"
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PaymentContainer
