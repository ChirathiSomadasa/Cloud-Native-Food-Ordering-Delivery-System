import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import Profile from "./pages/auth/profile/Profile";
import Cart from "./pages/customer/cart/Cart";//Piumi
import MyOrders from "./pages/customer/cart/MyOrders";
import ResOrders from "./pages/RestaurantAdmin/orders/orderNotify";
import PaymentDetails from "./pages/customer/payment/PaymentDetails";//Thamindu

//delivery related imports
import DeliveryDetails from "./pages/customer/delivery/DeliveryDetails";
import DeliveryHomeUser from "./pages/customer/delivery/DeliveryHomeUser";
import TrackDelivery from "./pages/customer/delivery/TrackDelivery";
import YourDeliveriesUser from "./pages/customer/delivery/YourDeliveriesUser";
import IncomingOrderRequest from "./pages/deliveryPersonnel/deliveryRequests/IncomingOrderRequest";
import OrderRequestDriverStatus from "./pages/deliveryPersonnel/deliveryRequests/OrderRequestDriverStatus";
import DeliveryStatus from "./pages/deliveryPersonnel/deliveryRequests/DeliveryStatus";
import DeliveryRequestStatus from "./pages/RestaurantAdmin/deliveryStatus/DeliveryRequestStatus";
import Footer from "./components/Footer";

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/restaurant-orders" element={<ResOrders />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
        {/* delivery related routes */}
        <Route path="/deliveries/deliveryHome" element={<DeliveryHomeUser />} />
        <Route path="/deliveries/deliveryDetails" element={<DeliveryDetails />} />
        <Route path="/deliveries/track_deleveries" element={<TrackDelivery />} />
        <Route path="/deliveries/your_deliveries" element={<YourDeliveriesUser />} />
        <Route path="/delivery-home/incoming_order" element={<IncomingOrderRequest />} />
        <Route path="/delivery-home/order_status" element={<OrderRequestDriverStatus />} />
        <Route path="/delivery-home/delivery_status" element={<DeliveryStatus />} />
        <Route path="/restuarant-home/delivery_status" element={<DeliveryRequestStatus />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;