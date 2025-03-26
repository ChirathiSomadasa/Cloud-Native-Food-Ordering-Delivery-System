import { useState } from "react"
import "./RestaurantSignUp.css"

const RestaurantSignUp = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        ownerName: "",
        ownerEmail: "",
        ownerMobileNumber: "",
        managerName: "",
        managerMobileNumber: "",
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
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name.includes(".")) {
            const [section, field] = name.split(".")
            setFormData({
                ...formData,
                [section]: {
                    ...formData[section],
                    [field]: value,
                },
            })
        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
    }

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
        })
    }

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
        })
    }

    const nextStep = () => {
        setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        setCurrentStep(currentStep - 1)
    }

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
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                placeholder="Enter owner's full name"
                            />
                        </div>
                        <div className="form-groupR">
                            <label>
                                Owner Email<span className="required">*</span>
                            </label>

                            <input
                                className="inputR"
                                type="email"
                                name="ownerEmail"
                                value={formData.ownerEmail}
                                onChange={handleInputChange}
                                placeholder="Enter owner's email address"
                            />
                        </div>
                        <div className="form-groupR">
                            <label>
                                Owner Mobile Number<span className="required">*</span>
                            </label>
                            <input
                                className="inputR"
                                type="text"
                                name="ownerMobileNumber"
                                value={formData.ownerMobileNumber}
                                onChange={handleInputChange}
                                placeholder="Enter owner's mobile number"
                            />
                        </div>
                        <div className="form-groupR">
                            <label>
                                Manager Name<span className="required">*</span>
                            </label>
                            <input
                                className="inputR"
                                type="text"
                                name="managerName"
                                value={formData.managerName}
                                onChange={handleInputChange}
                                placeholder="Enter manager's full name"
                            />
                        </div>
                        <div className="form-groupR">
                            <label>
                                Manager Mobile Number<span className="required">*</span>
                            </label>
                            <input
                                className="inputR"
                                type="text"
                                name="managerMobileNumber"
                                value={formData.managerMobileNumber}
                                onChange={handleInputChange}
                                placeholder="Enter manager's mobile number"
                            />
                        </div>
                        <div className="button-group">
                            <button className="next-btn" onClick={nextStep}>
                                Next
                            </button>
                        </div>
                    </div>
                )

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
                                                <span className="toggle-label">{formData.operatingHours[day].isOpen ? "Open" : "Closed"}</span>
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
                                                    />
                                                </div>
                                                <div className="time-input">
                                                    <label className="close-label">Close</label>
                                                    <input
                                                        type="time"
                                                        value={formData.operatingHours[day].close}
                                                        onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                                                        className="close-time"
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
                )

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
                            >
                                <option value="">Select Bank</option>
                                <option value="bank1">Bank of Ceylon</option>
                                <option value="bank2">People's Bank</option>
                                <option value="bank3">Commercial Bank of Ceylon</option>
                                <option value="bank4">Sampath Bank</option>
                                <option value="bank5">Hatton National Bank (HNB)</option>
                                <option value="bank6">National Development Bank (NDB)</option>
                                <option value="bank7">Seylan Bank</option>
                                <option value="bank8">Union Bank of Colombo</option>
                                <option value="bank9">Pan Asia Banking Corporation</option>
                                <option value="bank10">DFCC Bank</option>
                                <option value="bank11">Nations Trust Bank</option>
                                <option value="bank12">Standard Chartered Bank</option>
                                <option value="bank13">HSBC Bank</option>
                                <option value="bank14">Citibank N.A.</option>
                                <option value="bank15">Indian Overseas Bank</option>
                                <option value="bank16">State Bank of India</option>
                                <option value="bank17">ICICI Bank</option>
                                <option value="bank18">Bangkok Bank</option>
                                <option value="bank19">Bank of China</option>
                                <option value="bank20">Deutsche Bank</option>
                            </select>
                        </div>
                        <div className="button-group">
                            <button className="back-btn" onClick={prevStep}>
                                Back
                            </button>
                            <button className="submit-btn">Submit Registration</button>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

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
    )
}

export default RestaurantSignUp

