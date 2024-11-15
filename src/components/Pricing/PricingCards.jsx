import { useEffect, useState } from "react"
// import CardPrice from "../Cards/CardForPricing"
import RegisterBtn from "../Buttons/RegisterBtn"
import { ProfileRole } from "../../enums"
import CardForPricing from "../Cards/CardForPricing"
import { useGetPricesQuery } from "@/services/prices.service"

function PricingCards() {
  const [clientPlan, setClientPlan] = useState()
  const [agencyPlan, setAgencyPlan] = useState()
  const [agencyReportPrice, setAgencyReportPrice] = useState()

  // api
  const { data, isLoading, isError } = useGetPricesQuery()


  useEffect(() => {
    if (data) {
      const clientPlanData = data.$values.find(
        (plan) => plan.masterBillingTypeId === 1
      )
      const agencyPlanData = data.$values.find(
        (plan) => plan.masterBillingTypeId === 2
      )
      const agencyReportPriceData = data.$values.find(
        (plan) => plan.masterBillingTypeId === 3
      )

      setClientPlan(clientPlanData)
      setAgencyPlan(agencyPlanData)
      setAgencyReportPrice(agencyReportPriceData)
    }
  }, [data])

  return (
    <div className="container py-5">
      <div className="row justify-content-md-center">
        <CardForPricing>
          <h5 className="card-title text-center display-1 text-primary">
            <i className="fa fa-user" />
          </h5>
          <h5 className="card-title text-center ">Client Plan</h5>
          <p
            id="clientPlanPrice"
            className="text-decoration-line-through text-muted fw-lighter d-inline"
          >
            ${clientPlan?.filingFee}
          </p>
          <h4 id="clientPlanDiscount" className="d-inline">
            ${clientPlan?.discountAmount}
          </h4>
          <span>\Report</span>
          <hr />
          <ul className="fa-ul">
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              1 User
            </li>
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              Unlimited Companies
            </li>
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              Unlimited Submissions
            </li>
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              24/7 Support
            </li>
          </ul>
          <RegisterBtn
            type={ProfileRole?.REGULAR_CLIENT}
            value={"Register as a Client"}
          />
        </CardForPricing>

        <CardForPricing>
          <h5 className="card-title text-center display-1 text-primary">
            <i className="fa fa-briefcase" />
          </h5>
          <h5
            className="card-title
                   text-center"
          >
            Agency Plan
          </h5>
          <p
            id="agentPlanPrice"
            className="text-decoration-line-through text-muted fw-lighter d-inline"
          >
            ${agencyPlan?.filingFee}
          </p>
          <h4 id="agentPlanDiscount" className="d-inline">
            ${agencyPlan?.discountAmount}
          </h4>
          <span>\Subscription</span>
          <hr />
          <ul className="fa-ul">
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              Unlimited Companies
            </li>
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              Unlimited Reports
            </li>
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              <span
                id="agentReportPrice"
                className="text-decoration-line-through text-muted"
              >
                ${agencyReportPrice?.filingFee}
              </span>
              <span id="agentReportDiscount" className="fs-5 fw-bold">
                ${agencyReportPrice?.discountAmount}
              </span>
              \Report
            </li>
            <li>
              <span className="fa-li">
                <i className="fa fa-check" />
              </span>
              24/7 Support
            </li>
          </ul>
          <RegisterBtn
            type={ProfileRole?.AGENCY}
            value={"Register as an Agency"}
          />
        </CardForPricing>
      </div>
    </div>
  )
}

export default PricingCards
