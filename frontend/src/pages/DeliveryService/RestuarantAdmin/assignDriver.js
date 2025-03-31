import React from "react";
import "./assignDriver.css";
import axios from "axios";  

const AssignDriver = ({ drivers, orderId, restaurantId }) => {

  // Function to handle assigning a driver
  const handleAssignDriver = async (driver) => {
    try {
      // Make the API call to the backend to assign the driver
      const response = await axios.post("/api/assign-driver", {
        orderId,
        restaurantId,
        driverId: driver._id
      });
      
      // Show success message or handle response
      alert(`Driver ${driver.first_name} ${driver.last_name} assigned successfully!`);
      console.log(response.data); 
    } catch (error) {
      // Handle error case
      console.error("Error assigning driver:", error);
      alert("Failed to assign driver. Please try again.");
    }
  };

  return (
    <div className="assign-container">
      <h2>Searching for available drivers</h2>
      <h3>Available drivers</h3>
      <div className="drivers-list">
        {drivers.map((driver, index) => (
          <div key={index} className="driver-card">
            <p>
              <strong>{driver.first_name} {driver.last_name}</strong>
            </p>
            <p>Mobile Number: {driver.mobile_number}</p>
            <button
              className="assign-btn"
              onClick={() => handleAssignDriver(driver)}  // Trigger the assignment when clicked
            >
              ASSIGN
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignDriver;
