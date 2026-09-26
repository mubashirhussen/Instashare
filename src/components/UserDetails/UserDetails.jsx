import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import {
  BsGrid3X3,
  BsGearWide,
  BsBookmark,
  BsPersonSquare,
  BsHeartFill,
  BsChatFill,
  BsPatchCheckFill,
  BsPlayFill,
  BsCameraVideo,
  BsEyeFill,
} from 'react-icons/bs'
import { BiMoviePlay, BiCamera, BiEditAlt, BiPlus } from 'react-icons/bi'
import { RiMessengerLine } from 'react-icons/ri'
import { ThreeDots } from 'react-loader-spinner'
import Header from '../Header'
import FailureView from '../FailureView'
import { getUserProfile, saveUserProfile } from '../../utils/storage'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const formatStoryTime = value => {
  if (!value) return 'Recently uploaded'
  const timestamp = new Date(value)
  if (Number.isNaN(timestamp.getTime())) return value
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp.getTime()) / 60000))
  if (minutes < 60) return `${minutes}m ago`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
  return `${Math.floor(minutes / 1440)}d ago`
}

const DEFAULT_HIGHLIGHTS = [
  {
    id: 'hl-1',
    title: 'Work & Code 💻',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop',
    uploadedAt: 'Active',
  },
  {
    id: 'hl-2',
    title: 'Adventures ⛰️',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop',
    uploadedAt: 'Active',
  },
  {
    id: 'hl-3',
    title: 'Aesthetics 🌸',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop',
    uploadedAt: 'Active',
  },
  {
    id: 'hl-4',
    title: 'AI Lab 🤖',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&auto=format&fit=crop',
    uploadedAt: 'Active',
  },
]

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
  const [activeTab, setActiveTab] = useState('posts')
  const [activeStory, setActiveStory] = useState(null)
  const [selectedMediaModal, setSelectedMediaModal] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Edit Form State
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editAvatar, setEditAvatar] = useState('')
  const [editWebsite, setEditWebsite] = useState('')

  const jwtToken = Cookies.get('jwt_token')

  const loadLocalOrRemoteProfile = useCallback(async () => {
    setApiStatus(apiStatusConstants.inProgress)

    // If viewing own profile or no id provided
    if (!id || id === 'my-profile' || id === 'current-user' || id === 'current_user') {
      const localProfile = getUserProfile()
      setProfileData({
        user_name: localProfile.username || 'mubashir_hussen.sk',
        full_name: localProfile.name || 'Mubashir Hussen',
        profile_pic: localProfile.profilePic || '/profile_avatar.jpg',
        followers_count: localProfile.followersCount || 2900,
        following_count: localProfile.followingCount || 397,
        posts_count: (localProfile.posts || []).length,
        user_bio: localProfile.bio || '†-☬_MONSTER_☬-† | Full Stack Developer & AI Enthusiast 🚀✨',
        website: localProfile.website || 'https://instashare.io',
        posts: localProfile.posts || [],
        reels: localProfile.reels || [],
        saved: localProfile.saved || [],
        tagged: localProfile.tagged || [],
        stories: DEFAULT_HIGHLIGHTS,
      })
      setApiStatus(apiStatusConstants.success)
      return
    }

    // Remote user profile
    const apiUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    try {
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })
      if (response.ok) {
        const data = await response.json()
        const fetched = data.user_details || data.profile
        setProfileData({
          ...fetched,
          reels: [
            {
              id: 'r_fetched_1',
              thumbnail: fetched.posts?.[0]?.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
              videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
              views: '45.2K',
              likes: 1240,
              caption: 'Cinematic perspectives',
            },
          ],
          saved: [],
          tagged: [],
          stories: fetched.stories?.length ? fetched.stories : DEFAULT_HIGHLIGHTS,
        })
        setApiStatus(apiStatusConstants.success)
      } else {
        // Fallback to rich mock data if api fails
        const local = getUserProfile()
        setProfileData({
          user_name: id,
          full_name: id.replace(/_/g, ' '),
          profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop',
          followers_count: 1420,
          following_count: 280,
          posts_count: 6,
          user_bio: 'Visual Creator & Tech Explorer ✨',
          posts: local.posts || [],
          reels: local.reels || [],
          saved: [],
          tagged: [],
          stories: DEFAULT_HIGHLIGHTS,
        })
        setApiStatus(apiStatusConstants.success)
      }
    } catch {
      const local = getUserProfile()
      setProfileData({
        user_name: id,
        full_name: id.replace(/_/g, ' '),
        profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop',
        followers_count: 1420,
        following_count: 280,
        posts_count: 6,
        user_bio: 'Visual Creator & Tech Explorer ✨',
        posts: local.posts || [],
        reels: local.reels || [],
        saved: [],
        tagged: [],
        stories: DEFAULT_HIGHLIGHTS,
      })
      setApiStatus(apiStatusConstants.success)
    }
  }, [id, jwtToken])

  useEffect(() => {
    loadLocalOrRemoteProfile()

    const handleUpdate = () => {
      loadLocalOrRemoteProfile()
    }

    window.addEventListener('profile_updated', handleUpdate)
    window.addEventListener('new_post_created', handleUpdate)

    return () => {
      window.removeEventListener('profile_updated', handleUpdate)
      window.removeEventListener('new_post_created', handleUpdate)
    }
  }, [loadLocalOrRemoteProfile])

  const openEditModal = () => {
    if (!profileData) return
    setEditName(profileData.full_name || profileData.user_name || '')
    setEditBio(profileData.user_bio || '')
    setEditAvatar(profileData.profile_pic || '')
    setEditWebsite(profileData.website || '')
    setIsEditModalOpen(true)
  }

  const handleSaveProfileEdit = e => {
    e.preventDefault()
    const current = getUserProfile()
    const updated = {
      ...current,
      name: editName.trim() || current.name,
      bio: editBio.trim() || current.bio,
      profilePic: editAvatar.trim() || current.profilePic,
      website: editWebsite.trim() || current.website,
    }
    saveUserProfile(updated)
    setIsEditModalOpen(false)
  }

  const renderLoader = () => (
    <div className="profile-loader-container" data-testid="loader">
      <ThreeDots color="#0095f6" height={50} width={50} />
    </div>
  )

  const renderProfileView = () => {
    const {
      user_name: userName = 'mubashir_hussen.sk',
      full_name: fullName = 'Mubashir Hussen',
      profile_pic: profilePic = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop',
      followers_count: followersCount = 2900,
      following_count: followingCount = 397,
      user_bio: userBio = '†-☬_MONSTER_☬-† | Full Stack Developer & AI Enthusiast 🚀✨',
      website = 'https://instashare.io',
      posts = [],
      reels = [],
      saved = [],
      tagged = [],
      stories = DEFAULT_HIGHLIGHTS,
    } = profileData || {}

    return (
      <div className="instagram-profile-wrapper">
        {/* Profile Header Info */}
        <header className="profile-header-section">
          <div className="profile-avatar-wrapper">
            <div className="note-bubble">
              <span className="note-text">Note... 💭</span>
              <span className="note-arrows">⇅</span>
            </div>
            <div className="avatar-ring-gradient">
              <div className="avatar-inner-border">
                <img src={profilePic} alt="user profile" className="main-profile-img" />
              </div>
            </div>
          </div>

          <div className="profile-details-column">
            <div className="profile-top-bar">
              <div className="profile-username-group">
                <h2 className="profile-username-title">{userName}</h2>
                <BsPatchCheckFill className="profile-verified-badge" title="Verified Creator" />
              </div>

              <div className="profile-actions-row">
                {(!id || id === 'my-profile' || id === 'current-user') ? (
                  <>
                    <button
                      type="button"
                      className="profile-action-btn edit-btn"
                      onClick={openEditModal}
                    >
                      <BiEditAlt size={16} />
                      <span>Edit profile</span>
                    </button>
                    <button
                      type="button"
                      className="profile-action-btn share-profile-btn"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href)
                        alert('Profile link copied! 📋')
                      }}
                    >
                      Share profile
                    </button>
                  </>
                ) : (
                  <button type="button" className="profile-action-btn follow-btn">
                    Follow
                  </button>
                )}

                <button
                  type="button"
                  className="settings-icon-btn"
                  aria-label="Settings"
                  onClick={openEditModal}
                >
                  <BsGearWide size={20} />
                </button>
              </div>
            </div>

            <div className="profile-stats-row">
              <div className="stat-item">
                <span className="stat-number">{posts.length}</span> posts
              </div>
              <div className="stat-item">
                <span className="stat-number">{followersCount.toLocaleString()}</span> followers
              </div>
              <div className="stat-item">
                <span className="stat-number">{followingCount.toLocaleString()}</span> following
              </div>
            </div>

            <div className="profile-bio-container">
              <p className="full-name-text">{fullName}</p>
              <p className="bio-text">{userBio}</p>
              {website && (
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-website-link"
                >
                  🔗 {website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Story Highlights Bar */}
        <section className="profile-stories-section" aria-label="Story Highlights">
          <div className="profile-stories-heading">
            <h3>Highlights</h3>
            <span>{stories.length} active albums</span>
          </div>
          <div className="profile-stories-list">
            {stories.map(story => (
              <button
                type="button"
                className="profile-story-button"
                key={story.id}
                onClick={() => setActiveStory(story)}
              >
                <span className="profile-story-ring">
                  <img
                    src={story.image || story.story_url}
                    alt={story.title || story.caption}
                    className="profile-story-image"
                  />
                </span>
                <span className="story-title-label">{story.title || story.caption || 'Highlight'}</span>
                <small>{formatStoryTime(story.uploadedAt)}</small>
              </button>
            ))}

            <button
              type="button"
              className="profile-story-button add-highlight-btn"
              onClick={() => alert('Add highlight feature is live!')}
            >
              <span className="add-highlight-ring">
                <BiPlus size={26} />
              </span>
              <span className="story-title-label">New</span>
            </button>
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="profile-tabs-nav">
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'posts' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <BsGrid3X3 size={15} />
            <span>POSTS ({posts.length})</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'reels' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('reels')}
          >
            <BiMoviePlay size={17} />
            <span>REELS ({reels.length})</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'saved' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <BsBookmark size={15} />
            <span>SAVED ({saved.length})</span>
          </button>
          <button
            type="button"
            className={`profile-tab-btn ${activeTab === 'tagged' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('tagged')}
          >
            <BsPersonSquare size={15} />
            <span>TAGGED ({tagged.length})</span>
          </button>
        </nav>

        {/* Active Tab Content */}
        <section className="profile-posts-grid-section">
          {/* 1. POSTS TAB */}
          {activeTab === 'posts' && (
            posts.length === 0 ? (
              <div className="no-posts-container">
                <BiCamera size={52} className="no-posts-icon" />
                <h3>Share Photos & Videos</h3>
                <p>When you share photos and videos, they will appear on your profile.</p>
              </div>
            ) : (
              <div className="instagram-grid">
                {posts.map(post => (
                  <div
                    key={post.id}
                    className="grid-post-card"
                    onClick={() => setSelectedMediaModal(post)}
                  >
                    {post.isVideo && post.videoUrl ? (
                      <video
                        src={post.videoUrl}
                        className="grid-post-image"
                        muted
                        loop
                        onMouseOver={e => e.target.play().catch(() => {})}
                        onMouseOut={e => e.target.pause()}
                      />
                    ) : (
                      <img src={post.image} alt={post.caption || 'post'} className="grid-post-image" />
                    )}

                    {post.isVideo && (
                      <div className="video-type-badge" title="Video Reel">
                        <BsPlayFill size={20} />
                      </div>
                    )}

                    <div className="post-hover-overlay">
                      <div className="overlay-stat">
                        <BsHeartFill size={18} />
                        <span>{post.likes || 128}</span>
                      </div>
                      <div className="overlay-stat">
                        <BsChatFill size={18} />
                        <span>{post.comments || 16}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 2. REELS TAB */}
          {activeTab === 'reels' && (
            reels.length === 0 ? (
              <div className="no-posts-container">
                <BsCameraVideo size={52} className="no-posts-icon" />
                <h3>No Reels Yet</h3>
                <p>Capture and create vertical video reels.</p>
              </div>
            ) : (
              <div className="instagram-reels-grid">
                {reels.map(reel => (
                  <div
                    key={reel.id}
                    className="reel-card-preview"
                    onClick={() => setSelectedMediaModal({ ...reel, isVideo: true, image: reel.thumbnail })}
                  >
                    <video
                      src={reel.videoUrl}
                      className="reel-video-preview"
                      muted
                      loop
                      onMouseOver={e => e.target.play().catch(() => {})}
                      onMouseOut={e => e.target.pause()}
                    />
                    <div className="reel-card-overlay">
                      <div className="reel-view-stat">
                        <BsEyeFill size={14} />
                        <span>{reel.views || '10.5K'}</span>
                      </div>
                      <div className="reel-like-stat">
                        <BsHeartFill size={13} />
                        <span>{reel.likes || 240}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 3. SAVED TAB */}
          {activeTab === 'saved' && (
            saved.length === 0 ? (
              <div className="no-posts-container">
                <BsBookmark size={52} className="no-posts-icon" />
                <h3>Save Posts to Collections</h3>
                <p>Save photos and videos that you want to see again. No one is notified.</p>
              </div>
            ) : (
              <div className="instagram-grid">
                {saved.map(item => (
                  <div
                    key={item.id}
                    className="grid-post-card"
                    onClick={() => setSelectedMediaModal(item)}
                  >
                    <img src={item.image} alt={item.caption || 'saved'} className="grid-post-image" />
                    <div className="post-hover-overlay">
                      <div className="overlay-stat">
                        <BsHeartFill size={18} />
                        <span>{item.likes || 420}</span>
                      </div>
                      <div className="overlay-stat">
                        <BsChatFill size={18} />
                        <span>{item.comments || 28}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 4. TAGGED TAB */}
          {activeTab === 'tagged' && (
            tagged.length === 0 ? (
              <div className="no-posts-container">
                <BsPersonSquare size={52} className="no-posts-icon" />
                <h3>Photos of You</h3>
                <p>When people tag you in photos, they will appear here.</p>
              </div>
            ) : (
              <div className="instagram-grid">
                {tagged.map(item => (
                  <div
                    key={item.id}
                    className="grid-post-card"
                    onClick={() => setSelectedMediaModal(item)}
                  >
                    <img src={item.image} alt={item.caption || 'tagged'} className="grid-post-image" />
                    <div className="post-hover-overlay">
                      <div className="overlay-stat">
                        <BsHeartFill size={18} />
                        <span>{item.likes || 310}</span>
                      </div>
                      <div className="overlay-stat">
                        <BsChatFill size={18} />
                        <span>{item.comments || 19}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>

        {/* Floating Messages Bubble Widget */}
        <div className="floating-messages-widget" onClick={() => navigate('/direct')}>
          <div className="messages-icon-wrap">
            <RiMessengerLine size={20} />
            <span className="messages-badge">6</span>
          </div>
          <span className="messages-text">Messages</span>
        </div>

        {/* Story Viewer Modal */}
        {activeStory && (
          <div className="story-viewer-backdrop" role="presentation" onClick={() => setActiveStory(null)}>
            <div
              className="story-viewer"
              role="dialog"
              aria-modal="true"
              aria-label="Story highlight"
              onClick={event => event.stopPropagation()}
            >
              <button
                type="button"
                className="story-viewer-close"
                aria-label="Close story"
                onClick={() => setActiveStory(null)}
              >
                ×
              </button>
              <img
                src={activeStory.image || activeStory.story_url}
                alt={activeStory.caption || 'highlight'}
                className="story-viewer-image"
              />
              <div className="story-info-bar">
                <h4>{activeStory.title || activeStory.caption}</h4>
                <p>{formatStoryTime(activeStory.uploadedAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Media Detail Full Modal */}
        {selectedMediaModal && (
          <div
            className="media-modal-backdrop"
            role="presentation"
            onClick={() => setSelectedMediaModal(null)}
          >
            <div
              className="media-modal-card"
              role="dialog"
              aria-modal="true"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className="media-modal-close"
                onClick={() => setSelectedMediaModal(null)}
              >
                ×
              </button>
              <div className="media-modal-content">
                <div className="modal-media-pane">
                  {selectedMediaModal.isVideo && selectedMediaModal.videoUrl ? (
                    <video
                      src={selectedMediaModal.videoUrl}
                      controls
                      autoPlay
                      className="modal-full-media"
                    />
                  ) : (
                    <img
                      src={selectedMediaModal.image}
                      alt={selectedMediaModal.caption || 'post'}
                      className="modal-full-media"
                    />
                  )}
                </div>
                <div className="modal-info-pane">
                  <div className="modal-user-header">
                    <img src={profilePic} alt={userName} className="modal-avatar" />
                    <div>
                      <strong>{userName}</strong>
                      <p className="modal-location">Published</p>
                    </div>
                  </div>
                  <div className="modal-caption-text">
                    <p>
                      <strong>{userName}</strong> {selectedMediaModal.caption || 'Aesthetic InstaShare post ✨'}
                    </p>
                  </div>
                  <div className="modal-footer-stats">
                    <span>❤️ {selectedMediaModal.likes || 120} likes</span>
                    <span>💬 {selectedMediaModal.comments || 15} comments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div
            className="edit-profile-backdrop"
            role="presentation"
            onClick={() => setIsEditModalOpen(false)}
          >
            <div
              className="edit-profile-modal"
              role="dialog"
              aria-modal="true"
              onClick={e => e.stopPropagation()}
            >
              <div className="edit-modal-header">
                <h3>Edit Profile Details</h3>
                <button
                  type="button"
                  className="edit-modal-close"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveProfileEdit} className="edit-profile-form">
                <div className="edit-form-group">
                  <label htmlFor="edit-name">Display Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-bio">Bio & Tagline</label>
                  <textarea
                    id="edit-bio"
                    rows="3"
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Tell everyone about yourself..."
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-avatar">Profile Picture URL</label>
                  <input
                    id="edit-avatar"
                    type="url"
                    value={editAvatar}
                    onChange={e => setEditAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="edit-form-group">
                  <label htmlFor="edit-website">Website URL</label>
                  <input
                    id="edit-website"
                    type="text"
                    value={editWebsite}
                    onChange={e => setEditWebsite(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                  />
                </div>

                <div className="edit-form-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="profile-root-layout">
      <Header />
      <main className="profile-main-content">
        {apiStatus === apiStatusConstants.inProgress && renderLoader()}
        {apiStatus === apiStatusConstants.failure && (
          <FailureView onRetry={loadLocalOrRemoteProfile} />
        )}
        {apiStatus === apiStatusConstants.success && renderProfileView()}
      </main>
    </div>
  )
}

export default UserDetails
