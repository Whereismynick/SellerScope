import { Route, Routes } from "react-router-dom"
import Analytics from "./pages/Analytics"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Orders from "./pages/Orders"
import Products from "./pages/Products"
import Settings from "./pages/Settings"
import MainLayout from "./layouts/MainLayout"
import ProductDetails from "./pages/ProductDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

const App = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Route>
      </Route>
    </Routes>
  )
}
export default App