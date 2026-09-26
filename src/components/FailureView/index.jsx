import './index.css'

const FailureView = ({ onRetry }) => (
  <div className="failure-view-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      alt="failure view"
      className="failure-view-image"
    />
    <h1 className="failure-heading">
      Something went wrong. Please try again
    </h1>
    <button type="button" className="retry-button" onClick={onRetry}>
      Try again
    </button>
  </div>
)

export default FailureView
