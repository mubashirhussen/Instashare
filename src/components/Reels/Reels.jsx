import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsPlayFill,
  BsPauseFill,
  BsHeartFill,
  BsHeart,
  BsChatFill,
  BsChat,
  BsSend,
  BsBookmark,
  BsBookmarkFill,
  BsThreeDots,
  BsEyeFill,
  BsPatchCheckFill,
  BsMusicNoteBeamed,
  BsInstagram,
  BsEmojiSmile,
  BsX,
  BsExclamationTriangleFill,
  BsFullscreen,
  BsFullscreenExit,
  BsArrowClockwise,
  BsEyeSlash,
  BsPersonX,
  BsSliders,
} from 'react-icons/bs'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import Header from '../Header'
import SocialShieldAlert from '../SocialShieldModal/SocialShieldAlert'
import { submitComment, fetchComments } from '../../services/commentService'
import {
  fetchRecommendedFeed,
  trackReelInteraction,
  sendReelFeedback,
  fetchReelsAnalytics,
} from '../../services/reelsRecommendationService'
import { getCustomFeedPosts } from '../../utils/storage'
import './Reels.css'

import DIVERSE_REELS_LIST from '../../data/reelsData.json'

const BACKEND_API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://socialshield-backend.onrender.com'
    : 'http://localhost:8000')

export { DIVERSE_REELS_LIST }
export const LEARNING_REELS_LIST = DIVERSE_REELS_LIST

export const REEL_CATEGORIES = [
  'All',
  'Education',
  'Technology',
  'Artificial Intelligence',
  'Sports',
  'Nature',
  'Travel',
  'Food',
  'Movies and Entertainment',
  'Dialogues and Comedy',
  'Bikes and Automobiles',
  'Gaming',
  'Fitness and Health',
  'Lifestyle',
  'Music and Dance',
  'Photography and Creativity',
  'Science and Innovation',
  'Motivation and Personal Development',
  'Architecture and Design',
  'Animals and Pets',
  'Miscellaneous Trending Content',
]

/**
 * Clean, immersive Reel Card without distracting top badges or overlays.
 * Verification badge is conditionally displayed only for genuine verified accounts.
 */
