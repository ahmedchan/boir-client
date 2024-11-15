import { Link } from "react-router-dom"

const Unauthorized = () => (
  <div className="d-flex align-items-center flex-column gap-2 text-center pt-3 text-white">
    <p>You are NOT authorized to access!</p>
    <Link to="/" className="btn btn-outline-light">
      Back to Home
    </Link>
  </div>
)

export default Unauthorized
