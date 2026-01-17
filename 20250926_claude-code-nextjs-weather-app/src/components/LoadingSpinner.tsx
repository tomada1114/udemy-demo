export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <div className="mt-4 text-center text-gray-600">読み込み中...</div>
      </div>
    </div>
  )
}