import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/restaurant-register");
  };

  return (
    <div>
      RestaurantAdmin
      <button onClick={handleButtonClick}>Register Your restaurant</button>
    </div>
  );
}

export default Home;