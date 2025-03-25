import { FiAlertCircle, FiRefreshCw } from "react-icons/fi"

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <FiAlertCircle className="h-12 w-12 text-red-500" />
      <p className="text-lg text-text-light">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiRefreshCw size={18} />
          <span>Reintentar</span>
        </button>
      )}
    </div>
  )
}