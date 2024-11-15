import { Container, Row, Col, Button } from "react-bootstrap"

const services = [
  {
    title: "Individual Filings",
    description:
      "Streamlined filing for individual business owners with multiple companies.",
    imgSrc:
      "https://content.e-fileboir.com/wp-content/uploads/2024/10/pexels-photo-12663156.jpeg",
    link: "offerings/"
  },
  {
    title: "CPA Client Management",
    description:
      "Efficient management of client BOIR filings for CPAs and tax professionals.",
    imgSrc:
      "https://content.e-fileboir.com/wp-content/uploads/2024/10/pexels-photo-12903277.jpeg",
    link: "offerings/"
  },
  {
    title: "Secure Online Platform",
    description: "A secure environment for filing sensitive ownership data.",
    imgSrc:
      "https://content.e-fileboir.com/wp-content/uploads/2024/10/pexels-photo-9052475.jpeg",
    link: "offerings/"
  }
]

const OurServices = () => {
  return (
    <div className="bg-light">
      <Container className="py-5">
        <h2 className="text-center">Our Services</h2>
        <h5 className="text-center mb-5">
          Comprehensive Filing Solutions for Everyone
        </h5>
        <Row>
          {services.map((service, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="mb-4">
              <div className="text-center">
                <img
                  src={service.imgSrc}
                  alt={service.title}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
                <h5 className="mt-3">{service.title}</h5>
                <p>{service.description}</p>
                <Button as="a" href={service.link} variant="primary">
                  Read More
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default OurServices
