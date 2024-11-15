import {Container} from "react-bootstrap"
import {Outlet} from "react-router-dom"

const EmptyLayout = () => {
  return (
    <div className="empty-layout">
      <Container fluid>
        <Outlet />
      </Container>
    </div>
  )
}

export default EmptyLayout
