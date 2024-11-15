import { Container, Row, Col } from "react-bootstrap"

const WhyChooseUsSection = () => {
  return (
    <div className="bg-secondary text-light">
      <Container className="py-5">
        <Row>
          <Col md={6} className="p-0">
            {/* Remove padding to stretch the image */}
            <img
              src="https://content.e-fileboir.com/wp-content/uploads/2024/10/pexels-photo-6929022.jpeg"
              alt="Why Choose Us"
              className="img-fluid rounded shadow"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} // Stretch image to fill the column
              loading="lazy"
            />
          </Col>
          <Col md={6}>
            <h3 className="mt-3">Why Choose Us</h3>
            <h5 className="mb-4">Our Unique Value Propositions</h5>
            <p>
              Discover how e-file BOIR stands out in providing exceptional
              filing solutions tailored to your needs.
            </p>
            <ul className="list-unstyled mt-4">
              <li className="d-flex align-items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="me-2"
                  width="24"
                  height="24"
                >
                  <path
                    fill="#FFDC7F"
                    d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
                  />
                </svg>
                User-Friendly Interface
              </li>
              <li className="d-flex align-items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="me-2"
                  width="24"
                  height="24"
                >
                  <path
                    fill="#FFDC7F"
                    d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
                  />
                </svg>
                Expert Guidance Available
              </li>
              <li className="d-flex align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="me-2"
                  width="24"
                  height="24"
                >
                  <path
                    fill="#FFDC7F"
                    d="M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM371.8 211.8C382.7 200.9 382.7 183.1 371.8 172.2C360.9 161.3 343.1 161.3 332.2 172.2L224 280.4L179.8 236.2C168.9 225.3 151.1 225.3 140.2 236.2C129.3 247.1 129.3 264.9 140.2 275.8L204.2 339.8C215.1 350.7 232.9 350.7 243.8 339.8L371.8 211.8z"
                  />
                </svg>
                Timely Compliance Assurance
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default WhyChooseUsSection
