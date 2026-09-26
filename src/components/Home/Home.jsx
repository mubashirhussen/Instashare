import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsHeart,
  BsHeartFill,
  BsChat,
  BsBookmark,
  BsBookmarkFill,
  BsThreeDots,
  BsPatchCheckFill,
  BsArrowRepeat,
  BsPlayFill,
  BsPauseFill,
} from 'react-icons/bs'
import { FiSend, FiVolume2, FiVolumeX } from 'react-icons/fi'
import { ThreeDots } from 'react-loader-spinner'
import Header from '../Header'
import UserStories from '../UserStories'
import FailureView from '../FailureView'
import { getCustomFeedPosts, getUserProfile } from '../../utils/storage'
import './Home.css'

const STORIES_API = 'https://apis.ccbp.in/insta-share/stories'

// User curated Instagram Posts with real playable sample videos and images
export const ALL_FEED_POSTS = [
  // 1. pycode.dev (Image Post)
  {
    post_id: 'ig_post_ddzcja',
    user_id: 'user_pycode',
    user_name: 'pycode.dev',
    profile_pic: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '1d',
    audio_info: 'pycode.dev • Original Audio',
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'Master Python from basics to advanced in one simple cheat sheet. 🚀 This carousel covers the core concepts every beginner should know: print output, variables, data types, lists, tuples, dictionaries, sets, if statements, loops, functions, and lambda functions. Save this post for quick revision and follow @pycode.dev for more Python tips. 🐍✨ #Python #LearnPython #PythonProgramming #Coding #Programmer',
    likes_count: 1428,
    comments_count: 48,
    post_link: 'https://www.instagram.com/p/DdZcjaCAD6L/',
    comments: [
      { user_name: 'dev_community', comment: 'Bookmarked! Extremely useful cheat sheet 🔥' },
      { user_name: 'coder_sam', comment: 'Clean explanation of loops and data structures!' },
    ],
  },
  // 2. codenloop (Playable Sample Video Reel)
  {
    post_id: 'ig_reel_ddyz7f',
    user_id: 'user_codenloop',
    user_name: 'codenloop',
    profile_pic: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '2d',
    audio_info: 'codenloop • Trending Audio',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    media_type: 'video',
    caption: 'Reverse String with LIFO Logic 🔥 | Day 17. HELLO ni reverse chesthe OLLEH. Daaniki simple ga STACK LIFO logic use chestham! Push to Stack: H → E → L → L → O. Pop from Stack: O → L → L → E → H 💥. Time Complexity: O(n) | Space Complexity: O(n) ⚡. Follow @codenloop for more DSA & Java tips! #DSA #DataStructures #Algorithms #Java #CodingInTelugu',
    likes_count: 2840,
    comments_count: 126,
    post_link: 'https://www.instagram.com/reel/DdYz7fEIsx5/',
    comments: [
      { user_name: 'algo_expert', comment: 'LIFO concept clearly explained 👏' },
      { user_name: 'tech_learner', comment: 'Stack data structure made simple!' },
    ],
  },
  // 3. nextgendataaiacademy (Image Post)
  {
    post_id: 'post_nextgen',
    user_id: 'user_nextgen',
    user_name: 'nextgendataaiacademy',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '42m',
    audio_info: 'Lightbox Music • Sazon',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'Junior writes 10 lines.... Senior describes in 1 line. Explore how python functions transform messy data workflows effortlessly.',
    likes_count: 11,
    comments_count: 1,
    post_link: 'https://www.instagram.com/p/nextgen_ai/',
    comments: [
      { user_name: 'python_dev', comment: 'Super clean explanation! 🔥' },
    ],
  },
  // 4. flm_pronetwork (Image Post)
  {
    post_id: 'post_ddf1rddgd9o',
    user_id: 'user_flm_pronetwork',
    user_name: 'flm_pronetwork',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '3h',
    audio_info: 'flm_pronetwork • Original Audio',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'Building scalable modern web architectures: The journey from monolith to decoupled cloud microservices 🚀✨ #FullStack #TechCareer #WebDevelopment #Programming',
    likes_count: 147,
    comments_count: 18,
    post_link: 'https://www.instagram.com/p/Ddf1rDdGD9O/',
    comments: [
      { user_name: 'dev_guru', comment: 'Great roadmap for junior engineers!' },
      { user_name: 'cloud_architect', comment: 'Decoupled services are indeed the way forward 💡' },
    ],
  },
  // 5. creative_shots (Image Post)
  {
    post_id: 'post_ccdoqxhgb70',
    user_id: 'user_creative_shots',
    user_name: 'creative_shots',
    profile_pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '5h',
    audio_info: 'Acoustic Sunset • Peaceful Vibes',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'Chasing sunsets across the dramatic valley ridge. There is nothing like golden light filtering through mountain peaks 🌄🍂 #Cinematic #NatureLovers #GoldenHour #Landscape',
    likes_count: 3290,
    comments_count: 84,
    post_link: 'https://www.instagram.com/p/CCdoqxHgb70/',
    comments: [
      { user_name: 'wanderlust_travels', comment: 'Breathtaking frame! Which lens did you use?' },
      { user_name: 'photo_art', comment: 'Stunning tonal balance 🎨' },
    ],
  },
  // 6. reel_vibes (Playable Sample Video Reel)
  {
    post_id: 'reel_dv8jxpxkp8e',
    user_id: 'user_reel_vibes',
    user_name: 'reel_vibes',
    profile_pic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '6h',
    audio_info: 'Trending Beat • Cyberpunk Nights',
    image_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    media_type: 'video',
    caption: 'Neon city aesthetic reel: Tokyo midnight exploration with seamless camera speed ramps 🌃⚡ Follow for daily visual inspiration! #Reels #TokyoNights #Cinematography #Motion',
    likes_count: 5410,
    comments_count: 215,
    post_link: 'https://www.instagram.com/reel/DV8jxPxkp8E/',
    comments: [
      { user_name: 'cyber_editor', comment: 'The speed ramps are butter smooth 🔥' },
      { user_name: 'vibe_check', comment: 'Color grading is unmatched!' },
    ],
  },
  // 7. motion_designs (Playable Sample Video Reel)
  {
    post_id: 'reel_dtuyjraj34q',
    user_id: 'user_motion_designs',
    user_name: 'motion_designs',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '8h',
    audio_info: 'Synthwave Dreams • Future Sound',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    media_type: 'video',
    caption: '3D Abstract Fluid Physics loop generated in Blender & Houdini. Seamless looping relaxation 🔮🌀 #3DAnimation #MotionDesign #Blender3D #AbstractArt',
    likes_count: 4120,
    comments_count: 92,
    post_link: 'https://www.instagram.com/reel/DTUYjrAj34q/',
    comments: [
      { user_name: 'blender_daily', comment: 'Mesmerizing fluid simulation!' },
    ],
  },
  // 8. nature_explores (Playable Sample Video Reel)
  {
    post_id: 'reel_cloirtrxfj',
    user_id: 'user_nature_explores',
    user_name: 'nature_explores',
    profile_pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '10h',
    audio_info: 'Ethereal Forest • Ambient Calm',
    image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    media_type: 'video',
    caption: 'Deep within the misty pine forests of Switzerland 🌲🌫️ Breathe in the silence and tranquility. #Wilderness #ForestLovers #ExploreMore #NaturePhotography',
    likes_count: 6780,
    comments_count: 140,
    post_link: 'https://www.instagram.com/reel/CloirTmrxfJ/',
    comments: [
      { user_name: 'peaceful_mind', comment: 'Pure bliss and serenity 🌿' },
    ],
  },
  // 9. webdev_pro (Image Post)
  {
    post_id: 'post_dwwu6pmjw7e',
    user_id: 'user_webdev_pro',
    user_name: 'webdev_pro',
    profile_pic: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '12h',
    audio_info: 'webdev_pro • Coding Focus',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'Top 5 UI/UX design rules every frontend developer must know: 1. Visual hierarchy 2. Consistent padding tokens 3. Micro-animations 4. Accessible contrast 5. Performance first! ⚡📐 #UIUX #ReactJS #WebDev #CSS',
    likes_count: 2150,
    comments_count: 67,
    post_link: 'https://www.instagram.com/p/DWWU6PMjw7e/',
    comments: [
      { user_name: 'frontend_wizard', comment: 'Consistency in spacing tokens is key 🔑' },
    ],
  },
  // 10. tech_daily (Playable Sample Video Reel)
  {
    post_id: 'reel_c_wvh4oqtap',
    user_id: 'user_tech_daily',
    user_name: 'tech_daily',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '14h',
    audio_info: 'Tech Beats • Innovation',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    media_type: 'video',
    caption: 'The evolution of AI Agents in 2026: From simple chatbots to autonomous reasoning engines capable of end-to-end coding and system orchestration 🤖💡 #AI #ArtificialIntelligence #TechTrends #Engineering',
    likes_count: 8920,
    comments_count: 310,
    post_link: 'https://www.instagram.com/reel/C-wvh4OqtAp/',
    comments: [
      { user_name: 'ai_researcher', comment: 'The autonomous orchestration era has arrived!' },
    ],
  },
  // 11. portrait_perfection (Image Post)
  {
    post_id: 'post_croqcyjsjzt',
    user_id: 'user_portrait_perfection',
    user_name: 'portrait_perfection',
    profile_pic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '16h',
    audio_info: 'Urban Rhythms • Midnight Vibe',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'Studio portraits with high-contrast split lighting setup 📸 Natural expressions, zero filters. #PortraitPhotography #VisualArt #ModelLife #StudioShoot',
    likes_count: 1890,
    comments_count: 45,
    post_link: 'https://www.instagram.com/p/CROqCySJHzt/',
    comments: [
      { user_name: 'studio_master', comment: 'Incredible lighting control!' },
    ],
  },
  // 12. developer_insights (Image Post)
  {
    post_id: 'post_dudmwhjjzmq',
    user_id: 'user_developer_insights',
    user_name: 'developer_insights',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '18h',
    audio_info: 'Lo-Fi Chill • Midnight Coding',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'System Design 101: Understanding Caching strategies, Redis in-memory stores, and TTL eviction policies for ultra high throughput ⚡💾 #SystemDesign #Backend #Redis #SoftwareEngineering',
    likes_count: 3410,
    comments_count: 88,
    post_link: 'https://www.instagram.com/p/DUDmWhJjzMQ/',
    comments: [
      { user_name: 'backend_ninja', comment: 'Redis cluster breakdown when? Great post!' },
    ],
  },
  // 13. coding_bytes (Playable Sample Video Reel)
  {
    post_id: 'reel_c_mireksuxy',
    user_id: 'user_coding_bytes',
    user_name: 'coding_bytes',
    profile_pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '1d',
    audio_info: 'Electro Groove • Speed Code',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    media_type: 'video',
    caption: 'Binary Search Algorithm visualized in 30 seconds! ⚡ O(log n) efficiency by halving search space repeatedly. #DSA #Algorithms #ComputerScience #LeetCode',
    likes_count: 4890,
    comments_count: 134,
    post_link: 'https://www.instagram.com/reel/C_mirekSUXy/',
    comments: [
      { user_name: 'coder_pro', comment: 'The step-by-step pointers animation made it crystal clear!' },
    ],
  },
  // 14. architecture_spaces (Image Post)
  {
    post_id: 'post_ddyztdfhdy4',
    user_id: 'user_architecture_spaces',
    user_name: 'architecture_spaces',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop',
    is_verified: true,
    time_ago: '1d',
    audio_info: 'Minimalist Soundscapes • Peaceful',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop',
    media_type: 'image',
    caption: 'Modern Japandi interior aesthetics: Warm wood finishes, clean geometric lines, and natural daylight harmony 🏡✨ #InteriorDesign #Architecture #Japandi #ModernHome',
    likes_count: 2780,
    comments_count: 59,
    post_link: 'https://www.instagram.com/p/DdYzTDfhDy4/',
    comments: [
      { user_name: 'home_inspire', comment: 'Such a peaceful living room setup!' },
    ],
  },
]

