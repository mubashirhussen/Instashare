import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BsPlayFill,
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
} from 'react-icons/bs'
import { FiVolume2, FiVolumeX } from 'react-icons/fi'
import Header from '../Header'
import { getCustomFeedPosts } from '../../utils/storage'
import './Reels.css'

// 25 Curated 5:5 Grid Sample Learning Videos with User Provided Reel Links
const LEARNING_REELS_LIST = [
  // 1. Ddvzl8agg72
  {
    id: 'reel_ddvzl8agg72',
    user_name: 'react_mastery',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'React 19 Actions',
    tag: '⚛️ React 19',
    post_link: 'https://www.instagram.com/reel/Ddvzl8agg72/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'React 19 Actions & useActionState hook in 45 seconds! Simplify async form handling & optimistic UI ⚡ #React #WebDev #JavaScript',
    audio_info: 'react_mastery • Code Flow',
    views: '284K',
    likes_count: 11420,
    comments_count: 412,
  },
  // 2. DdtVeIohU3c
  {
    id: 'reel_ddtveiohu3c',
    user_name: 'pycode.dev',
    profile_pic: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
    is_verified: true,
    topic: 'Python Tricks',
    tag: '🐍 Python',
    post_link: 'https://www.instagram.com/reel/DdtVeIohU3c/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'Top 5 Python One-Liners that make you look like a Senior Engineer 🚀 List comprehensions & Walrus operator!',
    audio_info: 'pycode.dev • Python Beats',
    views: '390K',
    likes_count: 14890,
    comments_count: 530,
  },
  // 3. Dc5gD-FSsf8
  {
    id: 'reel_dc5gd_fssf8',
    user_name: 'codenloop',
    profile_pic: '/codenloop_story.jpg',
    is_verified: true,
    topic: 'DSA Stack LIFO',
    tag: '☕ Java & DSA',
    post_link: 'https://www.instagram.com/reel/Dc5gD-FSsf8/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'Reverse String with Stack LIFO Logic 🔥 Day 17 DSA Challenge! Time O(N) | Space O(N) #Java #DSA #TeluguCoding',
    audio_info: 'codenloop • Trending Tech',
    views: '195K',
    likes_count: 6240,
    comments_count: 218,
  },
  // 4. DYjzhs5pbSS
  {
    id: 'reel_dyjzhs5pbss',
    user_name: 'system_design_101',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_verified: true,
    topic: 'Redis Caching',
    tag: '🏗️ Architecture',
    post_link: 'https://www.instagram.com/reel/DYjzhs5pbSS/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'Redis In-Memory Caching Strategies (Cache-Aside, Write-Through, Write-Back) for Ultra High Throughput ⚡💾',
    audio_info: 'system_design_101 • Deep Focus',
    views: '320K',
    likes_count: 12100,
    comments_count: 395,
  },
  // 5. DdjHGWNIe3A
  {
    id: 'reel_ddjhgwnie3a',
    user_name: 'nodejs_backend',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'Node Event Loop',
    tag: '⚡ Node.js',
    post_link: 'https://www.instagram.com/reel/DdjHGWNIe3A/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    caption: 'How the Node.js Event Loop works under the hood 🌐 Microtasks, Timers, and I/O polling simplified!',
    audio_info: 'nodejs_backend • Backend Focus',
    views: '178K',
    likes_count: 5890,
    comments_count: 184,
  },
  // 6. DcyQ3gZoAzm
  {
    id: 'reel_dcyq3gzoazm',
    user_name: 'css_wizard',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'CSS Grid',
    tag: '🎨 UI/UX',
    post_link: 'https://www.instagram.com/reel/DcyQ3gZoAzm/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'One-line responsive layout superpower: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))! ✨',
    audio_info: 'css_wizard • UI Magic',
    views: '260K',
    likes_count: 8940,
    comments_count: 245,
  },
  // 7. DcD0l_RTlIU
  {
    id: 'reel_dcd0l_rtliu',
    user_name: 'typescript_pro',
    profile_pic: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    is_verified: true,
    topic: 'TypeScript Generics',
    tag: '📘 TypeScript',
    post_link: 'https://www.instagram.com/p/DcD0l_RTlIU/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'Master TypeScript Generics in 60s! Create reusable, strictly type-safe API wrappers effortlessly 🛡️',
    audio_info: 'typescript_pro • Type Flow',
    views: '145K',
    likes_count: 4720,
    comments_count: 132,
  },
  // 8. DaNjIVrJs0o
  {
    id: 'reel_danjivrs0o',
    user_name: 'docker_devops',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'Docker Builds',
    tag: '🐳 DevOps',
    post_link: 'https://www.instagram.com/reel/DaNjIVrJs0o/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'Multi-stage Docker builds: Shrink your Node/React production image from 1.2GB to under 50MB 🚀📦',
    audio_info: 'docker_devops • Cloud Audio',
    views: '210K',
    likes_count: 7350,
    comments_count: 198,
  },
  // 9. DdghvalJ9jK
  {
    id: 'reel_ddghvalj9jk',
    user_name: 'database_hub',
    profile_pic: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    is_verified: true,
    topic: 'PostgreSQL vs MongoDB',
    tag: '🗄️ Database',
    post_link: 'https://www.instagram.com/reel/DdghvalJ9jK/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'When to choose PostgreSQL vs MongoDB? ACID transactions vs flexible JSON schemas explained clearly! 📊🍃',
    audio_info: 'database_hub • Data Beats',
    views: '185K',
    likes_count: 6180,
    comments_count: 167,
  },
  // 10. DdjU5NlpUW2
  {
    id: 'reel_ddju5nlpuw2',
    user_name: 'nextjs_daily',
    profile_pic: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150',
    is_verified: true,
    topic: 'Next.js 15 Actions',
    tag: '⚛️ Frontend',
    post_link: 'https://www.instagram.com/reel/DdjU5NlpUW2/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'Next.js 15 Server Actions vs API Routes: When should you use which? Real-time mutations made easy! 🚀',
    audio_info: 'nextjs_daily • Next Vibe',
    views: '290K',
    likes_count: 10450,
    comments_count: 340,
  },
  // 11. DdqA1K5MrN5
  {
    id: 'reel_ddqa1k5mrn5',
    user_name: 'ai_engineers',
    profile_pic: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150',
    is_verified: true,
    topic: 'AI Agents',
    tag: '🤖 AI/ML',
    post_link: 'https://www.instagram.com/reel/DdqA1K5MrN5/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'Building Autonomous AI coding agents with function calling and tool execution loops 🤖💡 #AI #Python',
    audio_info: 'ai_engineers • Future AI',
    views: '450K',
    likes_count: 16200,
    comments_count: 610,
  },
  // 12. DcgN_TrBjl-
  {
    id: 'reel_dcgn_trbjl',
    user_name: 'dsa_visualizer',
    profile_pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_verified: true,
    topic: 'Binary Search',
    tag: '📚 Algorithms',
    post_link: 'https://www.instagram.com/reel/DcgN_TrBjl-/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    caption: 'Binary Search step-by-step pointer visualization! Halving search space for O(log N) speed ⚡ #LeetCode',
    audio_info: 'dsa_visualizer • Logic Sound',
    views: '340K',
    likes_count: 11200,
    comments_count: 380,
  },
  // 13. DdoXO15t553
  {
    id: 'reel_ddoxo15t553',
    user_name: 'express_apis',
    profile_pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    is_verified: true,
    topic: 'Express JWT',
    tag: '⚡ Backend',
    post_link: 'https://www.instagram.com/reel/DdoXO15t553/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'JWT Authentication middleware in Express.js: Protect protected routes with verifyToken in 5 lines 🔐🛡️',
    audio_info: 'express_apis • Security Beat',
    views: '165K',
    likes_count: 5240,
    comments_count: 155,
  },
  // 14. DdoQpWyIpwQ
  {
    id: 'reel_ddoqpwyipwq',
    user_name: 'graphql_guide',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_verified: true,
    topic: 'GraphQL vs REST',
    tag: '🌐 API Design',
    post_link: 'https://www.instagram.com/reel/DdoQpWyIpwQ/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'GraphQL vs REST: Eliminate over-fetching and under-fetching with single declarative query schemas 📡✨',
    audio_info: 'graphql_guide • GraphQL Pulse',
    views: '150K',
    likes_count: 4890,
    comments_count: 140,
  },
  // 15. Ddlr3nZzLwl
  {
    id: 'reel_ddlr3nzzlwl',
    user_name: 'golang_channel',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'Go Goroutines',
    tag: '🐹 Golang',
    post_link: 'https://www.instagram.com/reel/Ddlr3nZzLwl/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    caption: 'Go Goroutines & Channels: Lightweight concurrent programming with zero thread overhead ⚡🐹',
    audio_info: 'golang_channel • Go Rhythms',
    views: '205K',
    likes_count: 7120,
    comments_count: 220,
  },
  // 16. DdiUx_kT6GK
  {
    id: 'reel_ddiux_kt6gk',
    user_name: 'clean_coder',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'SOLID Principles',
    tag: '📐 Architecture',
    post_link: 'https://www.instagram.com/reel/DdiUx_kT6GK/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'Single Responsibility & Dependency Inversion in React and Node: Write testable, decouple code 💡✨',
    audio_info: 'clean_coder • Ambient Focus',
    views: '230K',
    likes_count: 7890,
    comments_count: 245,
  },
  // 17. Dds5p5sybc3
  {
    id: 'reel_dds5p5sybc3',
    user_name: 'websocket_realtime',
    profile_pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_verified: true,
    topic: 'WebSockets',
    tag: '💬 Realtime',
    post_link: 'https://www.instagram.com/reel/Dds5p5sybc3/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'Bidirectional full-duplex communication with Socket.io & ws: Build instant real-time apps 💬🔔',
    audio_info: 'websocket_realtime • Realtime Pulse',
    views: '275K',
    likes_count: 9400,
    comments_count: 310,
  },
  // 18. Ddty13cB_mm
  {
    id: 'reel_ddty13cb_mm',
    user_name: 'fullstack_roadmap',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'Fullstack 2026',
    tag: '🚀 Career',
    post_link: 'https://www.instagram.com/reel/Ddty13cB_mm/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'The Ultimate 2026 Full Stack Developer Roadmap: React, Node, Cloud, AI & System Architecture 🗺️✨',
    audio_info: 'fullstack_roadmap • Inspiration',
    views: '520K',
    likes_count: 18900,
    comments_count: 750,
  },
  // 19. Git Interactive Rebase
  {
    id: 'lr_19_git',
    user_name: 'git_hacks',
    profile_pic: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150',
    is_verified: true,
    topic: 'Git Workflow',
    tag: '🔧 DevOps',
    post_link: 'https://www.instagram.com/p/git_rebase/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'Git Interactive Rebase (git rebase -i HEAD~N): Squash messy commits into clean history like a pro! 🧹💻',
    audio_info: 'git_hacks • Clean Code',
    views: '158K',
    likes_count: 4720,
    comments_count: 130,
  },
  // 20. Tailwind CSS
  {
    id: 'lr_20_tailwind',
    user_name: 'tailwind_ninja',
    profile_pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_verified: true,
    topic: 'Tailwind CSS',
    tag: '🎨 UI/UX',
    post_link: 'https://www.instagram.com/p/tailwind_tips/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'Custom Tailwind plugins, CSS variables, and dark mode transitions in under 60 seconds 🎨⚡',
    audio_info: 'tailwind_ninja • Synthwave',
    views: '205K',
    likes_count: 6420,
    comments_count: 190,
  },
  // 21. FastAPI Python
  {
    id: 'lr_21_fastapi',
    user_name: 'fastapi_python',
    profile_pic: 'https://images.unsplash.com/photo-1516116211227-bbc141a0670d?w=150',
    is_verified: true,
    topic: 'FastAPI',
    tag: '🐍 Python',
    post_link: 'https://www.instagram.com/p/fastapi_tips/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
    caption: 'Why FastAPI is the highest performance Python backend framework: Async Pydantic validation & Auto Docs ⚡',
    audio_info: 'fastapi_python • Python Tech',
    views: '230K',
    likes_count: 7120,
    comments_count: 210,
  },
  // 22. MongoDB Aggregation Pipeline
  {
    id: 'lr_22_mongodb',
    user_name: 'mongodb_masters',
    profile_pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_verified: true,
    topic: 'MongoDB Pipeline',
    tag: '🗄️ Database',
    post_link: 'https://www.instagram.com/p/mongodb_pipeline/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
    caption: 'MongoDB Aggregation Pipeline ($match, $group, $lookup, $project) explained visually in 1 minute 🍃📊',
    audio_info: 'mongodb_masters • DB Sound',
    views: '185K',
    likes_count: 5640,
    comments_count: 168,
  },
  // 23. Binary Tree Traversals
  {
    id: 'lr_23_trees',
    user_name: 'dsa_trees',
    profile_pic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    is_verified: true,
    topic: 'Binary Trees',
    tag: '📚 Algorithms',
    post_link: 'https://www.instagram.com/p/binary_trees/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    caption: 'Inorder, Preorder, and Postorder DFS Tree Traversals animated simply! Ace your FAANG interviews 🌳💻',
    audio_info: 'dsa_trees • Code Rhythms',
    views: '260K',
    likes_count: 8100,
    comments_count: 270,
  },
  // 24. Web Security & OWASP
  {
    id: 'lr_24_security',
    user_name: 'web_security',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'Cybersecurity',
    tag: '🛡️ Security',
    post_link: 'https://www.instagram.com/p/web_security/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-and-daughter-looking-at-the-sunset-41589-large.mp4',
    caption: 'Preventing XSS, CSRF, and SQL Injection attacks in modern full stack web applications 🛡️🔒',
    audio_info: 'web_security • Cyber Beat',
    views: '215K',
    likes_count: 6890,
    comments_count: 212,
  },
  // 25. NextGen AI Academy
  {
    id: 'lr_25_ai',
    user_name: 'nextgendataaiacademy',
    profile_pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_verified: true,
    topic: 'NextGen AI',
    tag: '🤖 AI Academy',
    post_link: 'https://www.instagram.com/p/nextgen_ai/',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-42984-large.mp4',
    caption: 'Junior writes 10 lines... Senior writes 1 line. Explore how AI pipelines transform messy data workflows effortlessly 🧠⚡',
    audio_info: 'nextgendataaiacademy • AI Pulse',
    views: '380K',
    likes_count: 14200,
    comments_count: 490,
  },
]

