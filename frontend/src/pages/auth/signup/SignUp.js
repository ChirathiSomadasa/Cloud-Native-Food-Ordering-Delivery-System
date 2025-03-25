import React from "react";
import "./SignUp.css";
import SignUpImage from "../../../images/signup.png";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-form-container">
        <div className="signup-header">
          <h1>Sign Up</h1>
          <p>Create your account to order delicious food</p>
        </div>

        <form className="signup-form">
          <div className="form-rowS">
            <div className="form-groupS">
              <label className="labelS"htmlFor="first_name">First Name</label>
              <input className="inputS"
                type="text"
                id="first_name"
                name="first_name"
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-groupS">
              <label className="labelS" htmlFor="last_name">Last Name</label>
              <input className="inputS"
                type="text"
                id="last_name"
                name="last_name"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-groupS">
            <label className="labelS" htmlFor="mobile_number">Mobile Number</label>
            <input className="inputS"
              type="tel"
              id="mobile_number"
              name="mobile_number"
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="form-groupS">
            <label className="labelS" htmlFor="email">Email</label>
            <input className="inputS"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-groupS">
            <label className="labelS" htmlFor="password">Password</label>
            <input className="inputS"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        {/* Alternative options */}
        <div className="alternative-options">
          <div className="option">
            <Link to="/business-account" className="business-link">
              Create a Business Account
              <ArrowForwardIcon className="arrow-icon" />
            </Link>
          </div>
          <div className="option">
            <Link to="/delivery-signup" className="delivery-link">
              Sign Up to Deliver
              <ArrowForwardIcon className="arrow-icon" />
            </Link>
          </div>
        </div>

        {/* Login link */}
        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Log In
            </Link>
          </p>
        </div>
      </div>

      <div className="signup-image">
        <div className="benefits">
          <h2>Join Our Food Delivery Network</h2>
          <ul>
            <li>Order from your favorite local restaurants</li>
            <li>Fast and reliable delivery to your doorstep</li>
            <li>Exclusive deals and discounts</li>
            <li>Easy tracking of your orders</li>
          </ul>
        </div>
        <img src={SignUpImage} alt="signup image" />
      </div>
    </div>
  );
}

export default SignUp;