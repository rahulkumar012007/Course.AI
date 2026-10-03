import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDocuments } from '../services/api'
import { useAuth } from '../context/AuthContext'
import FileUpload from '../components/FileUpload'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)



  // Documents fetch karo
  const fetchDocuments = async () => {
    try {
      const { data } = await getDocuments()
      setDocuments(data.documents)
    } catch (err) {
      console.error('Documents load nahi hue:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  // Upload complete hone ke baad
  // const handleUploadSuccess = (newDoc) => {
  //   setDocuments(prev => [newDoc, ...prev])
  //   setShowUpload(false)
  // }

  // Date format karo
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  //kuch new lines
  const handleUploadSuccess = (newDoc) => {
  const normalizedDoc = {
    ...newDoc,
    _id: newDoc._id || newDoc.id  // ✅ dono handle karo
  }
  setDocuments(prev => [normalizedDoc, ...prev])
  setShowUpload(false)
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Namaste, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Aaj kya padhna chahte ho?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-2xl font-bold text-gray-800">
              {documents.length}
            </div>
            <div className="text-gray-500 text-sm">Total Documents</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-gray-800">AI Chat</div>
            <div className="text-gray-500 text-sm">24/7 Available</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">🧠</div>
            <div className="text-2xl font-bold text-gray-800">Quiz</div>
            <div className="text-gray-500 text-sm">Auto Generated</div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Mere Documents
          </h2>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 
                       rounded-lg font-medium transition flex items-center gap-2"
          >
            {showUpload ? '✕ Band Karo' : '+ PDF Upload Karo'}
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="mb-6">
            <FileUpload onSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Documents List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent 
                            rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Documents load ho rahe hain...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed 
                          border-gray-300">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Koi document nahi hai
            </h3>
            <p className="text-gray-400 mb-6">
              Apna pehla PDF upload karo aur padhna shuru karo!
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              PDF Upload Karo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 
                           hover:shadow-md transition cursor-pointer overflow-hidden"
                onClick={() => navigate(`/study/${doc._id}`)}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <div className="text-3xl mb-1">📄</div>
                  <h3 className="text-white font-semibold truncate">
                    {doc.originalName}
                  </h3>
                  <p className="text-blue-100 text-xs mt-1">
                    {doc.pageCount} pages • {formatDate(doc.uploadedAt)}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {doc.summary || 'Summary load ho rahi hai...'}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <span className="bg-blue-50 text-blue-600 text-xs 
                                     px-2 py-1 rounded-full font-medium">
                      💬 Chat
                    </span>
                    <span className="bg-green-50 text-green-600 text-xs 
                                     px-2 py-1 rounded-full font-medium">
                      🧠 Quiz
                    </span>
                    <span className="bg-purple-50 text-purple-600 text-xs 
                                     px-2 py-1 rounded-full font-medium">
                      📝 Summary
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}