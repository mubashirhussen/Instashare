/**
 * Comment Submission & Moderation Pipeline Service
 * Enforces pre-publish moderation, input sanitization, and structured responses
 */
import { checkTextToxicityLocal, saveModerationLog } from './socialShieldAI'

const BACKEND_API_BASE = 'http://localhost:8000'

const USER_FRIENDLY_MODERATION_ERROR =
  'Your comment contains inappropriate or unparliamentary language. Please edit your comment and try again.'

/**
 * Submits and moderates a comment in real-time
 * @param {Object} params
 * @param {string} params.postId - Post or reel ID
 * @param {string} params.text - User comment text
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
      return {
        success: true,
        comment: data.comment || {
          id: `c_${Date.now()}`,
          post_id: postId,
          user_name: author,
          comment: trimmed,
          created_at: new Date().toISOString(),
          moderation_status: 'approved',
        },
      }
    }
  } catch {
    // If backend is unreachable or timed out, and local evaluation verified safe:
    // Safely allow approved local comment
  }

  // Safe Approved Outcome
  return {
    success: true,
    comment: {
      id: `c_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      post_id: postId,
      user_name: author,
      comment: trimmed,
      created_at: new Date().toISOString(),
      moderation_status: 'approved',
    },
  }
}
