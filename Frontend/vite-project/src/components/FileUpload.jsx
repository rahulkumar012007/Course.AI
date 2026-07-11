import { useState } from 'react'
import { uploadDocument } from '../services/api'

export default function FileUpload({ onSuccess }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setError('')
    } else {
      setError('Sirf PDF file select karo!')
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return setError('Pehle file select karo')

    setLoading(true)
    setError('')
    setProgress('File upload ho rahi hai...')

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      setProgress('AI summary bana raha hai... (thoda time lagega)')

      const { data } = await uploadDocument(formData)

      setProgress('')
      setFile(null)
      onSuccess(data.document)

    } catch (err) {
      setError(err.response?.data?.message || 'Upload fail ho gaya')
      setProgress('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-blue-300 p-8">
      <div className="text-center">
        <div className="text-5xl mb-4">📤</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          PDF Upload Karo
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Maximum size: 10MB
        </p>

        {/* File Input */}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-input"
        />
        <label
          htmlFor="pdf-input"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 
                     px-6 py-3 rounded-lg cursor-pointer transition 
                     font-medium inline-block mb-4"
        >
          📂 File Choose Karo
        </label>

        {/* Selected File */}
        {file && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-700 text-sm font-medium">
              ✅ {file.name}
            </p>
            <p className="text-blue-500 text-xs mt-1">
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Progress */}
        {progress && (
          <div className="bg-yellow-50 border border-yellow-200 
                          rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-yellow-500 
                              border-t-transparent rounded-full animate-spin">
              </div>
              <p className="text-yellow-700 text-sm">{progress}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 
                          rounded-lg p-3 mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                     text-white px-8 py-3 rounded-lg font-medium 
                     transition w-full"
        >
          {loading ? 'Upload ho raha hai...' : 'Upload Karo 🚀'}
        </button>
      </div>
    </div>
  )
}