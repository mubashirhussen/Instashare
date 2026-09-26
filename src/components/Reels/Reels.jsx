import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsPlayFill,
  BsHeartFill,
  BsHeart,
  BsChatFill,
  BsEyeFill,
  BsPatchCheckFill,
  BsMusicNoteBeamed,
  BsX,
} from 'react-icons/bs'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import Header from '../Header'
import { getCustomFeedPosts } from '../../utils/storage'
import './Reels.css'

// 25 Curated 5:5 Grid Sample Learning Videos
const LEARNING_REELS_LIST = [
  {
    id: 'lr_1',
    user_name: 'react_mastery',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'React 19',
    tag: '⚛️ Frontend',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'React 19 Actions & useActionState hook in 45 seconds! Simplify async form handling ⚡ #React #WebDev #JavaScript',
    audio_info: 'react_mastery • Code Flow',
    views: '142K',
    likes_count: 5410,
    comments_count: 218,
  },
  {
    id: 'lr_2',
    user_name: 'pycode.dev',
    profile_pic: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    is_verified: true,
    topic: 'Python',
    tag: '🐍 Python',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'Top 5 Python One-Liners that make you look like a Senior Engineer 🚀 List comprehensions & Walrus operator!',
    audio_info: 'pycode.dev • Python Beats',
    views: '280K',
    likes_count: 8940,
    comments_count: 340,
  },
  {
    id: 'lr_3',
    user_name: 'codenloop',
    profile_pic: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150',
    is_verified: true,
    topic: 'Java DSA',
    tag: '☕ Java',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'Reverse String with Stack LIFO Logic 🔥 Day 17 DSA Challenge! Time O(N) | Space O(N) #Java #DSA #TeluguCoding',
    audio_info: 'codenloop • Trending Tech',
    views: '189K',
    likes_count: 4890,
    comments_count: 142,
  },
  {
    id: 'lr_4',
    user_name: 'nodejs_backend',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'Node.js',
    tag: '⚡ Backend',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    caption: 'How the Node.js Event Loop works under the hood 🌐 Microtasks, Timers, and I/O polling simplified!',
    audio_info: 'nodejs_backend • Backend Focus',
    views: '95.4K',
    likes_count: 3120,
    comments_count: 89,
  },
  {
    id: 'lr_5',
    user_name: 'system_design_101',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_verified: true,
    topic: 'System Design',
    tag: '🏗️ Architecture',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'Redis In-Memory Caching Strategies (Cache-Aside, Write-Through, Write-Back) for Ultra High Throughput ⚡💾',
    audio_info: 'system_design_101 • Lo-Fi Beats',
    views: '310K',
    likes_count: 9800,
    comments_count: 420,
  },
  {
    id: 'lr_6',
    user_name: 'css_wizard',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'CSS Grid',
    tag: '🎨 UI/UX',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'One-line responsive layout superpower: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))! ✨',
    audio_info: 'css_wizard • UI Magic',
    views: '220K',
    likes_count: 6740,
    comments_count: 198,
  },
  {
    id: 'lr_7',
    user_name: 'typescript_pro',
    profile_pic: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    is_verified: true,
    topic: 'TypeScript',
    tag: '📘 TypeScript',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'Master TypeScript Generics in 60s! Create reusable, strictly type-safe API wrappers effortlessly 🛡️',
    audio_info: 'typescript_pro • Type Flow',
    views: '165K',
    likes_count: 4520,
    comments_count: 112,
  },
  {
    id: 'lr_8',
    user_name: 'database_hub',
    profile_pic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    is_verified: true,
    topic: 'SQL vs NoSQL',
    tag: '🗄️ Database',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'When to choose PostgreSQL vs MongoDB? ACID transactions vs flexible JSON schemas explained clearly! 📊🍃',
    audio_info: 'database_hub • Data Beats',
    views: '198K',
    likes_count: 5120,
    comments_count: 164,
  },
  {
    id: 'lr_9',
    user_name: 'docker_devops',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'Docker',
    tag: '🐳 DevOps',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'Multi-stage Docker builds: Shrink your Node/React production image from 1.2GB to under 50MB 🚀📦',
    audio_info: 'docker_devops • Cloud Audio',
    views: '135K',
    likes_count: 3890,
    comments_count: 95,
  },
  {
    id: 'lr_10',
    user_name: 'dsa_visualizer',
    profile_pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_verified: true,
    topic: 'Binary Search',
    tag: '📚 Algorithms',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    caption: 'Binary Search step-by-step pointer visualization! Halving search space for O(log N) speed ⚡ #LeetCode',
    audio_info: 'dsa_visualizer • Logic Sound',
    views: '240K',
    likes_count: 7280,
    comments_count: 230,
  },
  {
    id: 'lr_11',
    user_name: 'express_apis',
    profile_pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    is_verified: true,
    topic: 'Express.js',
    tag: '⚡ Backend',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'JWT Authentication middleware in Express.js: Protect protected routes with verifyToken in 5 lines 🔐🛡️',
    audio_info: 'express_apis • Security Beat',
    views: '175K',
    likes_count: 4980,
    comments_count: 145,
  },
  {
    id: 'lr_12',
    user_name: 'nextjs_daily',
    profile_pic: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150',
    is_verified: true,
    topic: 'Next.js 15',
    tag: '⚛️ Frontend',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'Next.js 15 Server Actions vs API Routes: When should you use which? Real-time mutations made easy! 🚀',
    audio_info: 'nextjs_daily • Next Vibe',
    views: '190K',
    likes_count: 6120,
    comments_count: 180,
  },
  {
    id: 'lr_13',
    user_name: 'ai_engineers',
    profile_pic: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150',
    is_verified: true,
    topic: 'AI Agents',
    tag: '🤖 AI/ML',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'Building Autonomous AI coding agents with function calling and tool execution loops 🤖💡 #AI #Python',
    audio_info: 'ai_engineers • Future AI',
    views: '410K',
    likes_count: 12400,
    comments_count: 530,
  },
  {
    id: 'lr_14',
    user_name: 'graphql_guide',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_verified: true,
    topic: 'GraphQL',
    tag: '🌐 API Design',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'GraphQL vs REST: Eliminate over-fetching and under-fetching with single declarative query schemas 📡✨',
    audio_info: 'graphql_guide • GraphQL Pulse',
    views: '112K',
    likes_count: 3410,
    comments_count: 88,
  },
  {
    id: 'lr_15',
    user_name: 'git_hacks',
    profile_pic: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150',
    is_verified: true,
    topic: 'Git Workflow',
    tag: '🔧 DevOps',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'Git Interactive Rebase (git rebase -i HEAD~N): Squash messy commits into clean history like a pro! 🧹💻',
    audio_info: 'git_hacks • Clean Code',
    views: '158K',
    likes_count: 4720,
    comments_count: 130,
  },
  {
    id: 'lr_16',
    user_name: 'golang_channel',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'Golang',
    tag: '🐹 Go',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    caption: 'Go Goroutines & Channels: Lightweight concurrent programming with zero thread overhead ⚡🐹',
    audio_info: 'golang_channel • Go Rhythms',
    views: '145K',
    likes_count: 4180,
    comments_count: 104,
  },
  {
    id: 'lr_17',
    user_name: 'clean_coder',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'SOLID Principles',
    tag: '📐 Architecture',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'Single Responsibility & Dependency Inversion in React and Node: Write testable, decouple code 💡✨',
    audio_info: 'clean_coder • Ambient Focus',
    views: '178K',
    likes_count: 5310,
    comments_count: 156,
  },
  {
    id: 'lr_18',
    user_name: 'tailwind_ninja',
    profile_pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_verified: true,
    topic: 'Tailwind CSS',
    tag: '🎨 UI/UX',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'Custom Tailwind plugins, CSS variables, and dark mode transitions in under 60 seconds 🎨⚡',
    audio_info: 'tailwind_ninja • Synthwave',
    views: '205K',
    likes_count: 6420,
    comments_count: 190,
  },
  {
    id: 'lr_19',
    user_name: 'redis_caching',
    profile_pic: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150',
    is_verified: true,
    topic: 'Redis',
    tag: '🗄️ Database',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'Redis Pub/Sub & Sorted Sets for real-time leaderboards and instant live chat broadcasting 🚀📡',
    audio_info: 'redis_caching • Speed Beats',
    views: '160K',
    likes_count: 4890,
    comments_count: 124,
  },
  {
    id: 'lr_20',
    user_name: 'fastapi_python',
    profile_pic: 'https://images.unsplash.com/photo-1516116211227-bbc141a0670d?w=150',
    is_verified: true,
    topic: 'FastAPI',
    tag: '🐍 Python',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'Why FastAPI is the highest performance Python backend framework: Async Pydantic validation & Auto Docs ⚡',
    audio_info: 'fastapi_python • Python Tech',
    views: '230K',
    likes_count: 7120,
    comments_count: 210,
  },
  {
    id: 'lr_21',
    user_name: 'mongodb_masters',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'MongoDB',
    tag: '🗄️ Database',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'MongoDB Aggregation Pipeline ($match, $group, $lookup, $project) explained visually in 1 minute 🍃📊',
    audio_info: 'mongodb_masters • DB Sound',
    views: '185K',
    likes_count: 5640,
    comments_count: 168,
  },
  {
    id: 'lr_22',
    user_name: 'websocket_realtime',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_verified: true,
    topic: 'WebSockets',
    tag: '⚡ Backend',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    caption: 'Bidirectional full-duplex communication with Socket.io & ws: Build instant real-time apps 💬🔔',
    audio_info: 'websocket_realtime • Realtime Pulse',
    views: '195K',
    likes_count: 5900,
    comments_count: 175,
  },
  {
    id: 'lr_23',
    user_name: 'dsa_trees',
    profile_pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    is_verified: true,
    topic: 'Binary Trees',
    tag: '📚 Algorithms',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'Inorder, Preorder, and Postorder DFS Tree Traversals animated simply! Ace your FAANG interviews 🌳💻',
    audio_info: 'dsa_trees • Code Rhythms',
    views: '260K',
    likes_count: 8100,
    comments_count: 270,
  },
  {
    id: 'lr_24',
    user_name: 'web_security',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'Cybersecurity',
    tag: '🛡️ Security',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'Preventing XSS, CSRF, and SQL Injection attacks in modern full stack web applications 🛡️🔒',
    audio_info: 'web_security • Cyber Beat',
    views: '215K',
    likes_count: 6890,
    comments_count: 212,
  },
  {
    id: 'lr_25',
    user_name: 'fullstack_roadmap',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: '2026 Roadmap',
    tag: '🚀 Career',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'The Ultimate 2026 Full Stack Developer Roadmap: React, Node, Cloud, AI & System Architecture 🗺️✨',
    audio_info: 'fullstack_roadmap • Inspiration',
    views: '490K',
    likes_count: 15200,
    comments_count: 680,
  },
]

