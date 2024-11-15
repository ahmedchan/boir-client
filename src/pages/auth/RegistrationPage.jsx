/* eslint-disable react/prop-types */
import { useMemo } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import { Card, Nav, Button } from "react-bootstrap"
import RegisterProfileInfo from "@/components/auth/RegisterProfileInfo"
import RegisterCompanyInfo from "@/components/auth/RegisterCompanyInfo"
import { useRegisterForm } from "@/providers/RegisterProvider"
import { getDefaultRouteForUserRole } from "@/utility/utils"
import { useAuth } from "@/providers/AuthProvider"

const RegistrationPage = () => {
  const { auth } = useAuth()
  const { profileRoleType } = useParams()
  const { state, setState } = useRegisterForm()

  const steps = useMemo(
    () => [
      {
        label: "Profile Information",
        value: 1
      },
      {
        label: "Company Information",
        value: 2
      }
    ],
    []
  )

  const renderTabs = (currentStep) => {
    switch (currentStep) {
      case 2:
        return <RegisterCompanyInfo profileRoleType={profileRoleType} />
      default:
        return <RegisterProfileInfo profileRoleType={profileRoleType} />
    }
  }

  const handleSelectedTab = (selectedKey) => {
    const keyNumber = parseInt(selectedKey.slice(1))
    setState((prev) => ({ ...prev, currentStep: keyNumber }))
  }

  if (auth && auth?.accessToken && auth?.user) {
    const navigateTo = getDefaultRouteForUserRole(auth)
    return <Navigate to={navigateTo} replace={true} />
  }

  return (
    <div className="register-page">
      <Card>
        <Card.Header>
          <h5 className="py-3 text-uppercase text-center">Create an Account</h5>
          <Nav
            variant="tabs"
            activeKey={`#${state.currentStep}`}
            className="pt-2"
            onSelect={(selectedKey) => handleSelectedTab(selectedKey)}
          >
            {steps.map((item, index) => {
              return (
                <Nav.Item key={index}>
                  <Nav.Link href={`#${item.value}`}>{item.label}</Nav.Link>
                </Nav.Item>
              )
            })}
          </Nav>
        </Card.Header>
        <Card.Body className="round-xl">
          <div className="px-2">{renderTabs(state.currentStep)}</div>
          <div className="mt-3 pb-2">
            <hr />
            <p className="text-muted text-center">Already have an account? </p>
            <div className="d-flex flex-column gap-2">
              <Button as={Link} to="/auth/login" variant="dark">
                Sign In
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default RegistrationPage
