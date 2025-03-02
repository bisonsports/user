import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from "react-icons/fi"
import "./Footer.css"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <h2>SPORTZ</h2>
              </div>
              <p className="footer-description">
                Find sports venues, connect with players, and book your next game instantly.
              </p>
              <div className="footer-social">
                <a href="#" className="social-icon">
                  <FiInstagram />
                </a>
                <a href="#" className="social-icon">
                  <FiFacebook />
                </a>
                <a href="#" className="social-icon">
                  <FiTwitter />
                </a>
                <a href="#" className="social-icon">
                  <FiYoutube />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Sports</a>
                </li>
                <li>
                  <a href="#">Venues</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Sports</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">Football</a>
                </li>
                <li>
                  <a href="#">Basketball</a>
                </li>
                <li>
                  <a href="#">Tennis</a>
                </li>
                <li>
                  <a href="#">Golf</a>
                </li>
                <li>
                  <a href="#">Cycling</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Contact Us</h3>
              <ul className="footer-contact">
                <li>
                  <FiMapPin />
                  <span>123 Sports Street, City, Country</span>
                </li>
                <li>
                  <FiPhone />
                  <span>+1 234 567 890</span>
                </li>
                <li>
                  <FiMail />
                  <span>info@sportz.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="copyright">&copy; {currentYear} SPORTZ. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>

      <div className="app-download">
        <div className="app-download-content">
          <div className="qr-code">
            <img src="/placeholder.svg?height=120&width=120" alt="QR Code" />
          </div>
          <div className="download-text">
            <h3>DOWNLOAD THE APP</h3>
            <p>Scan the QR code to download our mobile app</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

