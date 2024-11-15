import { Container, Row, Col, Card } from "react-bootstrap"

const AdvantagesSection = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center">Our Unique Advantages</h2>
      <h5 className="text-center mb-4">
        Why Choose e-file BOIR for Your Filings?
      </h5>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>01.</Card.Title>
              <Card.Subtitle className="mb-2">
                Streamlined Process
              </Card.Subtitle>
              <Card.Text>
                Our intuitive online platform simplifies BOIR submissions,
                saving you time and ensuring that your reports are accurate and
                timely filed.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>02.</Card.Title>
              <Card.Subtitle className="mb-2">
                Client-Centric Support
              </Card.Subtitle>
              <Card.Text>
                Experienced professionals provide dedicated assistance, guiding
                you through the filing process while keeping your specific needs
                in focus.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>03.</Card.Title>
              <Card.Subtitle className="mb-2">
                Secure Data Handling
              </Card.Subtitle>
              <Card.Text>
                We prioritize your privacy and security, utilizing advanced
                encryption methods to protect your sensitive information during
                filing.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdvantagesSection
