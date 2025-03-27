import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/restaurant-register");
  };

  const handleMenuButtonClick = () => {
    navigate("/addMenuItem");
  };

  return (
    <div>
      RestaurantAdmin
      <button onClick={handleButtonClick}>Register Your restaurant</button>
      <button onClick={handleMenuButtonClick}>Add Menu Items Here</button>
    </div>
  );
}

export default Home;