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
import Cart from "./pages/customer/cart/Cart";//Piumi
import MyOrders from "./pages/customer/cart/MyOrders";
import PaymentDetails from "./pages/customer/payment/PaymentDetails";//Thamindu




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
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/payment" element={<PaymentForm/>}/>
      <Route path="/payment-details" element={<PaymentDetails/>}/>

    {/* delivery related routes */}
    <Route path="/deliveries/deliveryDetails" element={<DeliveryDetails/>}/>
    <Route path="/delivery-home/incoming_order" element={<IncomingOrderRequest/>}/>
    <Route path="/delivery-home/order_status" element={<OrderRequestDriverStatus/>}/>
    <Route path="/delivery-home/delivery_status" element={<DeliveryStatus/>}/>
    <Route path="/restuarant-home/delivery_status" element={<DeliveryRequestStatus/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;