import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('') // Error clear karo
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await login(formData)

      // Token save karo
      localStorage.setItem('token', data.token)
      setUser(data.user)

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed, dobara try karo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-gray-800">Wapas Aao!</h1>
          <p className="text-gray-500 mt-1">Apne account mein login karo</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 
                          rounded-lg p-3 mb-6 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="apna@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                       text-white font-semibold py-3 rounded-lg transition 
                       flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                rounded-full animate-spin"></div>
                Login ho raha hai...
              </>
            ) : (
              'Login Karo 🚀'
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Account nahi hai?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Register Karo
          </Link>
        </p>
      </div>
    </div>
  )
}