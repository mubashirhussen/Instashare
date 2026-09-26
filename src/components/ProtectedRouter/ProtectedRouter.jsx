import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRouter = ({ children }) => {
  const jwtToken = Cookies.get('jwt_token')

  if (jwtToken === undefined) {
    return <Navigate to="/login" replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRouter
