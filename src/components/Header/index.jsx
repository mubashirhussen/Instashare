import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  BsSearch,
  BsHeart,
  BsHeartFill,
  BsPlusSquare,
  BsPatchCheckFill,
  BsXCircleFill,
} from 'react-icons/bs'
import { AiOutlineHome, AiFillHome } from 'react-icons/ai'
import { BiMoviePlay } from 'react-icons/bi'
import { RiMessengerLine, RiMessengerFill } from 'react-icons/ri'
import Cookies from 'js-cookie'
import Logo from '../Logo/Logo'
import CreatePostModal from '../CreatePostModal/CreatePostModal'
import { getUserProfile } from '../../utils/storage'
import './index.css'

// Directory of profiles for instant search & locate
const SEARCHABLE_PROFILES = [
  {
    username: 'mubashir_hussen.sk',
    fullName: 'Mubashir Hussen',
    avatar: '/profile_avatar.jpg',
    isVerified: true,
    category: 'Full Stack Developer & AI Enthusiast',
    followers: '2.9K',
  },
  {
    username: 'rahul',
    fullName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true,
    category: 'Lead Software Engineer',
    followers: '4.8K',
  },
  {
    username: 'ramakrishna',
    fullName: 'Ramakrishna Pindrala',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true,
    category: 'Tech Entrepreneur',
    followers: '48.5K',
  },
  {
    username: 'Yashwanth_raj',
    fullName: 'Yashwanth Raj',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isVerified: true,
    category: 'Visual Filmmaker & Creator',
    followers: '210K',
  },
  {
    username: 'pycode.dev',
    fullName: 'Python Developers Global',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    isVerified: true,
    category: 'Python, DSA & Data Science',
    followers: '142K',
  },
  {
    username: 'codenloop',
    fullName: 'Code N Loop',
    avatar: '/codenloop_story.jpg',
    isVerified: true,
    category: 'DSA & Java Master',
    followers: '89.4K',
  },
  {
    username: 'nextgendataaiacademy',
    fullName: 'NextGen AI Academy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isVerified: true,
    category: 'AI & Data Engineering',
    followers: '56.2K',
  },
  {
    username: 'flm_pronetwork',
    fullName: 'FLM Pro Network',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isVerified: true,
    category: 'Full Stack & Cloud Architecture',
    followers: '28.1K',
  },
  {
    username: 'reel_vibes',
    fullName: 'Reel Vibes Studio',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    isVerified: true,
    category: 'Cinematography & 4K Reels',
    followers: '340K',
  },
  {
    username: 'motion_designs',
    fullName: '3D & Motion Lab',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isVerified: true,
    category: 'Blender & Fluid Dynamics',
    followers: '190K',
  },
  {
    username: 'webdev_pro',
    fullName: 'WebDev Pro Hub',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    isVerified: true,
    category: 'React, Next.js & UI/UX',
    followers: '78.5K',
  },
  {
    username: 'tech_daily',
    fullName: 'Tech Daily Insights',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isVerified: true,
    category: 'AI Agents & Tech Trends',
    followers: '512K',
  },
]