const ReelGridCard = ({ reel, onClickCard }) => {
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(reel.likes_count || 0)
  const videoRef = useRef(null)

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

  const handleSoundToggle = e => {
    e.stopPropagation()
    setIsMuted(prev => !prev)
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
          onClick={handleSoundToggle}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </button>

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

            <button type="button" className="reel-action-btn" onClick={e => { e.stopPropagation(); onClickCard(reel); }}>
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
  const [modalMuted, setModalMuted] = useState(false)
  const [modalPlaying, setModalPlaying] = useState(true)
  const [modalLiked, setModalLiked] = useState(false)
  const [modalLikesCount, setModalLikesCount] = useState(0)
  const [modalSaved, setModalSaved] = useState(false)
  const [modalFollowing, setModalFollowing] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [modalComments, setModalComments] = useState([])
  const [allReels, setAllReels] = useState(LEARNING_REELS_LIST)
  const modalVideoRef = useRef(null)

  const toggleModalPlay = () => {
    if (!modalVideoRef.current) return
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play()
      setModalPlaying(true)
    } else {
      modalVideoRef.current.pause()
      setModalPlaying(false)
    }
  }

  const handleOpenReel = reel => {
    setSelectedReelModal(reel)
    setModalPlaying(true)
    setModalMuted(false)
    setModalLiked(false)
    setModalLikesCount(reel.likes_count || 3270)
    setModalSaved(false)
    setModalFollowing(false)
    setCommentText('')
    setModalComments([
      {
        id: 'c1',
        username: 'pawavarma795',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
        text: '🙌 🔥 Great explanation on loops and syntax!',
        time: '5w',
        likes: 1,
      },
      {
        id: 'c2',
        username: 'dribspyetrocrown',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        text: '😍 🔥 🔥 Bookmarked for my upcoming technical interview prep!',
        time: '5w',
        likes: 3,
      },
      {
        id: 'c3',
        username: 'tech_explorer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        text: 'Clean and concise. Thank you for breaking down the concepts so well! 👏',
        time: '3w',
        likes: 2,
      },
    ])
  }

  const handleAddComment = e => {
    e.preventDefault()
    if (!commentText.trim()) return
    const newC = {
      id: `c_${Date.now()}`,
      username: 'mubashir_hussen.sk',
      avatar: '/profile_avatar.jpg',
      text: commentText.trim(),
      time: 'Just now',
      likes: 0,
    }
    setModalComments(prev => [...prev, newC])
    setCommentText('')
  }

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
      post_link: c.post_link,
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
                onClickCard={handleOpenReel}
              />
            ))
          ) : (
            <p className="no-reels-found">No learning reels match your search.</p>
          )}
        </section>
      </main>

      {/* Instagram True Dark Mode Reel Viewer Modal */}
      {selectedReelModal && (
        <div
          className="reel-dark-modal-backdrop"
          onClick={() => setSelectedReelModal(null)}
          role="presentation"
        >
          <button
            type="button"
            className="reel-dark-close-corner-btn"
            onClick={() => setSelectedReelModal(null)}
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
              {/* Left Side: Video Media Screen with Instagram Header Overlay */}
              <div className="reel-dark-media-pane" onClick={toggleModalPlay}>
                {/* Top-Left Instagram Username Badge */}
                <div className="reel-media-user-badge">
                  <BsInstagram className="ig-badge-logo" size={16} />
                  <span>@{selectedReelModal.user_name}</span>
                </div>

                <video
                  ref={modalVideoRef}
                  src={selectedReelModal.video_url}
                  autoPlay
                  playsInline
                  loop
                  muted={modalMuted}
                  className="reel-dark-video-player"
                />

                {/* Top-Right Sound Toggle */}
                <button
                  type="button"
                  className="reel-dark-sound-btn"
                  onClick={e => {
                    e.stopPropagation()
                    setModalMuted(prev => !prev)
                  }}
                  aria-label={modalMuted ? 'Unmute' : 'Mute'}
                >
                  {modalMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                </button>

                {/* Play/Pause Overlay Center Circle */}
                {!modalPlaying && (
                  <div className="reel-dark-play-indicator">
                    <BsPlayFill size={48} />
                  </div>
                )}
              </div>

              {/* Right Side: Instagram Dark Comments & Details Pane */}
              <div className="reel-dark-details-pane">
                {/* 1. Header Row */}
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

                  <button
                    type="button"
                    className="reel-dark-options-btn"
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedReelModal.post_link || window.location.href)
                      alert('Reel link copied to clipboard! 📋')
                    }}
                    title="More options"
                  >
                    <BsThreeDots size={18} />
                  </button>
                </div>

                {/* 2. Scrollable Body: Caption & Comments */}
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

                  {/* User Comments List */}
                  {modalComments.map(comment => (
                    <div key={comment.id} className="reel-dark-comment-item">
                      <img
                        src={comment.avatar}
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
                          <span>{comment.time}</span>
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
                        onClick={() => {
                          if (modalLiked) {
                            setModalLiked(false)
                            setModalLikesCount(prev => Math.max(0, prev - 1))
                          } else {
                            setModalLiked(true)
                            setModalLikesCount(prev => prev + 1)
                          }
                        }}
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
                          alert('Reel link copied! 📋')
                        }}
                        aria-label="Share"
                      >
                        <BsSend size={22} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="reel-dark-icon-btn"
                      onClick={() => setModalSaved(prev => !prev)}
                      aria-label="Save"
                    >
                      {modalSaved ? <BsBookmarkFill color="#ffffff" size={22} /> : <BsBookmark size={22} />}
                    </button>
                  </div>

                  <div className="reel-dark-likes-row">
                    <strong>{modalLikesCount.toLocaleString()} likes</strong>
                  </div>
                  <span className="reel-dark-date-label">August 15</span>

                  {selectedReelModal.post_link && (
                    <a
                      href={selectedReelModal.post_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reel-dark-ig-link"
                    >
                      <BsInstagram size={13} />
                      <span>Watch Reel on Instagram ↗</span>
                    </a>
                  )}

                  {/* 4. Add a comment input form */}
                  <form className="reel-dark-add-comment-form" onSubmit={handleAddComment}>
                    <button type="button" className="comment-emoji-btn" aria-label="Insert Emoji">
                      <BsEmojiSmile size={20} />
                    </button>
                    <input
                      type="text"
                      className="comment-text-input"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                    />
                    {commentText.trim() && (
                      <button type="submit" className="comment-post-btn">
                        Post
                      </button>
                    )}
                  </form>
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