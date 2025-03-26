import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For making HTTP requests
import "./RestaurantSignUp.css";

const RestaurantSignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    OwnerName: "", // Updated to PascalCase
    OwnerEmail: "", // Updated to PascalCase
    OwnerMobileNumber: "", // Updated to PascalCase
    ManagerName: "", // Updated to PascalCase
    ManagerMobileNumber: "", // Updated to PascalCase
    restaurantName: "",
    address: "",
    operatingHours: {
      Monday: { isOpen: true, open: "", close: "" },
      Tuesday: { isOpen: true, open: "", close: "" },
      Wednesday: { isOpen: true, open: "", close: "" },
      Thursday: { isOpen: true, open: "", close: "" },
      Friday: { isOpen: true, open: "", close: "" },
      Saturday: { isOpen: true, open: "", close: "" },
      Sunday: { isOpen: true, open: "", close: "" },
    },
    bankAccountDetails: {
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
    },
  });
  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle time changes for operating hours
  const handleTimeChange = (day, type, value) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day],
          [type]: value,
        },
      },
    });
  };

  // Toggle day open/closed status
  const toggleDayOpen = (day) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day],
          isOpen: !formData.operatingHours[day].isOpen,
        },
      },
    });
  };

  // Navigate to the next step
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Navigate to the previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("temp_userId");
      console.log("Retrieved userId from local storage on submit:", userId);

      if (!userId) {
        return alert("User ID is missing. Please register as a user first.");
      }

      const transformedData = {
        userId: userId,
        OwnerName: formData.OwnerName,
        OwnerEmail: formData.OwnerEmail,
        OwnerMobileNumber: formData.OwnerMobileNumber,
        ManagerName: formData.ManagerName,
        ManagerMobileNumber: formData.ManagerMobileNumber,
        restaurantName: formData.restaurantName,
        address: formData.address,
        operatingHours: formData.operatingHours,
        bankAccountDetails: formData.bankAccountDetails,
      };

      console.log("Payload being sent to backend:", transformedData);

      const response = await axios.post(
        "http://localhost:5002/api/restaurants/register-restaurant",
        transformedData,{
          headers: {
            'Content-Type': 'application/json',
        },
        },
      );

      console.log(response.data.message);
      alert("Restaurant registered successfully!");

      localStorage.removeItem("temp_userId");

      navigate("/login");
    } catch (error) {
      console.error("Error during restaurant registration:", error.response?.data);
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      alert(`Error during restaurant registration: ${errorMessage}`);
    }
  };


  // Render the current step of the form
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>Contact Information</h2>
            <div className="form-groupR">
              <label>
                Owner Name<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="text"
                name="OwnerName" // Updated to PascalCase
                value={formData.OwnerName} // Updated to PascalCase
                onChange={handleInputChange}
                placeholder="Enter owner's full name"
                required
              />
            </div>
            <div className="form-groupR">
              <label>
                Owner Email<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="email"
                name="OwnerEmail" // Updated to PascalCase
                value={formData.OwnerEmail} // Updated to PascalCase
                onChange={handleInputChange}
                placeholder="Enter owner's email address"
                required
              />
            </div>
            <div className="form-groupR">
              <label>
                Owner Mobile Number<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="text"
                name="OwnerMobileNumber" // Updated to PascalCase
                value={formData.OwnerMobileNumber} // Updated to PascalCase
                onChange={handleInputChange}
                placeholder="Enter owner's mobile number"
                required
              />
            </div>
            <div className="form-groupR">
              <label>
                Manager Name<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="text"
                name="ManagerName" // Updated to PascalCase
                value={formData.ManagerName} // Updated to PascalCase
                onChange={handleInputChange}
                placeholder="Enter manager's full name"
                required
              />
            </div>
            <div className="form-groupR">
              <label>
                Manager Mobile Number<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="text"
                name="ManagerMobileNumber" // Updated to PascalCase
                value={formData.ManagerMobileNumber} // Updated to PascalCase
                onChange={handleInputChange}
                placeholder="Enter manager's mobile number"
                required
              />
            </div>
            <div className="button-group">
              <button className="next-btn" onClick={nextStep}>
                Next
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Restaurant Information</h2>
            <div className="form-groupR">
              <label>
                Restaurant Name<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                placeholder="Enter restaurant name"
                required
              />
            </div>
            <div className="form-groupR">
              <label>
                Address<span className="required">*</span>
              </label>
              <textarea
                className="textareaR"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter restaurant address"
                rows="3"
                required
              ></textarea>
            </div>
            <div className="form-groupR">
              <label>
                Operating Hours<span className="required">*</span>
              </label>
              <div className="operating-hours">
                {Object.keys(formData.operatingHours).map((day) => (
                  <div key={day} className="day-hours">
                    <div className="day-status">
                      <span className="day-name">{day}</span>
                      <div className="day-toggle">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.operatingHours[day].isOpen}
                            onChange={() => toggleDayOpen(day)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className="toggle-label">
                          {formData.operatingHours[day].isOpen ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                    {formData.operatingHours[day].isOpen ? (
                      <div className="time-inputs">
                        <div className="time-input">
                          <label className="open-label">Open</label>
                          <input
                            type="time"
                            value={formData.operatingHours[day].open}
                            onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                            className="open-time"
                            required
                          />
                        </div>
                        <div className="time-input">
                          <label className="close-label">Close</label>
                          <input
                            type="time"
                            value={formData.operatingHours[day].close}
                            onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                            className="close-time"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="closed-message">Restaurant is closed on this day</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="button-group">
              <button className="back-btn" onClick={prevStep}>
                Back
              </button>
              <button className="next-btn" onClick={nextStep}>
                Next
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>Bank Details</h2>
            <div className="form-groupR">
              <label>
                Account Holder Name<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="text"
                name="bankAccountDetails.accountHolderName"
                value={formData.bankAccountDetails.accountHolderName}
                onChange={handleInputChange}
                placeholder="Enter account holder name"
                required
              />
            </div>
            <div className="form-groupR">
              <label>
                Account Number<span className="required">*</span>
              </label>
              <input
                className="inputR"
                type="text"
                name="bankAccountDetails.accountNumber"
                value={formData.bankAccountDetails.accountNumber}
                onChange={handleInputChange}
                placeholder="Enter account number"
                required
              />
            </div>
            <div className="form-groupR">
              <label>
                Bank Name<span className="required">*</span>
              </label>
              <select
                className="selectR"
                name="bankAccountDetails.bankName"
                value={formData.bankAccountDetails.bankName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Bank</option>
                <option value="Bank of Ceylon">Bank of Ceylon</option>
                <option value="People's Bank">People's Bank</option>
                <option value="Commercial Bank of Ceylon">Commercial Bank of Ceylon</option>
                {/* Add other banks here */}
              </select>
            </div>
            <div className="button-group">
              <button className="back-btn" onClick={prevStep}>
                Back
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit Registration
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="restaurant-signup-container">
      <div className="signupR-header">
        <h1>Restaurant Onboarding</h1>
        <div className="progress-tracker">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Contact Information</div>
            </div>
            <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Restaurant Information</div>
            </div>
            <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Bank Details</div>
            </div>
          </div>
        </div>
      </div>
      <div className="signupR-form">{renderStep()}</div>
    </div>
  );
};

export default RestaurantSignUp;