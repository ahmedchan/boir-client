import { Container, Row, Col, Button } from "react-bootstrap"
import {Link} from "react-router-dom"

const AboutUsSection = () => {
  return (
    <div className="bg-primary text-light">
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <img
              src="https://content.e-fileboir.com/wp-content/uploads/2024/10/pexels-photo-6863246.jpeg"
              alt="Who We Are"
              className="img-fluid rounded shadow"
              style={{ maxHeight: "300px", objectFit: "cover" }} // Adjust height here
              loading="lazy"
              width="560"
              height="450"
            />
          </Col>
          <Col md={6}>
            <div>
              <h5 className="font-weight-bold">Who We Are</h5>
              <h2>Empowering Your BOIR Experience</h2>
              <p className="my-3">
                At e-file BOIR, we specialize in providing efficient and
                user-friendly solutions for filing Beneficial Ownership
                Information Reports. Our team is dedicated to your success.
              </p>
              <Button as={Link} to="/about" variant="warning">
                Read More
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AboutUsSection
