import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BsPencilSquare,
  BsChevronDown,
  BsPatchCheckFill,
  BsTelephone,
  BsCameraVideo,
  BsInfoCircle,
  BsEmojiSmile,
  BsImage,
  BsHeartFill,
  BsHeart,
  BsMic,
  BsArrowLeft,
} from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import Header from '../Header'
import './index.css'

const initialThreads = [
  {
    id: 'Monster',
    name: 'Monster',
    username: 'Monster',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    isStory: true,
    isVerified: false,
    lastMessage: '4+ new messages',
    time: '1m',
    unread: true,
    onlineStatus: 'Active now',
    followersCount: '1.2M',
    bio: 'Official page of Hi Nanna 🎬✨ | In Cinemas Worldwide',
    messages: [
      {
        id: 'm1',
        sender: 'other',
        text: 'Hey Mubashir! Did you watch the trailer?',
        time: '10:45 AM',
        reaction: null,
      },
      {
        id: 'm2',
        sender: 'user',
        text: 'Yes! The visuals and BGM are absolutely breathtaking ❤️',
        time: '10:46 AM',
        reaction: '❤️',
      },
      {
        id: 'm3',
        sender: 'other',
        text: 'Thank you so much! Sharing some behind the scenes shots soon!',
        time: '10:48 AM',
        reaction: null,
      },
      {
        id: 'm4',
        sender: 'other',
        text: 'Let us know your favorite scene!',
        time: '10:49 AM',
        reaction: null,
      },
    ],
  },
  {
    id: 'Ramakrishna',
    name: 'Ramakrishna',
    username: 'ramakrishna',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    isStory: false,
    isVerified: true,
    lastMessage: 'Main acc msg chaiyarah',
    time: '7h',
    unread: true,
    onlineStatus: 'Active 2h ago',
    followersCount: '48.5K',
    bio: 'Entrepreneur & Tech Enthusiast | Founder @ JB Tech',
    messages: [
      {
        id: 'm1',
        sender: 'other',
        text: 'Bro check your primary inbox',
        time: '1:15 AM',
        reaction: null,
      },
      {
        id: 'm2',
        sender: 'other',
        text: 'Main acc msg chaiyarah',
        time: '1:16 AM',
        reaction: null,
      },
    ],
  },
  {
    id: 'Yashwanth Raj',
    name: 'Yashwanth Raj',
    username: 'Yashwanth_raj',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop',
    isStory: false,
    isVerified: true,
    lastMessage: 'Ramneni sent an attachment.',
    time: '9h',
    unread: false,
    onlineStatus: 'Active 4h ago',
    followersCount: '210K',
    bio: 'Creator & Filmmaker | Visual Storytelling 🎥',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Hey Ashwin, send over the color grade preset when you get time',
        time: 'Yesterday',
        reaction: null,
      },
      {
        id: 'm2',
        sender: 'other',
        text: 'Here is the sample look from yesterday shoot:',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
        time: '11:20 PM',
        reaction: '🔥',
      },
      {
        id: 'm3',
        sender: 'other',
        text: 'Ramneni sent an attachment.',
        time: '11:21 PM',
        reaction: null,
      },
    ],
  },
  {
    id: 'sohail',
    name: 'Sohail & me',
    username: 'Sohail & me',
    avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop',
    isGroup: true,
    secondAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    isStory: false,
    isVerified: false,
    lastMessage: 'Sohail sent an attachment.',
    time: '10h',
    unread: true,
    onlineStatus: 'Active 1h ago',
    followersCount: '12k',
    bio: 'Software Engineer ✨',
    messages: [
      {
        id: 'm1',
        sender: 'other',
        senderName: 'Sohail & me',
        text: 'Hey.. how are you ?',
        time: '10:15 AM',
        reaction: null,
      },
      {
        id: 'm2',
        sender: 'other',
        senderName: 'Sohail',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop',
        time: '10:16 AM',
        reaction: '👍',
      },
      {
        id: 'm3',
        sender: 'user',
        text: 'I\'m good .. What are you doing ?',
        time: '10:20 AM',
        reaction: '❤️',
      },
    ],
  },
  {
    id: 'naveen',
    name: 'Naveen',
    username: 'Naveen',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop',
    isStory: false,
    isVerified: false,
    lastMessage: 'Naveen sent an attachment.',
    time: '21h',
    unread: true,
    onlineStatus: 'Active yesterday',
    followersCount: '890',
    bio: 'Btech 2nd year Student',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Did you see that match finish yesterday? Unbelievable last over! 🤯',
        time: 'Yesterday',
        reaction: '😂',
      },
      {
        id: 'm2',
        sender: 'other',
        text: 'Reacted 😂 to your message',
        time: 'Yesterday',
        reaction: null,
      },
    ],
  },
  {
    id: 'rolex',
    name: 'ROLEX',
    username: 'rolex_official_007',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop',
    isStory: false,
    isVerified: false,
    lastMessage: 'Reacted 😂 to your message',
    time: '1d',
    unread: true,
    onlineStatus: 'Active 1d ago',
    followersCount: '3.4K',
    bio: 'Life is a movie | Stay dangerous 🔥',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'Bro the reel you sent was hilarious 😂',
        time: '2 days ago',
        reaction: '😂',
      },
      {
        id: 'm2',
        sender: 'other',
        text: 'Reacted 😂 to your message',
        time: '1d ago',
        reaction: null,
      },
    ],
  },
]