export const PostCard = ({ post, onClickUser }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [isSaved, setIsSaved] = useState(false)
  const [isReposted, setIsReposted] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentsList, setCommentsList] = useState(post.comments || [])

  const videoRef = useRef(null)

  const isVideoPost = Boolean(post.video_url || post.media_type === 'video' || post.is_video)
  const videoSource = post.video_url || (post.media_type === 'video' ? post.image_url : null)

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikesCount(prev => Math.max(0, prev - 1))
    } else {
      setIsLiked(true)
      setLikesCount(prev => prev + 1)
    }
  }

  const handleSaveToggle = () => {
    setIsSaved(prev => !prev)
  }

  const handleRepostToggle = () => {
    setIsReposted(prev => !prev)
  }

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleAddComment = e => {
    e.preventDefault()
    if (!commentText.trim()) return

    const currentUser = getUserProfile()
    const newCommentObj = {
      user_name: currentUser.username || 'mubashir_hussen.sk',
      comment: commentText.trim(),
    }
    setCommentsList(prev => [...prev, newCommentObj])
    setCommentText('')
  }

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Post by ${post.user_name}`,
          text: post.caption,
          url: post.post_link || window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard?.writeText(post.post_link || window.location.href)
      alert('Post link copied to clipboard! 📋')
    }
  }

  return (
    <article className="feed-post-card" id={post.post_id}>
      {/* Post Header */}
      <div className="feed-post-header">
        <div
          className="post-user-info-wrap"
          onClick={() => onClickUser && onClickUser(post.user_id || post.user_name)}
        >
          <div className="post-header-avatar-ring">
            <img
              src={post.profile_pic}
              alt={post.user_name}
              className="post-header-avatar"
            />
          </div>
          <div className="post-header-text">
            <div className="post-username-row">
              <span className="post-username">{post.user_name}</span>
              {post.is_verified !== false && (
                <BsPatchCheckFill className="verified-badge-icon" />
              )}
              <span className="post-dot-sep">•</span>
              <span className="post-time-ago">{post.time_ago}</span>
            </div>
            {post.audio_info && (
              <p className="post-audio-subtitle">🎵 {post.audio_info}</p>
            )}
          </div>
        </div>

        <button type="button" className="post-options-btn" aria-label="More options">
          <BsThreeDots size={18} />
        </button>
      </div>

      {/* Post Media Image / Playable Video Reel */}
      <div className="feed-post-media-wrap">
        {isVideoPost && videoSource ? (
          <div className="video-container" onClick={toggleVideoPlayback}>
            <video
              ref={videoRef}
              src={videoSource}
              className="feed-post-image feed-post-video"
              playsInline
              loop
              autoPlay
              muted={isMuted}
              onDoubleClick={handleLikeToggle}
            />
            {!isPlaying && (
              <div className="video-play-indicator">
                <BsPlayFill size={40} />
              </div>
            )}
          </div>
        ) : (
          <img
            src={post.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop'}
            alt={post.caption || 'post'}
            className="feed-post-image"
            onError={e => {
              e.target.onerror = null
              e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop'
            }}
            onDoubleClick={handleLikeToggle}
          />
        )}

        {isVideoPost && (
          <button
            type="button"
            className="post-media-audio-btn"
            onClick={e => {
              e.stopPropagation()
              setIsMuted(prev => !prev)
            }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
          </button>
        )}
      </div>

      {/* Post Action Buttons */}
      <div className="feed-post-actions-bar">
        <div className="actions-left-group">
          {/* Like Button */}
          <button
            type="button"
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
            aria-label="Like post"
          >
            {isLiked ? (
              <BsHeartFill size={22} className="heart-filled-icon" />
            ) : (
              <BsHeart size={22} />
            )}
            <span className="action-count">{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            type="button"
            className="action-btn comment-btn"
            onClick={() => setShowCommentInput(prev => !prev)}
            aria-label="Comment on post"
          >
            <BsChat size={21} />
            <span className="action-count">{commentsList.length}</span>
          </button>

          {/* Repost Button */}
          <button
            type="button"
            className={`action-btn repost-btn ${isReposted ? 'reposted' : ''}`}
            onClick={handleRepostToggle}
            aria-label="Repost"
          >
            <BsArrowRepeat size={24} />
          </button>

          {/* Share Button */}
          <button
            type="button"
            className="action-btn share-btn"
            onClick={handleShareClick}
            aria-label="Share post"
          >
            <FiSend size={21} />
          </button>
        </div>

        {/* Save Button */}
        <div className="actions-right-group">
          <button
            type="button"
            className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSaveToggle}
            aria-label="Save post"
          >
            {isSaved ? <BsBookmarkFill size={21} /> : <BsBookmark size={21} />}
          </button>
        </div>
      </div>

      {/* Post Details & Caption */}
      <div className="feed-post-details">
        <div className="post-caption-box">
          <span className="caption-username">{post.user_name}</span>
          {post.is_verified !== false && (
            <BsPatchCheckFill className="caption-verified-badge" />
          )}{' '}
          <span className="caption-text">
            {isExpanded || post.caption.length <= 80
              ? post.caption
              : `${post.caption.slice(0, 75)}... `}
          </span>
          {post.caption.length > 75 && (
            <button
              type="button"
              className="caption-more-toggle"
              onClick={() => setIsExpanded(prev => !prev)}
            >
              {isExpanded ? 'less' : 'more'}
            </button>
          )}
        </div>

        <button type="button" className="see-translation-btn">
          See translation
        </button>

        {/* Comments Section */}
        {commentsList.length > 0 && (
          <div className="post-comments-preview">
            {commentsList.map((item, idx) => (
              <p key={idx} className="comment-line">
                <strong>{item.user_name}</strong> {item.comment}
              </p>
            ))}
          </div>
        )}

        {/* Comment Input */}
        {showCommentInput && (
          <form className="add-comment-form" onSubmit={handleAddComment}>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="add-comment-input"
            />
            {commentText.trim() && (
              <button type="submit" className="post-comment-btn">
                Post
              </button>
            )}
          </form>
        )}
      </div>
    </article>
  )
}

const Home = () => {
  const navigate = useNavigate()

  const [stories, setStories] = useState([])
  const [posts, setPosts] = useState(() => {
    const custom = getCustomFeedPosts()
    return [...custom, ...ALL_FEED_POSTS]
  })
  const [searchInput, setSearchInput] = useState('')
  const [storiesLoading, setStoriesLoading] = useState(true)
  const [postsLoading, setPostsLoading] = useState(false)
  const [storiesError, setStoriesError] = useState(false)
  const [activeStory, setActiveStory] = useState(null)

  const reloadFeed = () => {
    const custom = getCustomFeedPosts()
    setPosts([...custom, ...ALL_FEED_POSTS])
  }

  const getStories = async () => {
    setStoriesLoading(true)
    setStoriesError(false)

    try {
      const jwtToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('jwt_token='))
        ?.split('=')[1]

      const response = await fetch(STORIES_API, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStories(data.users_stories?.length > 0 ? data.users_stories : [])
      } else {
        setStories([])
      }
    } catch {
      setStories([])
    } finally {
      setStoriesLoading(false)
    }
  }

  useEffect(() => {
    getStories()
    reloadFeed()

    const handleNewPost = () => {
      reloadFeed()
    }

    const handleRefreshFeed = () => {
      reloadFeed()
      getStories()
    }

    window.addEventListener('new_post_created', handleNewPost)
    window.addEventListener('refresh_feed', handleRefreshFeed)
    return () => {
      window.removeEventListener('new_post_created', handleNewPost)
      window.removeEventListener('refresh_feed', handleRefreshFeed)
    }
  }, [])

  const onClickUser = userId => {
    navigate(`/users/${userId}`)
  }

  const visiblePosts = searchInput.trim()
    ? posts.filter(post =>
        `${post.caption} ${post.user_name}`
          .toLowerCase()
          .includes(searchInput.toLowerCase()),
      )
    : posts

  return (
    <div className="home-root-container">
      <Header
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <main className="instagram-feed-main">
        <div className="feed-center-column">
          {/* Stories Bar */}
          <section className="feed-stories-container">
            {storiesLoading ? (
              <div className="stories-loader-wrap">
                <ThreeDots color="#0095f6" height={30} width={30} />
              </div>
            ) : (
              <UserStories stories={stories} onClickStory={setActiveStory} />
            )}
          </section>

          {/* Posts Feed */}
          <section className="feed-posts-list-section">
            {postsLoading ? (
              <div className="posts-loader-wrap">
                <ThreeDots color="#0095f6" height={45} width={45} />
              </div>
            ) : visiblePosts.length === 0 ? (
              <div className="no-posts-found">
                <p>No posts match your search caption.</p>
              </div>
            ) : (
              visiblePosts.map(post => (
                <PostCard
                  key={post.post_id}
                  post={post}
                  onClickUser={onClickUser}
                />
              ))
            )}
          </section>
        </div>
      </main>

      {activeStory && (
        <div className="home-story-backdrop" role="presentation" onClick={() => setActiveStory(null)}>
          <div className="home-story-viewer" role="dialog" aria-modal="true" aria-label={`${activeStory.user_name} story`} onClick={event => event.stopPropagation()}>
            <button type="button" className="home-story-close" onClick={() => setActiveStory(null)} aria-label="Close story">×</button>
            <img src={activeStory.story_url} alt={`${activeStory.user_name} story`} />
            <strong>{activeStory.user_name}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
