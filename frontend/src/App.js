import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/auth/authSlice";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import CommunityList from "./pages/Communities";
import CreateCommunity from "./pages/createCommunity";
import CommunityDetail from "./pages/CommunityDetail";

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // navigation hook

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // redirect after logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Niche<span className="text-gray-800">Community</span>
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <Link
                to="/communities"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Communities
              </Link>
              <span className="font-medium">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
      <div className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ protect community routes */}
          <Route
            path="/communities"
            element={
              <ProtectedRoute>
                <CommunityList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communities/create"
            element={
              <ProtectedRoute>
                <CreateCommunity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/communities/:id"
            element={
              <ProtectedRoute>
              <CommunityDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

// wrap App in Router here (withNavigate only works inside Router)
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
