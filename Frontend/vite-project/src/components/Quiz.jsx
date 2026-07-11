import { useState } from 'react'
import { generateQuiz } from '../services/api'

export default function Quiz({ documentId }) {
  const [quiz, setQuiz] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleGenerate = async () => {
    setLoading(true)
    setSelected({})
    setSubmitted(false)
    setScore(0)

    try {
      const { data } = await generateQuiz(documentId)
      setQuiz(data.quiz)
    } catch (err) {
      console.error('Quiz generate nahi hua:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (qIndex, optIndex) => {
    if (submitted) return
    setSelected(prev => ({ ...prev, [qIndex]: optIndex }))
  }

  const handleSubmit = () => {
    let correct = 0
    quiz.forEach((q, i) => {
      if (selected[i] === q.correct) correct++
    })
    setScore(correct)
    setSubmitted(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">🧠 Quiz</h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 
                     text-white px-5 py-2.5 rounded-lg font-medium transition"
        >
          {loading ? 'Ban raha hai...' : quiz.length ? '🔄 Naya Quiz' : '✨ Quiz Banao'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent 
                          rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">AI quiz bana raha hai...</p>
        </div>
      )}

      {!loading && quiz.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">🧠</div>
          <p>Quiz banao aur apna knowledge test karo!</p>
        </div>
      )}

      {/* Score */}
      {submitted && (
        <div className={`rounded-xl p-4 mb-6 text-center ${
          score >= 4 ? 'bg-green-50 border border-green-200' :
          score >= 3 ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="text-3xl mb-2">
            {score >= 4 ? '🎉' : score >= 3 ? '👍' : '📚'}
          </div>
          <p className="text-xl font-bold">
            {score}/{quiz.length} Sahi!
          </p>
          <p className="text-gray-600 text-sm mt-1">
            {score >= 4 ? 'Zabardast! Bahut achha kiya!' :
             score >= 3 ? 'Achha hai! Aur padho!' :
             'Thoda aur padhna hoga!'}
          </p>
        </div>
      )}

      {/* Questions */}
      {quiz.map((q, qIndex) => (
        <div key={qIndex}
             className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
          <p className="font-semibold text-gray-800 mb-4">
            {qIndex + 1}. {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((option, optIndex) => {
              let style = 'border-gray-200 bg-white hover:border-blue-300'

              if (submitted) {
                if (optIndex === q.correct) {
                  style = 'border-green-500 bg-green-50'
                } else if (selected[qIndex] === optIndex) {
                  style = 'border-red-400 bg-red-50'
                }
              } else if (selected[qIndex] === optIndex) {
                style = 'border-blue-500 bg-blue-50'
              }

              return (
                <button
                  key={optIndex}
                  onClick={() => handleSelect(qIndex, optIndex)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 
                               transition text-sm ${style}`}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

          {submitted && q.explanation && (
            <div className="mt-3 bg-blue-50 border border-blue-200 
                            rounded-lg p-3 text-sm text-blue-700">
              💡 {q.explanation}
            </div>
          )}
        </div>
      ))}

      {/* Submit Button */}
      {quiz.length > 0 && !submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selected).length !== quiz.length}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 
                     text-white py-3 rounded-xl font-medium transition"
        >
          Submit Karo ({Object.keys(selected).length}/{quiz.length} jawab diye)
        </button>
      )}
    </div>
  )
}