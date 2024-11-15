import { Outlet, Link } from "react-router-dom"
import {Container} from "react-bootstrap"
import logo from "@/assets/images/efileBoir.png"

const AuthLayout = () => (
  <div className="auth-wrapper bg-primary px-2 py-4">
    <div className="logo-strip">
      <Container fluid className="py-1">
        <Link to="/">
          <img className="app-logo" src={logo} alt="boir" />
        </Link>
      </Container>
    </div>
    <div className="auth-inner my-2 mx-auto">
      <Outlet />
    </div>
  </div>
)

export default AuthLayout