const Header = ({ searchInput, setSearchInput, onSearchClick, onCreatePost }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const [showNotifications, setShowNotifications] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(getUserProfile())

  const searchBoxRef = useRef(null)

  const activeSearchText = (searchInput ?? localSearch).trim().toLowerCase()

  // Filter profiles
  const matchingProfiles = activeSearchText
    ? SEARCHABLE_PROFILES.filter(
        p =>
          p.username.toLowerCase().includes(activeSearchText) ||
          p.fullName.toLowerCase().includes(activeSearchText) ||
          p.category.toLowerCase().includes(activeSearchText),
      )
    : []

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserProfile(getUserProfile())
    }
    window.addEventListener('profile_updated', handleProfileUpdate)
    return () => window.removeEventListener('profile_updated', handleProfileUpdate)
  }, [])

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const onClickLogout = () => {
    Cookies.remove('jwt_token', { path: '/' })
    Cookies.remove('jwt_token', { path: '/login' })
    Cookies.remove('jwt_token')
  }

  const handleOpenCreate = () => {
    if (onCreatePost) {
      onCreatePost()
    } else {
      setIsCreateModalOpen(true)
    }
  }

  // Refresh & load fresh content when logo is clicked
  const handleLogoClick = e => {
    e.preventDefault()
    window.dispatchEvent(new Event('refresh_feed'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (currentPath !== '/') {
      navigate('/')
    }
  }

  const handleSelectProfile = profile => {
    setIsSearchOpen(false)
    if (setSearchInput) setSearchInput('')
    setLocalSearch('')
    if (profile.username === userProfile?.username || profile.username === 'mubashir_hussen.sk') {
      navigate('/my-profile')
    } else {
      navigate(`/users/${profile.username}`)
    }
  }

  return (
    <>
      <header className="nav-header">
        <div className="nav-content">
          {/* Logo with Instant Refresh */}
          <a href="/" onClick={handleLogoClick} className="logo-link" title="Click to refresh InstaShare feed">
            <Logo size="sm" showText={true} />
          </a>

          {/* Instant Search Bar with Live Profile Locator */}
          <div className="header-search-box" ref={searchBoxRef}>
            <input
              type="search"
              placeholder="Search people, tags, creators..."
              value={searchInput ?? localSearch}
              onFocus={() => setIsSearchOpen(true)}
              onChange={event => {
                const value = event.target.value
                if (setSearchInput) {
                  setSearchInput(value)
                } else {
                  setLocalSearch(value)
                }
                setIsSearchOpen(true)
                onSearchClick?.(value)
              }}
              className="search-input"
            />
            <span className="search-icon" aria-hidden="true">
              <BsSearch size={14} />
            </span>

            {activeSearchText && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  if (setSearchInput) setSearchInput('')
                  setLocalSearch('')
                  setIsSearchOpen(false)
                }}
              >
                <BsXCircleFill size={14} />
              </button>
            )}

            {/* Instant Search Dropdown Popover */}
            {isSearchOpen && activeSearchText && (
              <div className="search-results-dropdown">
                <div className="search-dropdown-header">
                  <span>PROFILES ({matchingProfiles.length})</span>
                </div>

                {matchingProfiles.length > 0 ? (
                  <div className="search-results-list">
                    {matchingProfiles.map(profile => (
                      <div
                        key={profile.username}
                        className="search-profile-row"
                        onClick={() => handleSelectProfile(profile)}
                      >
                        <img
                          src={profile.avatar || '/profile_avatar.jpg'}
                          alt={profile.username}
                          className="search-profile-avatar"
                          onError={e => {
                            e.target.onerror = null
                            e.target.src = '/profile_avatar.jpg'
                          }}
                        />
                        <div className="search-profile-info">
                          <div className="search-name-row">
                            <span className="search-username">{profile.username}</span>
                            {profile.isVerified && (
                              <BsPatchCheckFill className="verified-badge-icon" />
                            )}
                          </div>
                          <span className="search-fullname">{profile.fullName}</span>
                          <span className="search-meta">
                            {profile.category} • {profile.followers} followers
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="search-empty-results">
                    <p>No profiles found matching "{activeSearchText}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <nav className="nav-menu">
            {/* 1. Home */}
            <Link
              to="/"
              className={`nav-menu-item ${currentPath === '/' ? 'active-nav-item' : ''}`}
              title="Home"
            >
              {currentPath === '/' ? (
                <AiFillHome className="nav-icon" size={22} />
              ) : (
                <AiOutlineHome className="nav-icon" size={22} />
              )}
              <span className="nav-label">Home</span>
            </Link>

            {/* 2. Reels */}
            <Link
              to="/reels"
              className={`nav-menu-item ${currentPath === '/reels' ? 'active-nav-item' : ''}`}
              title="Reels"
            >
              <BiMoviePlay className="nav-icon" size={22} />
              <span className="nav-label">Reels</span>
            </Link>

            {/* 3. Messages */}
            <Link
              to="/direct"
              className={`nav-menu-item nav-messages-item ${
                currentPath === '/direct' ? 'active-nav-item' : ''
              }`}
              title="Messages"
            >
              <div className="nav-icon-badge-wrap">
                {currentPath === '/direct' ? (
                  <RiMessengerFill className="nav-icon" size={22} />
                ) : (
                  <RiMessengerLine className="nav-icon" size={22} />
                )}
                <span className="header-messages-badge">9+</span>
              </div>
              <span className="nav-label">Messages</span>
            </Link>

            {/* 4. Notifications */}
            <div className="notifications-nav-wrap">
              <button
                type="button"
                className={`nav-menu-item nav-button-item ${
                  showNotifications ? 'active-nav-item' : ''
                }`}
                title="Notifications"
                onClick={() => setShowNotifications(prev => !prev)}
              >
                {showNotifications ? (
                  <BsHeartFill className="nav-icon notification-active-heart" size={20} />
                ) : (
                  <BsHeart className="nav-icon" size={20} />
                )}
                <span className="nav-label">Notifications</span>
              </button>

              {showNotifications && (
                <div className="notifications-dropdown-menu">
                  <div className="notifications-dropdown-header">
                    <h4>Notifications</h4>
                  </div>
                  <div className="notifications-dropdown-list">
                    <div className="notification-row">
                      <img
                        src="/profile_avatar.jpg"
                        alt="user"
                        className="notif-user-avatar"
                      />
                      <div className="notif-text-info">
                        <p>
                          <strong>_hi_nanna___</strong> liked your post.
                        </p>
                        <span className="notif-time">2h ago</span>
                      </div>
                    </div>
                    <div className="notification-row">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                        alt="user"
                        className="notif-user-avatar"
                      />
                      <div className="notif-text-info">
                        <p>
                          <strong>ramakrishna</strong> started following you.
                        </p>
                        <span className="notif-time">5h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Create */}
            <button
              type="button"
              className="nav-menu-item nav-button-item create-nav-btn"
              title="Create New Post / Video"
              onClick={handleOpenCreate}
            >
              <BsPlusSquare className="nav-icon" size={20} />
              <span className="nav-label">Create</span>
            </button>

            {/* 6. Profile */}
            <Link
              to="/my-profile"
              className={`nav-menu-item ${
                currentPath === '/my-profile' ? 'active-nav-item' : ''
              }`}
              title="Profile"
            >
              <div className="nav-profile-avatar-wrap">
                <img
                  src={userProfile?.profilePic || '/profile_avatar.jpg'}
                  alt="Profile"
                  className="nav-profile-avatar-img"
                  onError={e => {
                    e.target.onerror = null
                    e.target.src = '/profile_avatar.jpg'
                  }}
                />
              </div>
              <span className="nav-label">Profile</span>
            </Link>

            {/* Logout button */}
            <Link
              to="/login"
              className="logout-desktop-btn"
              onClick={onClickLogout}
              title="Logout"
            >
              Logout
            </Link>
          </nav>
        </div>
      </header>

      {/* Global Direct File Upload Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}

export default Header
