import { Container, Row, Col, Button } from "react-bootstrap"
import {Link} from "react-router-dom"

const ReadyToStartSection = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h2 className="uagb-ifb-title">Ready to Start?</h2>
          <p className="uagb-ifb-desc">
            Join e-file BOIR today for effortless and organized Beneficial
            Ownership Information filing!
          </p>
          <Button variant="primary" as={Link} to="/contact" className="mt-3">
            <span className="px-4">Get Started</span>
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default ReadyToStartSection
