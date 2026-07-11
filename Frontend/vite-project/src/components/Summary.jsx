export default function Summary({ document }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📝 AI Summary
      </h2>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {document?.summary || 'Summary available nahi hai'}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {document?.pageCount}
          </div>
          <div className="text-gray-500 text-sm mt-1">Total Pages</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {document?.content?.split(' ').length || 0}
          </div>
          <div className="text-gray-500 text-sm mt-1">Total Words</div>
        </div>
      </div>
    </div>
  )
}