const ReelGridCard = ({ reel, onClickCard }) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(reel.likes_count || 0)
  const videoRef = useRef(null)

  const handleTogglePlay = e => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleLike = e => {
    e.stopPropagation()
    if (isLiked) {
      setIsLiked(false)
      setLikesCount(prev => Math.max(0, prev - 1))
    } else {
      setIsLiked(true)
      setLikesCount(prev => prev + 1)
    }
  }

  return (
    <div className="side-by-side-reel-card" onClick={() => onClickCard(reel)}>
      <div className="reel-media-wrapper">
        <video
          ref={videoRef}
          src={reel.video_url}
          className="reel-grid-video"
          playsInline
          loop
          autoPlay
          muted={isMuted}
        />

        {/* Audio Toggle */}
        <button
          type="button"
          className="reel-sound-btn"
          onClick={e => {
            e.stopPropagation()
            setIsMuted(prev => !prev)
          }}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </button>

        {/* Play/Pause overlay */}
        <div className="reel-play-overlay" onClick={handleTogglePlay}>
          {!isPlaying && (
            <div className="reel-pause-indicator">
              <BsPlayFill size={36} />
            </div>
          )}
        </div>

        {/* Top Info Bar with Learning Tag */}
        <div className="reel-top-bar">
          <span className="reel-topic-pill">{reel.tag || '💻 Code'}</span>
          <div className="reel-views-pill">
            <BsEyeFill size={11} />
            <span>{reel.views || '50K'}</span>
          </div>
        </div>

        {/* Bottom Details Bar */}
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

            <button type="button" className="reel-action-btn">
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
  const [searchInput, setSearchInput] = useState('')
  const [selectedReelModal, setSelectedReelModal] = useState(null)
  const [allReels, setAllReels] = useState(LEARNING_REELS_LIST)

  const loadReels = () => {
    const custom = getCustomFeedPosts().filter(p => p.is_video && p.video_url)
    const formattedCustom = custom.map(c => ({
      id: c.post_id,
      user_name: c.user_name,
      profile_pic: c.profile_pic,
      is_verified: true,
      topic: 'My Reel',
      tag: '🎥 Video',
      video_url: c.video_url,
      caption: c.caption,
      audio_info: c.audio_info,
      views: '1',
      likes_count: c.likes_count || 0,
      comments_count: c.comments_count || 0,
    }))

    setAllReels([...formattedCustom, ...LEARNING_REELS_LIST])
  }

  useEffect(() => {
    loadReels()
    window.addEventListener('new_post_created', loadReels)
    return () => window.removeEventListener('new_post_created', loadReels)
  }, [])

  const visibleReels = searchInput.trim()
    ? allReels.filter(reel =>
        `${reel.caption} ${reel.user_name} ${reel.topic || ''} ${reel.tag || ''}`
          .toLowerCase()
          .includes(searchInput.toLowerCase()),
      )
    : allReels

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
                onClickCard={r => setSelectedReelModal(r)}
              />
            ))
          ) : (
            <p className="no-reels-found">No learning reels match your search.</p>
          )}
        </section>
      </main>

      {/* Fullscreen Reel Viewer Modal */}
      {selectedReelModal && (
        <div
          className="reel-modal-backdrop"
          onClick={() => setSelectedReelModal(null)}
        >
          <div
            className="reel-modal-card"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              className="reel-modal-close-btn"
              onClick={() => setSelectedReelModal(null)}
            >
              <BsX size={30} />
            </button>

            <div className="reel-modal-split-layout">
              <div className="reel-modal-video-pane">
                <video
                  src={selectedReelModal.video_url}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="modal-playing-video"
                />
              </div>

              <div className="reel-modal-info-pane">
                <div className="modal-creator-header">
                  <img
                    src={selectedReelModal.profile_pic || '/profile_avatar.jpg'}
                    alt={selectedReelModal.user_name}
                    className="modal-creator-avatar"
                    onError={e => {
                      e.target.onerror = null
                      e.target.src = '/profile_avatar.jpg'
                    }}
                  />
                  <div>
                    <div className="modal-creator-name-row">
                      <strong>{selectedReelModal.user_name}</strong>
                      {selectedReelModal.is_verified && (
                        <BsPatchCheckFill className="reel-verified-badge" />
                      )}
                    </div>
                    <span className="modal-audio-info">
                      🎵 {selectedReelModal.audio_info || 'Original Sound'}
                    </span>
                  </div>
                </div>

                <div className="modal-caption-area">
                  <span className="modal-topic-chip">{selectedReelModal.tag || '💻 Code'}</span>
                  <p>{selectedReelModal.caption}</p>
                </div>

                <div className="modal-reel-stats-bar">
                  <span>❤️ {selectedReelModal.likes_count?.toLocaleString()} likes</span>
                  <span>💬 {selectedReelModal.comments_count?.toLocaleString()} comments</span>
                  <span>👁️ {selectedReelModal.views} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reels