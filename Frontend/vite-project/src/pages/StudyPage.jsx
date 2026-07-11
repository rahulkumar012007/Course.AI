import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDocument } from '../services/api'
import ChatBox from '../components/ChatBox'
import Summary from '../components/Summary'
import Quiz from '../components/Quiz'

export default function StudyPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()

  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary') // summary | chat | quiz

  useEffect(() => {
    getDocument(documentId)
      .then(res => setDocument(res.data.document))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [documentId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent 
                          rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Document load ho raha hai...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'summary', label: '📝 Summary', },
    { id: 'chat', label: '💬 Chat' },
    { id: 'quiz', label: '🧠 Quiz' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ← Wapas
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800 truncate">
              {document?.originalName}
            </h1>
            <p className="text-gray-500 text-sm">
              {document?.pageCount} pages
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {activeTab === 'summary' && (
            <Summary document={document} />
          )}
          {activeTab === 'chat' && (
            <ChatBox documentId={documentId} />
          )}
          {activeTab === 'quiz' && (
            <Quiz documentId={documentId} />
          )}
        </div>
      </div>
    </div>
  )
}