const ReelGridCard = ({ reel, onClickCard }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(reel.likes_count || 0)
  const videoRef = useRef(null)

  const handleLike = e => {
    e.stopPropagation()
    const nextState = !isLiked
    setIsLiked(nextState)
    setLikesCount(prev => (nextState ? prev + 1 : Math.max(0, prev - 1)))
    trackReelInteraction({
      userId: 'mubashir_hussen.sk',
      reelId: reel.id,
      eventType: nextState ? 'like' : 'unlike',
      category: reel.category,
      creatorName: reel.user_name,
    })
  }

  return (
    <div
      className="side-by-side-reel-card"
      onClick={() => onClickCard(reel)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClickCard(reel)
        }
      }}
    >
      <div className="reel-media-wrapper">
        <video
          ref={videoRef}
          src={reel.video_url}
          poster={reel.thumbnail_url}
          className="reel-grid-video"
          playsInline
          loop
          autoPlay
          muted
          onError={() => {
            if (videoRef.current && !videoRef.current.src.endsWith('/videos/sample_reel_1.mp4')) {
              videoRef.current.src = '/videos/sample_reel_1.mp4'
              videoRef.current.load()
            }
          }}
        />

        {/* Bottom Details Bar - Clean, authentic presentation without top badges */}
        <div className="reel-bottom-bar">
          <div className="reel-author-row">
            <img
              src={reel.profile_pic || '/profile_avatar.jpg'}
              alt={reel.user_name}
              className="reel-avatar"
              onError={e => {
                e.target.onerror = null
                e.target.src = '/profile_avatar.jpg'
              }}
            />
            <span className="reel-username">{reel.user_name}</span>
            {reel.is_verified && <BsPatchCheckFill className="reel-verified-badge" />}
          </div>

          <p className="reel-caption-text">{reel.caption}</p>

          <div className="reel-audio-track">
            <BsMusicNoteBeamed size={11} />
            <span>{reel.audio_info || 'Original Audio'}</span>
          </div>

          <div className="reel-actions-row">
            <button
              type="button"
              className={`reel-action-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {isLiked ? <BsHeartFill size={15} /> : <BsHeart size={15} />}
              <span>{likesCount.toLocaleString()}</span>
            </button>

            <button
              type="button"
              className="reel-action-btn"
              onClick={e => {
                e.stopPropagation()
                onClickCard(reel)
              }}
            >
              <BsChatFill size={14} />
              <span>{reel.comments_count || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Reels = () => {
  const currentUserId = 'mubashir_hussen.sk'
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedReelModal, setSelectedReelModal] = useState(null)
  const [modalMuted, setModalMuted] = useState(false)
  const [modalPlaying, setModalPlaying] = useState(true)
  const [modalLiked, setModalLiked] = useState(false)
  const [modalLikesCount, setModalLikesCount] = useState(0)
  const [modalSaved, setModalSaved] = useState(false)
  const [modalFollowing, setModalFollowing] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [modalComments, setModalComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentError, setCommentError] = useState(null)
  const [shieldAlert, setShieldAlert] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allReels, setAllReels] = useState(DIVERSE_REELS_LIST)

  // Recommendation & Feedback States
  const [feedSessionId, setFeedSessionId] = useState(null)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const watchStartTimeRef = useRef(null)
  const completionTrackedRef = useRef(false)

  const showToast = msg => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Advanced Native Video Player States
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const modalVideoRef = useRef(null)
  const modalPaneRef = useRef(null)

  const formatTime = seconds => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const toggleModalPlay = () => {
    if (!modalVideoRef.current) return
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play().then(() => setModalPlaying(true)).catch(() => {})
    } else {
      modalVideoRef.current.pause()
      setModalPlaying(false)
    }
  }

  const handleSeek = e => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (modalVideoRef.current) {
      modalVideoRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = e => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    if (modalVideoRef.current) {
      modalVideoRef.current.volume = newVol
      if (newVol === 0) {
        modalVideoRef.current.muted = true
        setModalMuted(true)
      } else {
        modalVideoRef.current.muted = false
        setModalMuted(false)
      }
    }
  }

  const toggleFullscreen = () => {
    if (!modalPaneRef.current) return
    if (!document.fullscreenElement) {
      modalPaneRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  const handleOpenReel = async reel => {
    setSelectedReelModal(reel)
    setModalPlaying(true)
    setModalMuted(false)
    setModalLiked(false)
    setModalLikesCount(reel.likes_count || 3270)
    setModalSaved(false)
    setModalFollowing(false)
    setCommentText('')
    setCommentError(null)
    setIsSubmitting(false)
    setCurrentTime(0)
    setDuration(0)
    setVideoError(false)
    setIsBuffering(false)
    setCommentsLoading(true)
    setShowOptionsMenu(false)

    // Interaction tracking: Record playback start & view
    watchStartTimeRef.current = Date.now()
    completionTrackedRef.current = false
    trackReelInteraction({
      userId: currentUserId,
      reelId: reel.id,
      eventType: 'view',
      category: reel.category,
      creatorName: reel.user_name,
    })

    // Load authentic stored comments for this specific reel from backend/localStorage
    try {
      const res = await fetchComments(reel.id)
      if (res && Array.isArray(res.comments) && res.comments.length > 0) {
        setModalComments(res.comments)
      } else {
        const initialSeed = [
          {
            id: `${reel.id}_c1`,
            username: 'pawavarma795',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
            text: '🙌 🔥 Great explanation on loops and syntax!',
            time: '5w',
            likes: 1,
          },
          {
            id: `${reel.id}_c2`,
            username: 'dribspyetrocrown',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
            text: '😍 🔥 🔥 Bookmarked for my upcoming technical interview prep!',
            time: '5w',
            likes: 3,
          },
          {
            id: `${reel.id}_c3`,
            username: 'tech_explorer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
            text: 'Clean and concise. Thank you for breaking down the concepts so well! 👏',
            time: '3w',
            likes: 2,
          },
        ]
        setModalComments(initialSeed)
      }
    } catch {
      setModalComments([])
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleAddComment = async e => {
    e.preventDefault()
    const trimmed = commentText.trim()
    if (!trimmed || isSubmitting) return

    setIsSubmitting(true)

    try {
      // Submits exact user-written text without AI rewriting
      const result = await submitComment({
        postId: selectedReelModal?.id || 'reel',
        text: trimmed,
        author: 'mubashir_hussen.sk',
        context: 'reel_comment',
      })

      if (!result.success) {
        // Display compact inline moderation error directly beneath comment box without popup modal
        setCommentError(result.message)
        return
      }

      // Approved comment: persist exact original text
      setCommentError(null)
      setShieldAlert(null)
      setCommentText('')
      const newComment = result.comment || {
        id: `c_${Date.now()}`,
        username: 'mubashir_hussen.sk',
        avatar: '/profile_avatar.jpg',
        text: trimmed,
        time: 'Just now',
        likes: 0,
      }
      setModalComments(prev => [...prev, newComment])
      if (selectedReelModal) {
        selectedReelModal.comments_count = (selectedReelModal.comments_count || 0) + 1
        trackReelInteraction({
          userId: currentUserId,
          reelId: selectedReelModal.id,
          eventType: 'comment',
          category: selectedReelModal.category,
          creatorName: selectedReelModal.user_name,
        })
      }
    } catch {
      setCommentError('Unable to post your comment right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    if (selectedReelModal && watchStartTimeRef.current) {
      const watchedSecs = (Date.now() - watchStartTimeRef.current) / 1000
      if (watchedSecs >= 1.0) {
        trackReelInteraction({
          userId: currentUserId,
          reelId: selectedReelModal.id,
          eventType: 'watch_duration',
          durationSeconds: watchedSecs,
          category: selectedReelModal.category,
          creatorName: selectedReelModal.user_name,
        })
      }
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.pause()
    }
    setSelectedReelModal(null)
    setShowOptionsMenu(false)
  }

  const handleToggleModalLike = () => {
    if (!selectedReelModal) return
    const nextState = !modalLiked
    setModalLiked(nextState)
    setModalLikesCount(prev => (nextState ? prev + 1 : Math.max(0, prev - 1)))
    trackReelInteraction({
      userId: currentUserId,
      reelId: selectedReelModal.id,
      eventType: nextState ? 'like' : 'unlike',
      category: selectedReelModal.category,
      creatorName: selectedReelModal.user_name,
    })
  }

  const handleToggleModalSave = () => {
    if (!selectedReelModal) return
    const nextState = !modalSaved
    setModalSaved(nextState)
    trackReelInteraction({
      userId: currentUserId,
      reelId: selectedReelModal.id,
      eventType: nextState ? 'save' : 'unsave',
      category: selectedReelModal.category,
      creatorName: selectedReelModal.user_name,
    })
  }

  const handleFeedbackAction = async action => {
    if (!selectedReelModal) return
    const targetReelId = selectedReelModal.id
    const targetCreator = selectedReelModal.user_name
    setShowOptionsMenu(false)

    if (action === 'not_interested') {
      await sendReelFeedback({
        userId: currentUserId,
        action: 'not_interested',
        reelId: targetReelId,
      })
      setAllReels(prev => prev.filter(r => r.id !== targetReelId))
      handleCloseModal()
      showToast("Reel hidden. We'll tune your recommendation feed.")
    } else if (action === 'hide_creator') {
      await sendReelFeedback({
        userId: currentUserId,
        action: 'hide_creator',
        creatorName: targetCreator,
      })
      setAllReels(prev => prev.filter(r => r.user_name !== targetCreator))
      handleCloseModal()
      showToast(`Hidden all reels from @${targetCreator}.`)
    } else if (action === 'reset_preferences') {
      await sendReelFeedback({
        userId: currentUserId,
        action: 'reset_preferences',
      })
      handleCloseModal()
      loadReels(true)
      showToast('Recommendation preferences reset to neutral.')
    }
  }

  const loadReels = async (refresh = false) => {
    try {
      const feedData = await fetchRecommendedFeed({
        userId: currentUserId,
        sessionId: refresh ? null : feedSessionId,
        page: 1,
        limit: 60,
        refresh,
        category: selectedCategory !== 'All' ? selectedCategory : null,
      })
      if (feedData && feedData.success && Array.isArray(feedData.reels) && feedData.reels.length > 0) {
        setFeedSessionId(feedData.session_id)
        const custom = getCustomFeedPosts().filter(p => p.is_video && p.video_url)
        const formattedCustom = custom.map(c => ({
          id: c.post_id,
          user_name: c.user_name,
          profile_pic: c.profile_pic,
          is_verified: false,
          topic: 'My Reel',
          category: 'Miscellaneous Trending Content',
          tag: '🎥 Video',
          video_url: c.video_url,
          caption: c.caption,
          audio_info: c.audio_info,
          views: '1',
          likes_count: c.likes_count || 0,
          comments_count: c.comments_count || 0,
          post_link: c.post_link,
        }))
        setAllReels([...formattedCustom, ...feedData.reels])
        return
      }
    } catch {
      // Local or network fallback to DIVERSE_REELS_LIST
    }

    const custom = getCustomFeedPosts().filter(p => p.is_video && p.video_url)
    const formattedCustom = custom.map(c => ({
      id: c.post_id,
      user_name: c.user_name,
      profile_pic: c.profile_pic,
      is_verified: false,
      topic: 'My Reel',
      category: 'Miscellaneous Trending Content',
      tag: '🎥 Video',
      video_url: c.video_url,
      caption: c.caption,
      audio_info: c.audio_info,
      views: '1',
      likes_count: c.likes_count || 0,
      comments_count: c.comments_count || 0,
      post_link: c.post_link,
    }))

    setAllReels([...formattedCustom, ...DIVERSE_REELS_LIST])
  }

  useEffect(() => {
    loadReels()
  }, [selectedCategory])

  useEffect(() => {
    window.addEventListener('new_post_created', () => loadReels(true))
    return () => window.removeEventListener('new_post_created', () => loadReels(true))
  }, [])

  const visibleReels = allReels.filter(reel => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (reel.category && reel.category.toLowerCase() === selectedCategory.toLowerCase()) ||
      (reel.topic && reel.topic.toLowerCase() === selectedCategory.toLowerCase())

    const matchesSearch =
      !searchInput.trim() ||
      `${reel.caption} ${reel.user_name} ${reel.category || ''} ${reel.topic || ''} ${reel.tag || ''}`
        .toLowerCase()
        .includes(searchInput.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="reels-page-layout">
      <Header searchInput={searchInput} setSearchInput={setSearchInput} />
      
      <main className="reels-container-main">
        {/* 5:5 Side-by-Side Reels Grid Structure */}
        <section className="side-by-side-reels-grid-5">
          {visibleReels.length > 0 ? (
            visibleReels.map(reel => (
              <ReelGridCard
                key={reel.id}
                reel={reel}
                onClickCard={handleOpenReel}
              />
            ))
          ) : (
            <p className="no-reels-found">No learning reels match your search.</p>
          )}
        </section>
      </main>

      {/* In-App Reel Viewer Modal with Native Playback & Authentic Comments */}
      {selectedReelModal && (
        <div
          className="reel-dark-modal-backdrop"
          onClick={handleCloseModal}
          role="presentation"
        >
          <button
            type="button"
            className="reel-dark-close-corner-btn"
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <BsX size={34} />
          </button>

          <div
            className="reel-dark-modal-card"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="reel-dark-modal-split">
              {/* Left Side: Native In-App Video Player Screen */}
              <div
                className="reel-dark-media-pane"
                ref={modalPaneRef}
                onClick={toggleModalPlay}
              >
                {/* Top-Left Instagram / Creator Badge */}
                <div className="reel-media-user-badge">
                  <BsInstagram className="ig-badge-logo" size={16} />
                  <span>@{selectedReelModal.user_name}</span>
                </div>

                {/* HTML5 In-App Video Player */}
                <video
                  ref={modalVideoRef}
                  src={selectedReelModal.video_url}
                  autoPlay
                  playsInline
                  loop
                  muted={modalMuted}
                  className="reel-dark-video-player"
                  onTimeUpdate={() => {
                    if (modalVideoRef.current) {
                      const cur = modalVideoRef.current.currentTime
                      const dur = modalVideoRef.current.duration || 0
                      setCurrentTime(cur)
                      setDuration(dur)
                      if (dur > 0 && cur / dur >= 0.90 && !completionTrackedRef.current && selectedReelModal) {
                        completionTrackedRef.current = true
                        trackReelInteraction({
                          userId: currentUserId,
                          reelId: selectedReelModal.id,
                          eventType: 'completion',
                          durationSeconds: cur,
                          percentageWatched: (cur / dur) * 100,
                          category: selectedReelModal.category,
                          creatorName: selectedReelModal.user_name,
                        })
                      }
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (modalVideoRef.current) {
                      setDuration(modalVideoRef.current.duration || 0)
                      setVideoError(false)
                    }
                  }}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => {
                    setIsBuffering(false)
                    setModalPlaying(true)
                    setVideoError(false)
                  }}
                  onPause={() => setModalPlaying(false)}
                  onError={() => {
                    setVideoError(true)
                    setIsBuffering(false)
                  }}
                />

                {/* Center Play Indicator Overlay */}
                {!modalPlaying && !isBuffering && !videoError && (
                  <div className="reel-dark-play-indicator" aria-label="Paused">
                    <BsPlayFill size={48} />
                  </div>
                )}

                {/* Buffering Spinner */}
                {isBuffering && (
                  <div className="reel-video-loader" aria-label="Loading video">
                    <div className="reel-spinner" />
                  </div>
                )}

                {/* In-App Video Fallback Overlay */}
                {videoError && (
                  <div className="reel-video-error-overlay" onClick={e => e.stopPropagation()}>
                    <BsExclamationTriangleFill size={34} color="#ff4d4f" />
                    <p className="reel-error-title">In-App Media Stream Fallback</p>
                    <p className="reel-error-desc">This video source is unavailable. Switch to verified local stream?</p>
                    <button
                      type="button"
                      className="reel-fallback-retry-btn"
                      onClick={() => {
                        setVideoError(false)
                        setSelectedReelModal(prev => ({
                          ...prev,
                          video_url: '/videos/sample_reel_1.mp4'
                        }))
                        if (modalVideoRef.current) {
                          modalVideoRef.current.src = '/videos/sample_reel_1.mp4'
                          modalVideoRef.current.load()
                          modalVideoRef.current.play().catch(() => {})
                        }
                      }}
                    >
                      <BsArrowClockwise size={16} />
                      <span>Play In-App Video</span>
                    </button>
                  </div>
                )}

                {/* Modern Integrated Video Controls Overlay */}
                <div className="reel-video-controls-overlay" onClick={e => e.stopPropagation()}>
                  {/* Timeline Scrubber */}
                  <div className="reel-scrub-bar-container">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="reel-timeline-scrubber"
                      aria-label="Seek timeline"
                    />
                    <div
                      className="reel-timeline-progress"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="reel-controls-action-bar">
                    {/* Left: Play/Pause and Time Indicator */}
                    <div className="reel-controls-left">
                      <button
                        type="button"
                        className="reel-control-btn"
                        onClick={toggleModalPlay}
                        aria-label={modalPlaying ? 'Pause' : 'Play'}
                      >
                        {modalPlaying ? <BsPauseFill size={20} /> : <BsPlayFill size={20} />}
                      </button>

                      <span className="reel-time-display">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    {/* Right: Volume & Fullscreen */}
                    <div className="reel-controls-right">
                      <div className="reel-volume-control-group">
                        <button
                          type="button"
                          className="reel-control-btn"
                          onClick={() => {
                            if (modalVideoRef.current) {
                              const nextMuted = !modalMuted
                              modalVideoRef.current.muted = nextMuted
                              setModalMuted(nextMuted)
                            }
                          }}
                          aria-label={modalMuted ? 'Unmute' : 'Mute'}
                        >
                          {modalMuted || volume === 0 ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={modalMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="reel-volume-slider"
                          aria-label="Volume"
                        />
                      </div>

                      <button
                        type="button"
                        className="reel-control-btn"
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                      >
                        {isFullscreen ? <BsFullscreenExit size={16} /> : <BsFullscreen size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Authentic Comments & Reel Details Pane */}
              <div className="reel-dark-details-pane">
                {/* 1. Creator Header Row */}
                <div className="reel-dark-header">
                  <div className="reel-dark-header-user">
                    <img
                      src={selectedReelModal.profile_pic || '/profile_avatar.jpg'}
                      alt={selectedReelModal.user_name}
                      className="reel-dark-header-avatar"
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = '/profile_avatar.jpg'
                      }}
                    />
                    <div className="reel-dark-header-meta">
                      <div className="reel-dark-username-row">
                        <span className="reel-dark-author-name">{selectedReelModal.user_name}</span>
                        {selectedReelModal.is_verified && (
                          <BsPatchCheckFill className="reel-verified-badge" size={13} />
                        )}
                        <span className="reel-dark-dot">•</span>
                        <button
                          type="button"
                          className={`reel-dark-follow-link ${modalFollowing ? 'following' : ''}`}
                          onClick={() => setModalFollowing(prev => !prev)}
                        >
                          {modalFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                      <span className="reel-dark-subtitle">
                        {selectedReelModal.tag || 'AI Content • Code'}
                      </span>
                    </div>
                  </div>

                  <div className="reel-dark-options-container">
                    <button
                      type="button"
                      className="reel-dark-options-btn"
                      onClick={() => setShowOptionsMenu(prev => !prev)}
                      title="More options"
                      aria-label="More options"
                    >
                      <BsThreeDots size={18} />
                    </button>

                    {showOptionsMenu && (
                      <div className="reel-recommendation-options-menu">
                        <button
                          type="button"
                          className="recs-option-item negative-action"
                          onClick={() => handleFeedbackAction('not_interested')}
                        >
                          <BsEyeSlash size={15} />
                          <span>Not Interested in this</span>
                        </button>
                        <button
                          type="button"
                          className="recs-option-item negative-action"
                          onClick={() => handleFeedbackAction('hide_creator')}
                        >
                          <BsPersonX size={15} />
                          <span>Don't recommend @{selectedReelModal.user_name}</span>
                        </button>
                        <button
                          type="button"
                          className="recs-option-item"
                          onClick={() => handleFeedbackAction('reset_preferences')}
                        >
                          <BsSliders size={15} />
                          <span>Reset Feed Recommendations</span>
                        </button>
                        <button
                          type="button"
                          className="recs-option-item"
                          onClick={() => {
                            setShowOptionsMenu(false)
                            navigator.clipboard?.writeText(selectedReelModal.post_link || window.location.href)
                            showToast('Reel link copied to clipboard! 📋')
                          }}
                        >
                          <BsSend size={15} />
                          <span>Copy Reel Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Scrollable Body: Caption & Authentic Comments */}
                <div className="reel-dark-comments-scroll">
                  {/* Post Caption Row */}
                  <div className="reel-dark-comment-item caption-item">
                    <img
                      src={selectedReelModal.profile_pic || '/profile_avatar.jpg'}
                      alt={selectedReelModal.user_name}
                      className="reel-dark-comment-avatar"
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = '/profile_avatar.jpg'
                      }}
                    />
                    <div className="reel-dark-comment-content">
                      <p className="reel-dark-comment-text">
                        <strong className="reel-dark-comment-user">{selectedReelModal.user_name}</strong>{' '}
                        {selectedReelModal.caption}
                      </p>
                      <div className="reel-dark-comment-meta">
                        <span>5w</span>
                        <button type="button" className="meta-action-btn">See translation</button>
                      </div>
                    </div>
                  </div>

                  {/* Comments Loading State */}
                  {commentsLoading && (
                    <div className="reel-comments-loading-state">
                      <div className="reel-spinner" />
                      <span>Loading comments...</span>
                    </div>
                  )}

                  {/* Empty State */}
                  {!commentsLoading && modalComments.length === 0 && (
                    <p className="no-comments-yet-msg">No comments yet. Start the conversation!</p>
                  )}

                  {/* Persisted Authentic User Comments List */}
                  {!commentsLoading && modalComments.map(comment => (
                    <div key={comment.id} className="reel-dark-comment-item">
                      <img
                        src={comment.avatar || '/profile_avatar.jpg'}
                        alt={comment.username}
                        className="reel-dark-comment-avatar"
                        onError={e => {
                          e.target.onerror = null
                          e.target.src = '/profile_avatar.jpg'
                        }}
                      />
                      <div className="reel-dark-comment-content">
                        <p className="reel-dark-comment-text">
                          <strong className="reel-dark-comment-user">{comment.username}</strong>{' '}
                          {comment.text}
                        </p>
                        <div className="reel-dark-comment-meta">
                          <span>{comment.time || 'Recently'}</span>
                          {comment.likes > 0 && <span>{comment.likes} like</span>}
                          <button
                            type="button"
                            className="meta-action-btn"
                            onClick={() => setCommentText(`@${comment.username} `)}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                      <button type="button" className="comment-like-heart" title="Like comment">
                        <BsHeart size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* 3. Bottom Action Bar */}
                <div className="reel-dark-bottom-section">
                  <div className="reel-dark-action-buttons">
                    <div className="action-buttons-left">
                      <button
                        type="button"
                        className={`reel-dark-icon-btn ${modalLiked ? 'liked' : ''}`}
                        onClick={handleToggleModalLike}
                        aria-label="Like"
                      >
                        {modalLiked ? <BsHeartFill color="#ff3040" size={22} /> : <BsHeart size={22} />}
                      </button>
                      <button type="button" className="reel-dark-icon-btn" aria-label="Comment">
                        <BsChat size={22} />
                      </button>
                      <button
                        type="button"
                        className="reel-dark-icon-btn"
                        onClick={() => {
                          navigator.clipboard?.writeText(selectedReelModal.post_link || window.location.href)
                          showToast('Reel link copied to clipboard! 📋')
                        }}
                        aria-label="Share"
                      >
                        <BsSend size={22} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="reel-dark-icon-btn"
                      onClick={handleToggleModalSave}
                      aria-label="Save"
                    >
                      {modalSaved ? <BsBookmarkFill color="#ffffff" size={22} /> : <BsBookmark size={22} />}
                    </button>
                  </div>

                  <div className="reel-dark-likes-row">
                    <strong>{modalLikesCount.toLocaleString()} likes</strong>
                  </div>
                  <span className="reel-dark-date-label">In-App Native Reel</span>

                  {/* 4. Authentic Comment Input Form */}
                  <div className="reel-dark-comment-form-wrap">
                    <form className="reel-dark-add-comment-form" onSubmit={handleAddComment}>
                      <button type="button" className="comment-emoji-btn" aria-label="Insert Emoji">
                        <BsEmojiSmile size={20} />
                      </button>
                      <input
                        type="text"
                        className="comment-text-input"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={e => {
                          setCommentText(e.target.value)
                          if (commentError) setCommentError(null)
                        }}
                        disabled={isSubmitting}
                        aria-label="Add a comment"
                      />
                      {commentText.trim() && (
                        <button
                          type="submit"
                          className="comment-post-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                      )}
                    </form>

                    {commentError && (
                      <div
                        className="inline-comment-moderation-error reel-inline-error"
                        role="alert"
                        aria-live="polite"
                      >
                        <BsExclamationTriangleFill
                          className="inline-error-icon"
                          size={13}
                          aria-hidden="true"
                        />
                        <span>{commentError}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {shieldAlert && (
        <SocialShieldAlert
          blockResult={shieldAlert}
          onClose={() => setShieldAlert(null)}
        />
      )}

      {/* Dynamic Recommendation & Moderation Toast Notification */}
      {toastMessage && (
        <div className="reels-toast-notification" role="status" aria-live="polite">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default Reels
