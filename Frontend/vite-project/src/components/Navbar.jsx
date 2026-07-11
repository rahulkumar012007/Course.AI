import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="font-bold text-gray-800 text-lg">
            Course.Ai
          </span>
        </Link>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm hidden md:block">
              👤 {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 
                         px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-800 px-4 py-2 
                         rounded-lg text-sm font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
                         rounded-lg text-sm font-medium transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}