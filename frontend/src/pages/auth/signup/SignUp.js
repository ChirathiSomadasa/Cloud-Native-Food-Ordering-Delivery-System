import { useState, useRef, useEffect } from "react"
import "./SignUp.css";
import SignUpImage from "../../../images/signup.png";
import { Link } from "react-router-dom";

// List of Sri Lankan cities
const sriLankanCities = [
  "Colombo",
  "Dehiwala-Mount Lavinia",
  "Moratuwa",
  "Sri Jayawardenepura Kotte",
  "Negombo",
  "Kandy",
  "Galle",
  "Trincomalee",
  "Batticaloa",
  "Jaffna",
  "Katunayake",
  "Dambulla",
  "Kolonnawa",
  "Anuradhapura",
  "Ratnapura",
  "Badulla",
  "Matara",
  "Puttalam",
  "Chilaw",
  "Kalmunai",
  "Vavuniya",
  "Kurunegala",
  "Matale",
  "Kalutara",
  "Mannar",
  "Nuwara Eliya",
  "Gampaha",
  "Hambantota",
  "Kegalle",
  "Ampara",
  "Hatton",
  "Polonnaruwa",
  "Nawalapitiya",
  "Embilipitiya",
  "Weligama",
  "Ambalangoda",
  "Tangalle",
  "Bandarawela",
  "Haputale",
  "Monaragala",
  "Avissawella",
  "Kelaniya",
  "Panadura",
  "Beruwala",
  "Horana",
  "Wattala",
  "Ja-Ela",
  "Minuwangoda",
  "Kuliyapitiya",
  "Harispattuwa",
  "Kadugannawa",
  "Mawanella",
  "Gampola",
  "Akuressa",
  "Homagama",
  "Maharagama",
  "Kaduwela",
  "Piliyandala",
  "Peliyagoda",
  "Mulleriyawa",
  "Hendala",
  "Welisara",
  "Ragama",
  "Kandana",
  "Hanwella",
  "Wadduwa",
  "Aluthgama",
  "Bentota",
  "Hikkaduwa",
  "Unawatuna",
  "Mirissa",
  "Tissamaharama",
  "Ella",
  "Wellawaya",
  "Buttala",
  "Katharagama",
  "Pottuvil",
  "Arugam Bay",
  "Kattankudy",
  "Eravur",
  "Valaichchenai",
  "Chenkalady",
  "Sammanthurai",
  "Akkaraipattu",
  "Pothuvil",
  "Point Pedro",
  "Chavakachcheri",
  "Kilinochchi",
  "Mullaittivu",
  "Puthukkudiyiruppu",
  "Oddusuddan",
  "Pulmoddai",
  "Kantale",
  "Kinniya",
  "Mutur",
  "Habarana",
  "Sigiriya",
  "Mahiyanganaya",
  "Welimada",
  "Hali Ela",
  "Passara",
  "Lunugala",
]

function SignUp() {

  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filteredCities, setFilteredCities] = useState(sriLankanCities)
  const dropdownRef = useRef(null)

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCities(sriLankanCities)
    } else {
      const filtered = sriLankanCities.filter((city) => city.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredCities(filtered)
    }
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleCitySelect = (city) => {
   
    setSearchTerm(city)
    setIsDropdownOpen(false)
  }

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
          {/* City Dropdown */}
          <div className="form-groupS">
            <label className="labelS" htmlFor="city">
              City
            </label>
            <div className="city-dropdown-container" ref={dropdownRef}>
              <input
                className="inputS city-search"
                type="text"
                id="city"
                name="city"
                placeholder="Search for your city"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setIsDropdownOpen(true)
                }}
                onClick={() => setIsDropdownOpen(true)}
              />
              {isDropdownOpen && (
                <div className="city-dropdown">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                      <div key={index} className="city-option" onClick={() => handleCitySelect(city)}>
                        {city}
                      </div>
                    ))
                  ) : (
                    <div className="no-cities">No cities found</div>
                  )}
                </div>
              )}
            </div>
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
          {/* Account Type Selection */}
          <div className="form-groupS account-type-section">
            <label className="labelS">Choose Your Account Type</label>
            <p className="account-type-description">Select the type of account you want to create</p>

            <div className="account-type-options">
              <div className="account-type-option">
                <input type="radio" id="customer" name="accountType" value="customer" defaultChecked />
                <label htmlFor="customer" className="account-type-label">
                  <span className="account-type-title">Customer</span>
                  <span className="account-type-info">Order food from your favorite restaurants</span>
                </label>
              </div>

              <div className="account-type-option">
                <input type="radio" id="business" name="accountType" value="business" />
                <label htmlFor="business" className="account-type-label">
                  <span className="account-type-title">Business</span>
                  <span className="account-type-info">Register your restaurant on our platform</span>
                </label>
              </div>

              <div className="account-type-option">
                <input type="radio" id="delivery" name="accountType" value="delivery" />
                <label htmlFor="delivery" className="account-type-label">
                  <span className="account-type-title">Delivery</span>
                  <span className="account-type-info">Join our delivery fleet and earn money</span>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        
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
        <img src={SignUpImage} alt="signup" />
      </div>
    </div>
  );
}

export default SignUp;