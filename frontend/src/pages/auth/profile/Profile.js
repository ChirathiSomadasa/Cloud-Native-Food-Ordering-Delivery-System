import { useState, useEffect } from "react"
import "./Profile.css"

function Profile() {
  // State for user profile data
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    city: "",
    email: "",
  })

  // State for form editing
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ ...profile })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ text: "", type: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch user profile data from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          console.error("Token not found in localStorage")
          return
        }

        const response = await fetch("http://localhost:5001/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.error(`Error fetching user profile: ${response.status}`)
          return
        }

        const data = await response.json()
        if (data.Status === "Success") {
          const { first_name, last_name, mobile_number, city, email } = data.data
          setProfile({
            firstName: first_name,
            lastName: last_name,
            mobileNumber: mobile_number,
            city,
            email,
          })
          setFormData({
            firstName: first_name,
            lastName: last_name,
            mobileNumber: mobile_number,
            city,
            email,
          })
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    fetchUserProfile()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Validate form data
  const validateForm = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required"
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits"
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission (Update Profile)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          console.error("Token not found in localStorage")
          return
        }

        const response = await fetch("http://localhost:5001/api/auth/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            mobile_number: formData.mobileNumber,
            city: formData.city,
            email: formData.email,
          }),
        })

        if (!response.ok) {
          console.error(`Error updating profile: ${response.status}`)
          return
        }

        const data = await response.json()
        if (data.Status === "Success") {
          setProfile(formData)
          setIsEditing(false)
          setMessage({
            text: "Profile updated successfully!",
            type: "success",
          })
          setTimeout(() => {
            setMessage({ text: "", type: "" })
          }, 3000)
        }
      } catch (error) {
        console.error("Error updating profile:", error)
      }
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setFormData({ ...profile })
    setIsEditing(false)
    setErrors({})
  }

  // Handle delete account
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        console.error("Token not found in localStorage")
        return
      }

      const response = await fetch("http://localhost:5001/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.error(`Error deleting account: ${response.status}`)
        return
      }

      const data = await response.json()
      if (data.Status === "Success") {
        setMessage({
          text: "Account deleted successfully. Redirecting...",
          type: "success",
        })
        setTimeout(() => {
          alert("Account deleted! Redirecting to login page.")
          window.location.href = "/login" // Redirect to login page
        }, 2000)
      }
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account details and delivery preferences</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <span className="message-icon">{message.type === "success" ? "✓" : "⚠"}</span>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? "error-input" : ""}
              placeholder="Enter your first name"
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? "error-input" : ""}
              placeholder="Enter your last name"
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className={errors.mobileNumber ? "error-input" : ""}
              placeholder="Enter your 10-digit mobile number"
            />
            {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? "error-input" : ""}
              placeholder="Enter your city"
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="button-group">
            {isEditing ? (
              <>
                <button type="submit" className="btn save-btn">
                  Save Changes
                </button>
                <button type="button" className="btn cancel-btn" onClick={handleCancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn edit-btn" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
                <button type="button" className="btn delete-btn" onClick={() => setShowDeleteConfirm(true)}>
                  Delete Account
                </button>
              </>
            )}
          </div>
        </form>

        <div className="profile-info">
          <div className="info-box">
            <h3>Delivery Preferences</h3>
            <p>Your orders will be delivered to your address in {profile.city}.</p>
            <p>Make sure your mobile number is correct to receive delivery updates.</p>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="delete-confirmation">
            <div className="delete-confirmation-content">
              <h2>Are you sure?</h2>
              <p>
                Deleting your account will remove all your saved addresses, order history, and preferences. This action
                cannot be undone.
              </p>
              <div className="delete-confirmation-buttons">
                <button className="btn delete-confirm-btn" onClick={handleDeleteAccount}>
                  Yes, Delete My Account
                </button>
                <button className="btn cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                  No, Keep My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