const DirectMessages = () => {
  const [threads, setThreads] = useState(initialThreads)
  const [activeThreadId, setActiveThreadId] = useState('hi_nanna')
  const [activeTab, setActiveTab] = useState('messages')
  const [searchQuery, setSearchQuery] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeThread?.messages, isTyping])

  const handleSelectThread = id => {
    setActiveThreadId(id)
    setShowMobileChat(true)
    setThreads(prev =>
      prev.map(thread => (thread.id === id ? { ...thread, unread: false } : thread)),
    )
  }

  const getContextualReply = (userText, contact) => {
    const lower = userText.toLowerCase().trim()
    const contactName = contact?.name || 'friend'

    // Greetings
    if (/^(hi|hello|hey|yo|namaste|vanakkam|hola)\b/i.test(lower)) {
      const greetings = [
        `Hey Mubashir! Great to hear from you 😊 What's going on?`,
        `Hello! Hope you are having a wonderful day ✨`,
        `Hey! How have you been? 🙌`,
      ]
      return greetings[Math.floor(Math.random() * greetings.length)]
    }

    // How are you
    if (/how (are|r) (you|u)|how are things|whatsapp|how's it going|how is it going/i.test(lower)) {
      return "I'm doing really great, thank you! How about you? How is your day going?"
    }

    // What are you doing / sup
    if (/what (are you|r u) doing|wassup|what's up|whats up|sup\b|how's it going|how is it going/i.test(lower)) {
      return "Just working on some new creative content and checking messages! What are you up to today?"
    }

    // Movies / Trailers / Entertainment / Music / Songs
    if (/trailer|movie|film|cinema|song|music|kesariya|scene|bgm|teaser|hero|director/i.test(lower)) {
      return `We put so much love and passion into this project! So excited you enjoyed the music and scenes 🎬🍿 Have you watched the whole clip?`
    }

    // 1. React & Frontend Frameworks
    if (/react|next\.?js|hook|usestate|useeffect|usememo|redux|virtual dom|component|jsx|props/i.test(lower)) {
      if (/hook|usestate|useeffect|usememo|usecallback|custom hook/i.test(lower)) {
        return "React Hooks are game changers! ⚛️ Always remember: useState triggers re-renders on state change, useEffect handles side-effects (and cleanups!), and useMemo/useCallback prevent unnecessary computations & re-renders."
      }
      if (/next\.?js|ssr|ssg|app router/i.test(lower)) {
        return "Next.js with Server Components and App Router gives you ultra-fast initial page loads and effortless SEO ⚡ Are you building static SSG or dynamic SSR?"
      }
      if (/redux|zustand|context api|state/i.test(lower)) {
        return "For state management in React, Zustand and Redux Toolkit are super clean, while Context API is perfect for global themes & auth states! 🚀"
      }
      return "React's declarative component model and fast Virtual DOM diffing make crafting interactive UIs smooth! ⚛️ Are you building a new component or optimizing renders?"
    }

    // 2. Node.js & Express
    if (/node(\.?js)?|express(\.?js)?|backend|middleware|server|api|rest|endpoint|jwt|auth/i.test(lower)) {
      if (/express|middleware|route|routing|app\.use/i.test(lower)) {
        return "Express middleware (`(req, res, next) => {}`) is the backbone of Node APIs! Super clean for handling JWT validation, CORS, error handling, and request logging. 🛡️💻"
      }
      if (/jwt|auth|token|bcrypt|login|signup/i.test(lower)) {
        return "For secure Node/Express authentication, pairing bcrypt password hashing with signed HTTP-only JWT tokens keeps user sessions rock solid! 🔐"
      }
      return "Node.js with its non-blocking event-driven I/O paired with Express or NestJS is blazing fast for scalable microservices and RESTful APIs! 🌐⚡"
    }

    // 3. Databases (SQL, MongoDB, PostgreSQL, Redis)
    if (/database|db|mongodb|mongo|postgres(ql)?|mysql|sql|redis|prisma|mongoose|nosql/i.test(lower)) {
      if (/mongodb|nosql|mongoose|document/i.test(lower)) {
        return "MongoDB's flexible JSON-like BSON documents and aggregation pipelines make prototyping schemas and nested data models lightning fast! 🍃📦"
      }
      if (/postgres|mysql|sql|relational|acid|join/i.test(lower)) {
        return "PostgreSQL is incredible with strict ACID compliance, relational joins, JSONB support, and high performance indexing for complex enterprise queries! 🐘📊"
      }
      if (/redis|cache|caching|in-memory/i.test(lower)) {
        return "Redis in-memory caching with sub-millisecond lookups and TTL expiration is essential for scaling high-traffic endpoints and session stores! ⚡💾"
      }
      return "Choosing between Relational SQL (Postgres/MySQL) and NoSQL (MongoDB/Redis) depends on your schema structure and scaling requirements! What DB are you using? 🗄️"
    }

    // 4. Programming Languages (JavaScript, Python, Java, C++, TypeScript, Go, Rust)
    if (/javascript|js|typescript|ts|python|py|java|c\+\+|cpp|golang|go|rust/i.test(lower)) {
      if (/typescript|ts/i.test(lower)) {
        return "TypeScript's static type safety and interface contracts eliminate runtime bugs before your code even reaches production! 🛡️📘"
      }
      if (/python|py|django|fastapi/i.test(lower)) {
        return "Python's syntax elegance combined with libraries for AI/ML and FastAPI for async backends is truly unmatched 🐍✨"
      }
      if (/java|dsa|oop/i.test(lower)) {
        return "Java's robust OOP principles, strong typing, and JVM memory optimizations are standard in enterprise architectures and DSA problem solving! ☕☕"
      }
      if (/c\+\+|cpp/i.test(lower)) {
        return "C++ gives you raw metal performance, manual memory pointers, and STL containers essential for competitive programming & game engines! ⚡⚙️"
      }
      return "JavaScript and TypeScript run the modern web from client to cloud! What features or algorithms are you exploring right now? 💻🔥"
    }

    // 5. System Design, DevOps & Architecture
    if (/system design|docker|kubernetes|aws|cloud|microservices|architecture|graphql|socket/i.test(lower)) {
      return "Great topic! System design principles like load balancing, horizontal scaling, database sharding, and message queues (Kafka/RabbitMQ) ensure high availability! 🏗️☁️"
    }

    // Images / Photos / Attachments / Design / UI
    if (/photo|image|pic|picture|screenshot|design|ui|attachment|look/i.test(lower)) {
      return `The visuals look super crisp and clean! Really loving the color palette and composition 🔥`
    }

    // Compliments / Love / Fire
    if (/love|awesome|super|great|amazing|fire|best|nice|cool|good|beautiful/i.test(lower)) {
      return `Thank you so much! Really means a lot coming from you ❤️✨ Keep inspiring!`
    }

    // Questions (who, what, where, when, why, how, can you, will you)
    if (lower.includes('?') || /^(who|what|where|when|why|how|can|will|do|is|are|could|would)\b/i.test(lower)) {
      if (lower.includes('where') || lower.includes('location') || lower.includes('meet')) {
        return "Let's definitely catch up soon! Let me know your free slots this week 🤝"
      }
      if (lower.includes('when') || lower.includes('time')) {
        return "I should be available by evening around 6 PM! Does that work for you?"
      }
      return "That's a really good question! Let me check the details and get back to you shortly 👍"
    }

    // Thanks / Gratitude
    if (/thank|thanks|tq|ty|appreciate/i.test(lower)) {
      return "You're most welcome! Always happy to connect and help 😊"
    }

    // Agreement / OK
    if (/^(ok|okay|sure|cool|done|alright|fine|yes|yeah|yep)\b/i.test(lower)) {
      return "Sounds great! Catch you later 👍"
    }

    // Good morning / Good night
    if (/good morning|gm\b/i.test(lower)) {
      return "Good morning! Wishing you an energized and productive day ahead ☀️"
    }
    if (/good night|gn\b|bye|see you|cya|take care/i.test(lower)) {
      return "Take care! Have a restful night and talk soon 👋✨"
    }

    // Laughing / Funny
    if (/haha|hehe|lol|rofl|😂|🤣/i.test(lower)) {
      return "Haha hilarious! 😂 Couldn't agree more!"
    }

    // Default contextual reply
    return `Thanks for the message! Really appreciate you reaching out about this 🙌 Let me know if you need anything else.`
  }

  const handleSendMessage = e => {
    e?.preventDefault()
    const trimmedMessage = inputMessage.trim()
    if (!trimmedMessage) return

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: trimmedMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reaction: null,
    }

    const currentThreadId = activeThread.id
    const currentThread = activeThread

    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === currentThreadId) {
          return {
            ...thread,
            lastMessage: `You: ${trimmedMessage}`,
            time: 'Just now',
            unread: false,
            messages: [...thread.messages, newMsg],
          }
        }
        return thread
      }),
    )

    setInputMessage('')
    setIsTyping(true)

    // Generate intelligent contextual reply based on user's exact message
    setTimeout(() => {
      setIsTyping(false)
      const smartReplyText = getContextualReply(trimmedMessage, currentThread)

      const replyMsg = {
        id: `reply_${Date.now()}`,
        sender: 'other',
        text: smartReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reaction: null,
      }

      setThreads(prev =>
        prev.map(thread => {
          if (thread.id === currentThreadId) {
            return {
              ...thread,
              lastMessage: smartReplyText,
              time: 'Just now',
              messages: [...thread.messages, replyMsg],
            }
          }
          return thread
        }),
      )
    }, 1200)
  }

  const handleSendHeart = () => {
    const newMsg = {
      id: `msg_heart_${Date.now()}`,
      sender: 'user',
      text: '❤️',
      isEmojiOnly: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reaction: null,
    }

    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === activeThread.id) {
          return {
            ...thread,
            lastMessage: 'You sent a heart ❤️',
            time: 'Just now',
            unread: false,
            messages: [...thread.messages, newMsg],
          }
        }
        return thread
      }),
    )
  }

  const handleToggleReaction = msgId => {
    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === activeThread.id) {
          return {
            ...thread,
            messages: thread.messages.map(msg =>
              msg.id === msgId ? { ...msg, reaction: msg.reaction === '❤️' ? null : '❤️' } : msg,
            ),
          }
        }
        return thread
      }),
    )
  }

  const filteredThreads = threads.filter(
    thread =>
      thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="direct-page-root">
      <Header />

      <main className="direct-main-container">
        <div className="direct-window-card">
          {/* Left Sidebar */}
          <aside className={`direct-sidebar-pane ${showMobileChat ? 'hide-on-mobile' : ''}`}>
            {/* Account Header */}
            <div className="sidebar-top-bar">
              <div className="user-dropdown-btn">
                <span className="current-account-name">mubashir_hussen.sk</span>
                <BsChevronDown className="dropdown-chevron-icon" size={14} />
              </div>
              <button
                type="button"
                className="new-message-compose-btn"
                title="New Message"
                onClick={() => inputRef.current?.focus()}
              >
                <BsPencilSquare size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div className="direct-search-box">
              <FaSearch className="direct-search-icon" size={14} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="direct-search-input"
              />
            </div>

            {/* Section Tabs */}
            <div className="direct-section-tabs">
              <button
                type="button"
                className={`direct-tab-btn ${activeTab === 'messages' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                Messages
              </button>
              <button
                type="button"
                className={`direct-tab-btn ${activeTab === 'requests' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('requests')}
              >
                Requests <span className="requests-badge-count">2</span>
              </button>
            </div>

            {/* Thread List */}
            <div className="threads-list-scroll">
              {activeTab === 'requests' ? (
                <div className="requests-empty-state">
                  <p className="requests-empty-title">No new message requests</p>
                  <p className="requests-empty-sub">
                    Messages from people you don't follow will appear here.
                  </p>
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="threads-empty-state">
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredThreads.map(thread => {
                  const isSelected = thread.id === activeThreadId
                  return (
                    <div
                      key={thread.id}
                      className={`thread-row-item ${isSelected ? 'selected-thread' : ''}`}
                      onClick={() => handleSelectThread(thread.id)}
                    >
                      <div className="thread-avatar-container">
                        {thread.isGroup ? (
                          <div className="group-avatar-stack">
                            <img
                              src={thread.avatar}
                              alt="Group member"
                              className="group-avatar-primary"
                              onError={e => {
                                e.target.onerror = null
                                e.target.src = '/profile_avatar.jpg'
                              }}
                            />
                            <img
                              src={thread.secondAvatar}
                              alt="Group member"
                              className="group-avatar-secondary"
                              onError={e => {
                                e.target.onerror = null
                                e.target.src = '/profile_avatar.jpg'
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className={`thread-avatar-ring ${thread.isStory ? 'story-gradient-ring' : ''
                              }`}
                          >
                            <img
                              src={thread.avatar || '/profile_avatar.jpg'}
                              alt={thread.name}
                              className="thread-avatar-img"
                              onError={e => {
                                e.target.onerror = null
                                e.target.src = '/profile_avatar.jpg'
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="thread-text-content">
                        <div className="thread-name-line">
                          <span className="thread-user-name">{thread.name}</span>
                          {thread.isVerified && (
                            <BsPatchCheckFill className="verified-badge-icon" size={13} />
                          )}
                        </div>
                        <div className="thread-snippet-line">
                          <span
                            className={`thread-last-snippet ${thread.unread ? 'unread-snippet-bold' : ''
                              }`}
                          >
                            {thread.lastMessage}
                          </span>
                          <span className="thread-timestamp-dot">·</span>
                          <span className="thread-time-label">{thread.time}</span>
                        </div>
                      </div>

                      {thread.unread && <span className="thread-unread-blue-dot" />}
                    </div>
                  )
                })
              )}
            </div>
          </aside>

          {/* Right Active Chat Pane */}
          <section className={`direct-chat-pane ${!showMobileChat ? 'hide-on-mobile' : ''}`}>
            {activeThread ? (
              <div className="active-chat-container">
                {/* Chat Header */}
                <header className="chat-conversation-header">
                  <div className="chat-header-user-info">
                    <button
                      type="button"
                      className="chat-back-mobile-btn"
                      onClick={() => setShowMobileChat(false)}
                      title="Back to conversations"
                    >
                      <BsArrowLeft size={22} />
                    </button>
                    <div className="chat-header-avatar-wrap">
                      <img
                        src={activeThread.avatar || '/profile_avatar.jpg'}
                        alt={activeThread.name}
                        className="chat-header-avatar"
                        onError={e => {
                          e.target.onerror = null
                          e.target.src = '/profile_avatar.jpg'
                        }}
                      />
                      {activeThread.onlineStatus.includes('now') && (
                        <span className="online-indicator-dot" />
                      )}
                    </div>
                    <div className="chat-header-meta">
                      <div className="chat-header-title-row">
                        <h3 className="chat-header-name">{activeThread.name}</h3>
                        {activeThread.isVerified && (
                          <BsPatchCheckFill className="verified-badge-icon" size={14} />
                        )}
                      </div>
                      <span className="chat-header-status-text">
                        {activeThread.onlineStatus}
                      </span>
                    </div>
                  </div>

                  <div className="chat-header-action-buttons">
                    <button
                      type="button"
                      className="chat-action-icon-btn"
                      title="Audio Call"
                      onClick={() => alert(`Calling ${activeThread.name}...`)}
                    >
                      <BsTelephone size={20} />
                    </button>
                    <button
                      type="button"
                      className="chat-action-icon-btn"
                      title="Video Call"
                      onClick={() => alert(`Starting video call with ${activeThread.name}...`)}
                    >
                      <BsCameraVideo size={22} />
                    </button>
                    <button
                      type="button"
                      className="chat-action-icon-btn"
                      title="Details"
                      onClick={() => alert(`Profile details for ${activeThread.name}`)}
                    >
                      <BsInfoCircle size={20} />
                    </button>
                  </div>
                </header>

                {/* Messages Scroll Area */}
                <div className="chat-messages-scroll-area">
                  {/* Recipient Profile Intro */}
                  <div className="chat-recipient-intro">
                    <img
                      src={activeThread.avatar || '/profile_avatar.jpg'}
                      alt={activeThread.name}
                      className="recipient-intro-avatar"
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = '/profile_avatar.jpg'
                      }}
                    />
                    <h4 className="recipient-intro-name">{activeThread.name}</h4>
                    <p className="recipient-intro-handle">@{activeThread.username}</p>
                    <p className="recipient-intro-bio">{activeThread.bio}</p>
                    <p className="recipient-intro-meta">
                      Instagram · {activeThread.followersCount} followers
                    </p>
                    <Link
                      to="/my-profile"
                      className="recipient-view-profile-btn"
                    >
                      View profile
                    </Link>
                  </div>

                  <div className="chat-date-divider">
                    <span>TODAY</span>
                  </div>

                  {/* Message Bubbles */}
                  {activeThread.messages.map(msg => {
                    const isUser = msg.sender === 'user'
                    return (
                      <div
                        key={msg.id}
                        className={`message-bubble-row ${isUser ? 'user-bubble-row' : 'other-bubble-row'
                          }`}
                        onDoubleClick={() => handleToggleReaction(msg.id)}
                      >
                        {!isUser && (
                          <img
                            src={activeThread.avatar || '/profile_avatar.jpg'}
                            alt=""
                            className="message-sender-avatar"
                            onError={e => {
                              e.target.onerror = null
                              e.target.src = '/profile_avatar.jpg'
                            }}
                          />
                        )}

                        <div className="message-content-wrapper">
                          {msg.senderName && !isUser && (
                            <span className="group-sender-name-label">
                              {msg.senderName}
                            </span>
                          )}

                          {msg.image && (
                            <div className="message-attachment-image-card">
                              <img
                                src={msg.image}
                                alt="attachment"
                                className="message-image-media"
                              />
                            </div>
                          )}

                          {msg.text && (
                            <div
                              className={`message-bubble-pill ${isUser ? 'user-sent-pill' : 'other-received-pill'
                                } ${msg.isEmojiOnly ? 'emoji-large-pill' : ''}`}
                            >
                              <p className="bubble-text">{msg.text}</p>
                            </div>
                          )}

                          {msg.reaction && (
                            <div className="message-reaction-chip">
                              <span>{msg.reaction}</span>
                            </div>
                          )}

                          <span className="bubble-time-stamp">{msg.time}</span>
                        </div>
                      </div>
                    )
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="message-bubble-row other-bubble-row typing-indicator-row">
                      <img
                        src={activeThread.avatar}
                        alt=""
                        className="message-sender-avatar"
                      />
                      <div className="typing-dots-pill">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form className="chat-input-bar-form" onSubmit={handleSendMessage}>
                  <button
                    type="button"
                    className="chat-input-btn emoji-btn"
                    title="Insert emoji"
                    onClick={() => setInputMessage(prev => `${prev} 😊`)}
                  >
                    <BsEmojiSmile size={22} />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Message..."
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    className="chat-text-input-field"
                  />

                  {inputMessage.trim() ? (
                    <button
                      type="submit"
                      className="chat-send-action-btn"
                      title="Send message"
                    >
                      <IoSend size={20} />
                    </button>
                  ) : (
                    <div className="chat-input-aux-buttons">
                      <button
                        type="button"
                        className="chat-input-btn"
                        title="Attach image"
                        onClick={() => {
                          const demoImgUrl = prompt(
                            'Enter an image URL to share in chat:',
                            'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop',
                          )
                          if (demoImgUrl) {
                            const newImgMsg = {
                              id: `msg_img_${Date.now()}`,
                              sender: 'user',
                              image: demoImgUrl,
                              text: 'Shared a photo',
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              reaction: null,
                            }
                            setThreads(prev =>
                              prev.map(thread => {
                                if (thread.id === activeThread.id) {
                                  return {
                                    ...thread,
                                    lastMessage: 'You sent a photo',
                                    time: 'Just now',
                                    messages: [...thread.messages, newImgMsg],
                                  }
                                }
                                return thread
                              }),
                            )
                          }
                        }}
                      >
                        <BsImage size={20} />
                      </button>
                      <button
                        type="button"
                        className="chat-input-btn mic-btn"
                        title="Voice Message"
                        onClick={() => alert('Voice recording started... Speak now!')}
                      >
                        <BsMic size={22} />
                      </button>
                      <button
                        type="button"
                        className="chat-input-btn heart-btn"
                        title="Send heart"
                        onClick={handleSendHeart}
                      >
                        <BsHeart size={20} className="heart-empty-icon" />
                        <BsHeartFill size={20} className="heart-filled-icon" />
                      </button>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="direct-empty-selection">
                <div className="empty-messenger-circle">
                  <BsPencilSquare size={44} />
                </div>
                <h3>Your Messages</h3>
                <p>Send private photos and messages to a friend or group.</p>
                <button
                  type="button"
                  className="send-message-cta-btn"
                  onClick={() => handleSelectThread(threads[0].id)}
                >
                  Send message
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default DirectMessages
