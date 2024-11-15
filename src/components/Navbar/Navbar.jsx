import { NavLink } from "react-router-dom"
import { Container, Nav, Navbar, Button } from "react-bootstrap"
import logo from "@/assets/images/efileBoir.png"
import { useAuth } from "@/providers/AuthProvider"

const NavbarMenu = () => {
  const { auth, setAuth } = useAuth()

  const handleLogout = () => {
    window.localStorage.removeItem("user")
    window.localStorage.removeItem("accessToken")
    setAuth(null)
  }

  return (
    <Navbar expand="lg" className="bg-primary" fixed="top" data-bs-theme="dark">
      <Container fluid className="px-4">
        <Navbar.Brand>
          <img src={logo} alt="BOIR" height="34" />
        </Navbar.Brand>
        <Nav className="mb-2  ms-auto">
          <div className="d-flex align-items-center">
            <Nav.Link as={NavLink} to={`/clients/${auth?.user?.companyID}`}>
              <span className="hidden-sm">File BIO</span> Report
            </Nav.Link>
            {auth ? (
              <Button variants="secondary" onClick={handleLogout}>
                Logout
              </Button>
            ) : null}
          </div>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default NavbarMenu
