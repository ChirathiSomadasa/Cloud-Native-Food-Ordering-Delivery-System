import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Phone } from 'lucide-react';
import "./Footer.css";

function Footer() {
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">FoodSprint</h2>
            <p className="footer-tagline">Fast delivery, delicious food, right to your door</p>
            <div className="footer-social">
              <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a
                href="https://wa.me/?text=Order%20delicious%20food%20from%20FoodExpress!"
                className="social-link"
                aria-label="WhatsApp"
              >
                <Phone size={20} />
              </a>
              <a href="https://youtube.com" className="social-link" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Order</h3>
              <ul className="footer-links-list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/restaurants">Restaurants</Link>
                </li>
                <li>
                  <Link to="/cuisines">Cuisines</Link>
                </li>
                <li>
                  <Link to="/deals">Deals & Offers</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Delivery</h3>
              <ul className="footer-links-list">
                <li>
                  <Link to="/track-order">Track Order</Link>
                </li>
                <li>
                  <Link to="/delivery-areas">Delivery Areas</Link>
                </li>
                <li>
                  <Link to="/delivery-times">Delivery Times</Link>
                </li>
                <li>
                  <Link to="/delivery-fees">Delivery Fees</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h3 className="footer-links-title">Company</h3>
              <ul className="footer-links-list">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/careers">Careers</Link>
                </li>
                <li>
                  <Link to="/partner">Become a Partner</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-newsletter">
            <h3 className="footer-newsletter-title">Get exclusive offers</h3>
            <p className="footer-newsletter-text">
              Subscribe to our newsletter for special deals, new restaurants, and delivery promotions.
            </p>
            <form className="footer-newsletter-form">
              <input type="email" placeholder="Your email address" className="footer-newsletter-input" required />
              <button type="submit" className="footer-newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p className="footer-copyright">&copy; {currentYear} FoodExpress. All rights reserved.</p>
            <div className="footer-legal-links">
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
