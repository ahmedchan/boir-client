import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

const HomepageSection = () => {
  return (
    <div className="parallax-section position-relative text-white d-flex flex-column justify-content-center align-items-center text-center">
      <div className="overlay"></div>

      <div className="content">
        <p className="fs-4 mb-0">Seamless BOIR Filing</p>
        <h1 className="display-5 fw-bold mb-4">
          Effortless Beneficial Ownership Reporting
        </h1>
        <Button as={Link} to="/contact" size="lg" variant="warning">
          <span className="px-4 py-2">Get Started</span>
        </Button>
      </div>
    </div>
  )
}

export default HomepageSection
