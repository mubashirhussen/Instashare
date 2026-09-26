import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm/Loginform'
import Home from './components/Home/Home'
import Reels from './components/Reels/Reels'
import UserDetails from './components/UserDetails/UserDetails'
import DirectMessages from './components/DirectMessages'
import NotFound from './components/NotFound/Notfound'
import ProtectedRouter from './components/ProtectedRouter/ProtectedRouter'
import './App.css'

const App = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginForm />}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRouter>
            <Home />
          </ProtectedRouter>
        }
      />
      <Route
        path="/reels"
        element={
          <ProtectedRouter>
            <Reels />
          </ProtectedRouter>
        }
      />
      <Route
        path="/users/:id"
        element={
          <ProtectedRouter>
            <UserDetails />
          </ProtectedRouter>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRouter>
            <UserDetails />
          </ProtectedRouter>
        }
      />
      <Route
        path="/direct"
        element={
          <ProtectedRouter>
            <DirectMessages />
          </ProtectedRouter>
        }
      />

      {/* Not Found */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  )
}

export default App
