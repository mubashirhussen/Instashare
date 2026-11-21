/**
 * Reels Recommendation & Interaction Tracking Service
 * Integrates directly with the intelligent dynamic feed ranking engine.
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://socialshield-backend.onrender.com'
    : 'http://localhost:8000')

/**
 * Fetch personalized, dynamic recommendation feed.
 */
export async function fetchRecommendedFeed({
  userId = 'guest_user',
  sessionId = null,
  page = 1,
  limit = 10,
  refresh = false,
  category = null,
} = {}) {
  try {
    const params = new URLSearchParams({
      user_id: userId,
      page: String(page),
      limit: String(limit),
      refresh: String(refresh),
    })
    if (sessionId) params.append('session_id', sessionId)
    if (category && category !== 'All') params.append('category', category)

    const res = await fetch(`${API_BASE_URL}/api/reels/feed?${params.toString()}`)
    if (!res.ok) {
      throw new Error(`Feed fetch failed: HTTP ${res.status}`)
    }
    return await res.json()
  } catch (error) {
    console.warn('[RECS] Failed to fetch dynamic feed from backend, falling back:', error)
    return null
  }
}

/**
 * Track user interaction event (view, watch_duration, completion, like, save, comment, etc.)
 */
export async function trackReelInteraction({
  userId = 'guest_user',
  reelId,
  eventType,
  durationSeconds = 0,
  percentageWatched = 0,
  category = null,
  creatorName = null,
}) {
  if (!reelId || !eventType) return
  try {
    const payload = {
      user_id: userId,
      reel_id: reelId,
      event_type: eventType,
      duration_seconds: Number(durationSeconds) || 0,
      percentage_watched: Number(percentageWatched) || 0,
      category,
      creator_name: creatorName,
      timestamp: new Date().toISOString(),
    }
    await fetch(`${API_BASE_URL}/api/reels/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (e) {
    // Non-blocking interaction tracking: silent warning
    console.debug('[RECS] Interaction track error:', e)
  }
}

/**
 * Send user moderation feedback (not_interested, hide_creator, reset_preferences)
 */
export async function sendReelFeedback({
  userId = 'guest_user',
  action,
  reelId = null,
  creatorName = null,
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reels/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        action,
        reel_id: reelId,
        creator_name: creatorName,
      }),
    })
    return await res.json()
  } catch (error) {
    console.warn('[RECS] Feedback error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Fetch recommendation analytics (diversity score, category distribution, watch time)
 */
export async function fetchReelsAnalytics(userId = 'guest_user') {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reels/analytics?user_id=${encodeURIComponent(userId)}`)
    if (res.ok) return await res.json()
    return null
  } catch {
    return null
  }
}
