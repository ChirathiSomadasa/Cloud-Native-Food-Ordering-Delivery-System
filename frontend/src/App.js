import { BrowserRouter, Route,Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import SignUp from "./pages/auth/signup/SignUp";
import Login from "./pages/auth/login/Login";
import RestaurantSignUp from "./pages/auth/signup/RestaurantSignUp";
import RestaurantHome from "./pages/RestaurantAdmin/home/Home";
import CustomerHome from "./pages/customer/home/Home";
import AdminHome from "./pages/systemAdmin/home/Home";
import DeliveryHome from "./pages/deliveryPersonnel/home/Home";
import MenuItemAdd from "./pages/RestaurantAdmin/menuItem/MenuItemAdd";
import VerifyRestaurant from "./pages/systemAdmin/verifyRestaurant/VerifyRestaurant";
import MenuItemList from "./pages/RestaurantAdmin/menuItem/MenuItemList";
import MenuItemEdit from "./pages/RestaurantAdmin/menuItem/MenuItemEdit";
import ManageUsers from "./pages/systemAdmin/manageUsers/ManageUsers";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/restaurant-register" element={<RestaurantSignUp />} />
      <Route path="/restaurant-home" element={<RestaurantHome />} />
      <Route path="/" element={<CustomerHome />} />
      <Route path="/admin-home" element={<AdminHome />} />
      <Route path="/delivery-home" element={<DeliveryHome />} />
      <Route path="/addMenuItem" element={<MenuItemAdd />} />
      <Route path="/verifyRestaurant" element={<VerifyRestaurant />} />
      <Route path="/menu-item-list" element={<MenuItemList />} />
      <Route path="/edit-menu-item/:id" element={<MenuItemEdit />} />
      <Route path="/manage-users" element={<ManageUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;