import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Paths where Navbar should not be displayed
  const authPaths = ["/login", "/register","/"];

  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className={`grid ${!isAuthPage ? "grid-cols-12" : ""} h-screen`}>
      {/* Navbar - spans 2 columns for non-auth pages */}
      {!isAuthPage && user && (
        <div className="col-span-2">
          <Navbar />
        </div>
      )}

      {/* Main Content */}
      <div className={`${!isAuthPage ? "col-span-10" : "w-full"}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
