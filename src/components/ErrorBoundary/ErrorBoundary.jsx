import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error?.message || 'Unexpected application error' }
  }

  componentDidCatch(error, errorInfo) {
    // Log structured error without leaking auth tokens or sensitive data
    console.error('InstaShare UI ErrorBoundary caught an exception:', {
      message: error?.message,
      componentStack: errorInfo?.componentStack?.slice(0, 300),
    })
  }

  handleReload = () => {
    this.setState({ hasError: false, errorInfo: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          color: '#262626',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#8e8e8e', fontSize: '14px', maxWidth: '420px', marginBottom: '24px', lineHeight: 1.5 }}>
            An unexpected error occurred while rendering this page. You can return to the home feed or refresh the page.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 24px',
              backgroundColor: '#0095f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 149, 246, 0.3)'
            }}
          >
            Back to Home Feed
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
