// LocalStorage & Session Storage Management for Dynamic Users, Profiles & Created Posts

export const DEFAULT_USER_PROFILE = {
  username: 'mubashir_hussen.sk',
  name: 'Mubashir Hussen',
  bio: '†-☬_MONSTER_☬-† | Full Stack Developer & AI Enthusiast 🚀✨',
  profilePic: '/profile_avatar.jpg',
  followersCount: 2900,
  followingCount: 397,
  website: 'https://instashare.io',
  posts: [
    {
      id: 'p_1',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop',
      isVideo: false,
      likes: 1240,
      comments: 64,
      caption: 'Renaissance aesthetic floral composition 🌸🎨',
      date: '2d ago',
    },
    {
      id: 'p_2',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
      isVideo: true,
      likes: 3580,
      comments: 112,
      caption: 'Chasing misty waterfalls and wilderness heights 🌊⛰️',
      date: '4d ago',
    },
    {
      id: 'p_3',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop',
      isVideo: false,
      likes: 890,
      comments: 42,
      caption: 'Warm knit vibes in golden hour sunshine 🍂☀️',
      date: '1w ago',
    },
    {
      id: 'p_4',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
      isVideo: true,
      likes: 4120,
      comments: 156,
      caption: 'Late night coding sessions & algorithmic explorations 💻⚡',
      date: '2w ago',
    },
    {
      id: 'p_5',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
      isVideo: false,
      likes: 2150,
      comments: 88,
      caption: 'Clean React code & modern component architecture ⚛️🚀',
      date: '3w ago',
    },
    {
      id: 'p_6',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop',
      isVideo: false,
      likes: 5410,
      comments: 204,
      caption: 'Cyberpunk midnight neon streets of Tokyo 🌃✨',
      date: '1m ago',
    },
  ],
  reels: [
    {
      id: 'r_1',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-aerial-view-of-a-winding-road-in-the-middle-41584-large.mp4',
      views: '124K',
      likes: 3580,
      caption: 'Winding Mountain Roads Cinematic 4K',
    },
    {
      id: 'r_2',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-on-a-laptop-42998-large.mp4',
      views: '89.5K',
      likes: 4120,
      caption: '10x Engineering Workflow Tricks',
    },
    {
      id: 'r_3',
      thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
      views: '210K',
      likes: 5410,
      caption: 'Sunset drone loop relaxation',
    },
  ],
  saved: [
    {
      id: 's_1',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop',
      likes: 1428,
      comments: 48,
      caption: 'Python Cheat Sheet by @pycode.dev',
    },
    {
      id: 's_2',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
      likes: 2780,
      comments: 59,
      caption: 'Modern Japandi architecture and interior styling',
    },
  ],
  tagged: [
    {
      id: 't_1',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop',
      likes: 670,
      comments: 31,
      caption: 'Team collaboration workshop & hackathon finals with @mubashir_hussen.sk 🎉',
    },
  ],
}

// Get user profile
export const getUserProfile = () => {
  const saved = localStorage.getItem('instashare_user_profile')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (!parsed.profilePic || parsed.profilePic.includes('photo-1534528741775') || parsed.profilePic.includes('photo-1524504388940')) {
        parsed.profilePic = '/profile_avatar.jpg'
      }
      return parsed
    } catch {
      return DEFAULT_USER_PROFILE
    }
  }
  return DEFAULT_USER_PROFILE
}

// Save user profile
export const saveUserProfile = profile => {
  localStorage.setItem('instashare_user_profile', JSON.stringify(profile))
  window.dispatchEvent(new Event('profile_updated'))
}

// Add newly created post
export const addNewPost = newPost => {
  const profile = getUserProfile()
  const updatedPosts = [newPost, ...(profile.posts || [])]
  const updatedReels = newPost.isVideo
    ? [
        {
          id: `r_${newPost.id}`,
          thumbnail: newPost.image,
          videoUrl: newPost.videoUrl,
          views: '1',
          likes: newPost.likes || 0,
          caption: newPost.caption,
        },
        ...(profile.reels || []),
      ]
    : profile.reels || []

  const updatedProfile = {
    ...profile,
    posts: updatedPosts,
    reels: updatedReels,
  }

  saveUserProfile(updatedProfile)

  // Also save to global custom feed posts
  const customPosts = getCustomFeedPosts()
  const formattedFeedPost = {
    post_id: `user_created_${newPost.id}`,
    user_id: 'current_user',
    user_name: profile.username || 'mubashir_hussen.sk',
    profile_pic: profile.profilePic || DEFAULT_USER_PROFILE.profilePic,
    is_verified: true,
    time_ago: 'Just now',
    audio_info: newPost.audioInfo || `${profile.username} • Original Audio`,
    image_url: newPost.image,
    video_url: newPost.videoUrl || null,
    is_video: Boolean(newPost.isVideo),
    caption: newPost.caption,
    likes_count: 0,
    comments_count: 0,
    comments: [],
  }

  localStorage.setItem(
    'instashare_custom_feed_posts',
    JSON.stringify([formattedFeedPost, ...customPosts]),
  )
  window.dispatchEvent(new Event('new_post_created'))
}

// Get custom feed posts
export const getCustomFeedPosts = () => {
  const saved = localStorage.getItem('instashare_custom_feed_posts')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return parsed.map(post => {
        if (post.image_url && post.image_url.startsWith('blob:')) {
          return {
            ...post,
            image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop',
          }
        }
        return post
      })
    } catch {
      return []
    }
  }
  return []
}

// Register a new user
export const registerUser = userData => {
  const users = getRegisteredUsers()
  const exists = users.find(
    u => u.username.toLowerCase() === userData.username.toLowerCase(),
  )
  if (exists) {
    throw new Error('Username already exists! Please choose another one.')
  }

  const newUser = {
    ...userData,
    registeredAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem('instashare_registered_users', JSON.stringify(users))

  // Set as current profile if initial
  const newProfile = {
    ...DEFAULT_USER_PROFILE,
    username: userData.username,
    name: userData.fullName || userData.username,
    bio: userData.bio || 'New InstaShare explorer ✨',
    profilePic:
      userData.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop',
  }
  saveUserProfile(newProfile)
  return newUser
}

// Get list of registered users
export const getRegisteredUsers = () => {
  const saved = localStorage.getItem('instashare_registered_users')
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      return []
    }
  }
  return [
    {
      username: 'rahul',
      password: 'rahul@2021',
      fullName: 'Rahul Sharma',
    },
    {
      username: 'mubashir_hussen.sk',
      password: 'password123',
      fullName: 'Mubashir Hussen',
    },
  ]
}

// Authenticate user
export const authenticateUser = (username, password) => {
  const users = getRegisteredUsers()
  const found = users.find(
    u =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password,
  )
  return found || null
}
