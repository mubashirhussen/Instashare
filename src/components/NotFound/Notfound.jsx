import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/instagram-mini-project/page-not-found-img.png"
      alt="page not found"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-desc">
      We are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <Link to="/" className="home-link-btn">
      Home Page
    </Link>
  </div>
)

export default NotFound
