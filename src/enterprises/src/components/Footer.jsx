import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <div id="footer">
      <footer>
        <Container fluid="md">
          <Row>
            <Col>
              <p>
                Digital Vaccine Passports in the form of NFT. Access all your passports at one place.
              </p>
              <a href="https://iconscout.com/illustrations/robot" target="_blank">Robot checking user profile Illustration</a> by <a href="https://iconscout.com/contributors/iconscout" target="_blank">IconScout Store</a>
            </Col>
            <Col>
              <p>Copyright ⓒ {year}</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default Footer;
