import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Logo from '../Logo/Logo'
import { registerUser, authenticateUser, saveUserProfile, getUserProfile } from '../../utils/storage'
import './LoginForm.css'

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [showSubmitError, setShowSubmitError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmitSuccess = (jwtToken, profileData) => {
    Cookies.set('jwt_token', jwtToken, { expires: 30, path: '/' })
    if (profileData) {
      saveUserProfile(profileData)
    }
    navigate('/', { replace: true })
  }

  const onSubmitFailure = msg => {
    setShowSubmitError(true)
    setErrorMsg(msg)
    setIsLoading(false)
  }

  const handleLogin = async event => {
    event.preventDefault()
    if (!username.trim() || !password.trim()) {
      onSubmitFailure('Please enter both username and password.')
      return
    }

    setIsLoading(true)
    setShowSubmitError(false)

    // Check if user is registered locally
    const localUser = authenticateUser(username.trim(), password)
    if (localUser) {
      const existingProfile = getUserProfile()
      const dynamicProfile = {
        ...existingProfile,
        username: localUser.username,
        name: localUser.fullName || localUser.username,
        profilePic: '/profile_avatar.jpg',
      }
      onSubmitSuccess('mock_jwt_token_' + Date.now(), dynamicProfile)
      return
    }

    // Try API login (for rahul / other demo accounts)
    const userDetails = { username: username.trim(), password }
    try {
      const response = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        body: JSON.stringify(userDetails),
      })
      const data = await response.json()
      if (response.ok) {
        onSubmitSuccess(data.jwt_token)
      } else {
        onSubmitFailure(data.error_msg || 'Invalid username or password.')
      }
    } catch {
      onSubmitFailure('Something went wrong. Please check your credentials.')
    }
  }

  const handleRegister = async event => {
    event.preventDefault()
    if (!username.trim() || !password.trim() || !fullName.trim()) {
      onSubmitFailure('Please fill in all required fields.')
      return
    }
    if (password.length < 6) {
      onSubmitFailure('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)
    setShowSubmitError(false)

    try {
      const newUser = registerUser({
        username: username.trim(),
        fullName: fullName.trim(),
        password,
        avatarUrl: '/profile_avatar.jpg',
      })

      setSuccessMsg(`Welcome, ${newUser.fullName}! Account created successfully.`)
      setTimeout(() => {
        onSubmitSuccess('mock_jwt_token_' + Date.now(), {
          ...getUserProfile(),
          username: newUser.username,
          name: newUser.fullName,
          profilePic: '/profile_avatar.jpg',
        })
      }, 1000)
    } catch (err) {
      onSubmitFailure(err.message || 'Registration failed. Try again.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <div className="login-logo-header">
            <Logo size="lg" />
            <h1 className="website-title">Insta Share</h1>
            <p className="login-subtitle">
              {isSignUp ? 'Create your account & explore' : 'Sign in to see posts & connect'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="auth-tab-toggle">
            <button
              type="button"
              className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(false)
                setShowSubmitError(false)
                setSuccessMsg('')
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
              onClick={() => {
                setIsSignUp(true)
                setShowSubmitError(false)
                setSuccessMsg('')
              }}
            >
              Sign Up
            </button>
          </div>

          <form className="login-form" onSubmit={isSignUp ? handleRegister : handleLogin}>
            {isSignUp && (
              <div className="input-container">
                <label className="input-label" htmlFor="fullName">
                  FULL NAME
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="login-input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Mubashir Hussen"
                  required
                />
              </div>
            )}

            <div className="input-container">
              <label className="input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="login-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={isSignUp ? 'Choose a unique username' : 'Username (e.g. rahul)'}
                required
              />
            </div>

            <div className="input-container">
              <label className="input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="login-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isSignUp ? 'At least 6 characters' : 'Password (e.g. rahul@2021)'}
                required
              />
            </div>

            {showSubmitError && <p className="error-message">{errorMsg}</p>}
            {successMsg && <p className="success-message">{successMsg}</p>}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="auth-footer-switch">
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="switch-link-btn"
                onClick={() => {
                  setIsSignUp(prev => !prev)
                  setShowSubmitError(false)
                  setSuccessMsg('')
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
