/**
 * Comment Submission & Moderation Pipeline Service
 * Enforces pre-publish moderation, authentic original text preservation, and persistence
 */
import { checkTextToxicityLocal, saveModerationLog } from './socialShieldAI'

const BACKEND_API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://socialshield-backend.onrender.com'
    : 'http://localhost:8000')

const USER_FRIENDLY_MODERATION_ERROR =
  'Your comment contains inappropriate or unparliamentary language. Please edit your comment and try again.'

/**
 * Retrieves persisted authentic comments for a post or reel.
 * Queries backend first; falls back to synchronized localStorage store.
 * @param {string} postId - Post or reel ID
 * @returns {Promise<{ success: boolean, comments: Array<Object> }>}
 */
export const fetchComments = async (postId) => {
  const localKey = `instashare_comments_${postId}`
  let localComments = []
  try {
    const raw = localStorage.getItem(localKey)
    if (raw) {
      localComments = JSON.parse(raw)
    }
  } catch {
    localComments = []
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1800)

    const response = await fetch(`${BACKEND_API_BASE}/api/comments?post_id=${encodeURIComponent(postId)}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data.comments) && data.comments.length > 0) {
        // Map backend comments to standard client comment format
        const formatted = data.comments.map(c => ({
          id: c.id,
          username: c.user_name || 'user',
          avatar: c.avatar || '/profile_avatar.jpg',
          text: c.content || c.comment || '',
          time: c.created_at ? 'Recently' : 'Just now',
          likes: c.likes || 0,
        }))
        localStorage.setItem(localKey, JSON.stringify(formatted))
        return { success: true, comments: formatted }
      }
    }
  } catch {
    // If backend is unreachable, rely on local cached comments
  }

  return { success: true, comments: localComments }
}

/**
 * Submits and moderates a comment in real-time.
 * Guarantees original user-written text is submitted verbatim without AI rewriting.
 * @param {Object} params
 * @param {string} params.postId - Post or reel ID
 * @param {string} params.text - Original user comment text
 * @param {string} params.author - Username of commenter
 * @param {string} [params.context='comment'] - Comment context ('comment' | 'reel_comment')
 * @returns {Promise<{ success: boolean, code?: string, message?: string, comment?: Object, moderation?: Object }>}
 */
export const submitComment = async ({
  postId,
  text = '',
  author = 'current_user',
  context = 'comment',
}) => {
  const trimmed = (text || '').trim()

  // 1. Frontend Validation
  if (!trimmed) {
    return {
      success: false,
      code: 'EMPTY_COMMENT',
      message: 'Comment cannot be empty.',
    }
  }

  if (trimmed.length > 500) {
    return {
      success: false,
      code: 'COMMENT_TOO_LONG',
      message: 'Comment cannot exceed 500 characters.',
    }
  }

  // 2. Immediate Local Pre-Screening (Fast zero-DOM-leak gate using 2,100 multilingual dataset)
  const localCheck = checkTextToxicityLocal(trimmed, context)
  if (localCheck.isToxic) {
    saveModerationLog({
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      contentType: 'comment',
      context,
      contentSample: trimmed.length > 80 ? trimmed.slice(0, 80) + '...' : trimmed,
      fullContent: trimmed,
      author,
      status: 'BLOCKED',
      isToxic: true,
      toxicityScore: localCheck.toxicityScore,
      confidence: localCheck.confidence,
      categories: localCheck.categories,
      reason: localCheck.reason,
      timestamp: new Date().toISOString(),
    })

    return {
      success: false,
      code: 'COMMENT_MODERATION_REJECTED',
      message: USER_FRIENDLY_MODERATION_ERROR,
      moderation: {
        blocked: true,
        categories: localCheck.categories || [],
      },
    }
  }

  // 3. Backend Verification & Persistence Gateway
  let savedCommentItem = null
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1800)

    const response = await fetch(`${BACKEND_API_BASE}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: String(postId || 'post'),
        content: trimmed,
        user: author,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (response.status === 422) {
      const errorData = await response.json().catch(() => ({}))
      return {
        success: false,
        code: errorData.code || 'COMMENT_MODERATION_REJECTED',
        message: USER_FRIENDLY_MODERATION_ERROR,
        moderation: errorData.moderation || { blocked: true },
      }
    }

    if (response.ok) {
      const data = await response.json()
      savedCommentItem = data.comment
    }
  } catch {
    // If backend is unreachable or timed out, and local evaluation verified safe:
    // Safely allow approved local comment
  }

  const clientComment = {
    id: savedCommentItem?.id || `c_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    username: author,
    avatar: '/profile_avatar.jpg',
    text: trimmed, // Exact user-submitted text preserved verbatim
    time: 'Just now',
    likes: 0,
    created_at: savedCommentItem?.created_at || new Date().toISOString(),
    moderation_status: 'approved',
  }

  // Synchronize to localStorage for offline persistence
  try {
    const localKey = `instashare_comments_${postId}`
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]')
    localStorage.setItem(localKey, JSON.stringify([...existing, clientComment]))
  } catch {
    // LocalStorage quota or parsing fallback
  }

  // Safe Approved Outcome
  return {
    success: true,
    comment: clientComment,
  }
}
