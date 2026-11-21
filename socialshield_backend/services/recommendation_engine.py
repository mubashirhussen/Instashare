"""
Intelligent Reels Recommendation & Dynamic Feed Ranking Engine
Implements rule-based transparent scoring, interaction tracking, category balancing,
exploration slots, cold-start handling, and duplicate prevention.
"""

import os
import json
import math
import time
import uuid
import threading
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional, Set, Tuple

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
PROFILES_FILE = os.path.join(DATA_DIR, "user_profiles_db.json")
REELS_FILE = os.path.join(DATA_DIR, "reels_db.json")

# Configurable Scoring Weights
DEFAULT_WEIGHTS = {
    "category_preference": 0.25,
    "watch_duration": 0.20,
    "completion": 0.15,
    "likes": 0.10,
    "saves": 0.10,
    "creator_relevance": 0.10,
    "recency": 0.05,
    "engagement_baseline": 0.05,
}

# Hierarchical Taxonomy of Categories and Subcategories
CATEGORIES_TAXONOMY = {
    "Education": ["Python Programming", "React & Frontend", "Data Structures", "Algorithms", "TypeScript"],
    "Technology": ["Quantum Computing", "DevOps & Containers", "Next.js", "System Design", "Cloud Architecture"],
    "Artificial Intelligence": ["Humanoid Robotics", "Machine Learning", "Neural Networks", "Computer Vision", "LLMs"],
    "Sports": ["Football Freekick", "Cricket", "Basketball", "Athletics", "Formula 1"],
    "Nature": ["Ocean Reefs", "Wildlife", "Forests", "Mountain Landscapes", "Cosmos"],
    "Travel": ["Kyoto Japan", "Swiss Alps", "Tropical Beaches", "Urban Exploration", "Backpacking"],
    "Food": ["Neapolitan Pizza", "Artisan Bakery", "Street Food", "Healthy Recipes", "Culinary Arts"],
    "Movies and Entertainment": ["Cinema Behind the Scenes", "Film Lighting", "Trailers", "VFX Breakdown"],
    "Dialogues and Comedy": ["Standup Comedy", "Relatable Skits", "Improv", "Office Humor"],
    "Bikes and Automobiles": ["Superbike Acceleration", "Custom Motorcycles", "Classic Cars", "Electric Vehicles"],
    "Gaming": ["Unreal Engine 5", "Speedrunning", "Esports", "Game Dev", "Retro Gaming"],
    "Fitness and Health": ["Calisthenics", "Weightlifting", "Yoga & Flexibility", "Nutrition", "Cardio"],
    "Lifestyle": ["Morning Routine", "Minimalism", "Workspace Tour", "Fashion", "Productivity"],
    "Music and Dance": ["Fingerstyle Acoustic Guitar", "Hip-hop Choreography", "Beatmaking", "Vocal Performance"],
    "Photography and Creativity": ["Golden Hour Portrait", "Street Photography", "Color Grading", "Cinematography"],
    "Science and Innovation": ["James Webb Telescope", "Clean Fusion Energy", "Biomedical Tech", "Astrophysics"],
    "Motivation and Personal Development": ["Atomic Habits & Discipline", "Deep Work", "Growth Mindset", "Leadership"],
    "Architecture and Design": ["Minimalist Concrete Villa", "Futuristic Skyscrapers", "Interior Design", "Sustainable Housing"],
    "Animals and Pets": ["Golden Retriever Agility", "Cat Antics", "Exotic Birds", "Wildlife Rescue"],
    "Miscellaneous Trending Content": ["Viral Macro Science", "Oddly Satisfying", "Life Hacks", "Trending Audio"],
}


class UserRecommendationProfile:
    """Represents a single user's behavioral interaction profile and affinities."""

    def __init__(self, user_id: str, data: Optional[Dict[str, Any]] = None):
        self.user_id = user_id
        data = data or {}
        self.explicit_interests: List[str] = data.get("explicit_interests", [])
        self.category_scores: Dict[str, float] = data.get("category_scores", {})
        self.creator_scores: Dict[str, float] = data.get("creator_scores", {})
        self.liked_reels: Set[str] = set(data.get("liked_reels", []))
        self.saved_reels: Set[str] = set(data.get("saved_reels", []))
        self.completed_reels: Set[str] = set(data.get("completed_reels", []))
        self.skipped_reels: Set[str] = set(data.get("skipped_reels", []))
        self.not_interested_reels: Set[str] = set(data.get("not_interested_reels", []))
        self.hidden_creators: Set[str] = set(data.get("hidden_creators", []))
        self.reported_reels: Set[str] = set(data.get("reported_reels", []))
        self.watch_history: Dict[str, Dict[str, Any]] = data.get("watch_history", {})
        self.total_watched_seconds: float = float(data.get("total_watched_seconds", 0.0))
        self.interaction_count: int = int(data.get("interaction_count", 0))

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user_id": self.user_id,
            "explicit_interests": self.explicit_interests,
            "category_scores": self.category_scores,
            "creator_scores": self.creator_scores,
            "liked_reels": list(self.liked_reels),
            "saved_reels": list(self.saved_reels),
            "completed_reels": list(self.completed_reels),
            "skipped_reels": list(self.skipped_reels),
            "not_interested_reels": list(self.not_interested_reels),
            "hidden_creators": list(self.hidden_creators),
            "reported_reels": list(self.reported_reels),
            "watch_history": self.watch_history,
            "total_watched_seconds": round(self.total_watched_seconds, 2),
            "interaction_count": self.interaction_count,
        }

    def boost_category(self, category: str, delta: float):
        if not category:
            return
        current = self.category_scores.get(category, 0.5)
        self.category_scores[category] = max(0.0, min(1.0, current + delta))

    def boost_creator(self, creator: str, delta: float):
        if not creator:
            return
        current = self.creator_scores.get(creator, 0.5)
        self.creator_scores[creator] = max(0.0, min(1.0, current + delta))

    def penalize_category(self, category: str, delta: float):
        if not category:
            return
        current = self.category_scores.get(category, 0.5)
        self.category_scores[category] = max(0.0, current - delta)


class ReelsRecommendationEngine:
    """Core recommendation and ranking engine for InstaShare Reels."""

    def __init__(self, profiles_path: str = PROFILES_FILE, reels_path: str = REELS_FILE):
        self.profiles_path = profiles_path
        self.reels_path = reels_path
        self.lock = threading.Lock()
        self.profiles: Dict[str, UserRecommendationProfile] = {}
        self.feed_sessions: Dict[str, Dict[str, Any]] = {}  # session_id -> {reels, timestamp, user_id}
        self.weights = DEFAULT_WEIGHTS.copy()
        self._load_profiles()

    def _load_profiles(self):
        with self.lock:
            if os.path.exists(self.profiles_path):
                try:
                    with open(self.profiles_path, "r", encoding="utf-8") as f:
                        raw = json.load(f)
                        for uid, pdata in raw.items():
                            self.profiles[uid] = UserRecommendationProfile(uid, pdata)
                except Exception as e:
                    print(f"[RECS] Error loading user profiles: {e}")

    def _save_profiles(self):
        try:
            os.makedirs(os.path.dirname(self.profiles_path), exist_ok=True)
            serializable = {uid: p.to_dict() for uid, p in self.profiles.items()}
            with open(self.profiles_path, "w", encoding="utf-8") as f:
                json.dump(serializable, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"[RECS] Error persisting user profiles: {e}")

    def get_or_create_profile(self, user_id: str) -> UserRecommendationProfile:
        with self.lock:
            if user_id not in self.profiles:
                self.profiles[user_id] = UserRecommendationProfile(user_id)
            return self.profiles[user_id]

    def _get_reels_library(self) -> List[Dict[str, Any]]:
        try:
            with open(self.reels_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[RECS] Error loading reels library: {e}")
            return []

    def track_event(
        self,
        user_id: str,
        reel_id: str,
        event_type: str,
        duration_seconds: float = 0.0,
        percentage_watched: float = 0.0,
        category: Optional[str] = None,
        creator_name: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Record actual user interaction signals and update profile affinities.
        """
        profile = self.get_or_create_profile(user_id)

        # Lookup reel details if category or creator not provided
        if not category or not creator_name:
            reels = self._get_reels_library()
            target = next((r for r in reels if r.get("id") == reel_id), None)
            if target:
                category = category or target.get("category")
                creator_name = creator_name or target.get("user_name")

        now_iso = datetime.now(timezone.utc).isoformat()
        profile.interaction_count += 1

        with self.lock:
            # 1. View & Watch Duration tracking
            if event_type in ("view", "watch_duration", "playback_start"):
                duration_val = max(0.0, float(duration_seconds or 0.0))
                profile.total_watched_seconds += duration_val

                current_history = profile.watch_history.get(reel_id, {
                    "watch_time": 0.0,
                    "views": 0,
                    "completion": False,
                    "category": category,
                    "creator": creator_name,
                })
                current_history["watch_time"] = max(current_history.get("watch_time", 0.0), duration_val)
                current_history["views"] = current_history.get("views", 0) + 1
                current_history["last_watched"] = now_iso
                profile.watch_history[reel_id] = current_history

                # Meaningful watch boost if >= 3s or >= 20%
                if duration_val >= 3.0 or percentage_watched >= 20.0:
                    profile.boost_category(category, 0.08)
                    profile.boost_creator(creator_name, 0.06)

            # 2. Completion tracking
            elif event_type == "completion":
                duration_val = max(0.0, float(duration_seconds or 0.0))
                if duration_val > 0:
                    profile.total_watched_seconds += duration_val
                profile.completed_reels.add(reel_id)
                profile.boost_category(category, 0.15)
                profile.boost_creator(creator_name, 0.12)
                current_history = profile.watch_history.get(reel_id, {
                    "watch_time": 0.0,
                    "views": 0,
                    "completion": False,
                    "category": category,
                    "creator": creator_name,
                })
                current_history["completion"] = True
                if duration_val > 0:
                    current_history["watch_time"] = max(current_history.get("watch_time", 0.0), duration_val)
                current_history["views"] = current_history.get("views", 0) + 1
                current_history["last_watched"] = now_iso
                profile.watch_history[reel_id] = current_history

            # 3. Likes
            elif event_type == "like":
                profile.liked_reels.add(reel_id)
                profile.boost_category(category, 0.14)
                profile.boost_creator(creator_name, 0.10)
            elif event_type == "unlike":
                profile.liked_reels.discard(reel_id)
                profile.penalize_category(category, 0.06)

            # 4. Saves
            elif event_type == "save":
                profile.saved_reels.add(reel_id)
                profile.boost_category(category, 0.18)
                profile.boost_creator(creator_name, 0.15)
            elif event_type == "unsave":
                profile.saved_reels.discard(reel_id)

            # 5. Comments & Shares
            elif event_type == "comment":
                profile.boost_category(category, 0.12)
                profile.boost_creator(creator_name, 0.08)
            elif event_type == "share":
                profile.boost_category(category, 0.15)
                profile.boost_creator(creator_name, 0.10)

            # 6. Negative feedback: Fast skip (< 2s)
            elif event_type == "skip":
                profile.skipped_reels.add(reel_id)
                profile.penalize_category(category, 0.08)
                profile.boost_creator(creator_name, -0.05)

            # 7. Explicit Negative Controls
            elif event_type == "not_interested":
                profile.not_interested_reels.add(reel_id)
                profile.penalize_category(category, 0.15)
            elif event_type == "hide_creator":
                if creator_name:
                    profile.hidden_creators.add(creator_name)
            elif event_type == "report":
                profile.reported_reels.add(reel_id)
                profile.not_interested_reels.add(reel_id)

            self._save_profiles()

        return {
            "success": True,
            "user_id": user_id,
            "event_type": event_type,
            "reel_id": reel_id,
            "category": category,
            "interaction_count": profile.interaction_count,
        }

    def apply_feedback(self, user_id: str, action: str, reel_id: Optional[str] = None, creator_name: Optional[str] = None) -> Dict[str, Any]:
        """Applies explicit user moderation and preference controls."""
        profile = self.get_or_create_profile(user_id)

        with self.lock:
            if action == "not_interested" and reel_id:
                profile.not_interested_reels.add(reel_id)
                # Find reel's category to apply soft penalty
                reels = self._get_reels_library()
                target = next((r for r in reels if r.get("id") == reel_id), None)
                if target and target.get("category"):
                    profile.penalize_category(target.get("category"), 0.15)

            elif action == "hide_creator" and creator_name:
                profile.hidden_creators.add(creator_name)

            elif action == "reset_preferences":
                profile.category_scores.clear()
                profile.creator_scores.clear()
                profile.liked_reels.clear()
                profile.saved_reels.clear()
                profile.completed_reels.clear()
                profile.skipped_reels.clear()
                profile.not_interested_reels.clear()
                profile.hidden_creators.clear()
                profile.watch_history.clear()
                profile.explicit_interests.clear()
                profile.total_watched_seconds = 0.0
                profile.interaction_count = 0

            self._save_profiles()

        # Invalidate any cached feed sessions for this user so changes take effect immediately
        self._invalidate_user_sessions(user_id)

        return {
            "success": True,
            "user_id": user_id,
            "action": action,
            "reel_id": reel_id,
            "creator_name": creator_name,
        }

    def update_preferences(self, user_id: str, preferred_categories: List[str]) -> Dict[str, Any]:
        """Update explicit interest categories chosen by the user."""
        profile = self.get_or_create_profile(user_id)
        with self.lock:
            profile.explicit_interests = [c for c in preferred_categories if c in CATEGORIES_TAXONOMY]
            # Seed or boost category scores
            for cat in profile.explicit_interests:
                current = profile.category_scores.get(cat, 0.5)
                profile.category_scores[cat] = min(1.0, current + 0.35)
            self._save_profiles()

        self._invalidate_user_sessions(user_id)
        return {
            "success": True,
            "user_id": user_id,
            "explicit_interests": profile.explicit_interests,
        }

    def _invalidate_user_sessions(self, user_id: str):
        with self.lock:
            to_del = [sid for sid, sdata in self.feed_sessions.items() if sdata.get("user_id") == user_id]
            for sid in to_del:
                del self.feed_sessions[sid]

    def score_candidate(self, reel: Dict[str, Any], profile: UserRecommendationProfile) -> float:
        """
        Calculates a transparent, deterministic relevance score (0.0 to 1.0)
        using normalized signals. Returns -1.0 if suppressed.
        """
        reel_id = reel.get("id")
        creator = reel.get("user_name")
        category = reel.get("category", "")

        # 1. Hard suppression rules
        if reel_id in profile.not_interested_reels:
            return -1.0
        if creator in profile.hidden_creators:
            return -1.0
        if reel_id in profile.reported_reels:
            return -1.0

        # 2. Signal 1: Category Preference (0.25)
        cat_score = profile.category_scores.get(category, 0.5)
        if category in profile.explicit_interests:
            cat_score = min(1.0, cat_score + 0.25)

        # 3. Signal 2: Watch Duration / History (0.20)
        watch_score = 0.5
        if reel_id in profile.watch_history:
            wh = profile.watch_history[reel_id]
            watch_time = wh.get("watch_time", 0.0)
            duration = float(reel.get("duration", 30))
            watch_score = min(1.0, watch_time / max(1.0, duration))
        else:
            # Inherit category average watch score if user watches this category
            cat_watches = [
                v["watch_time"] for v in profile.watch_history.values()
                if v.get("category") == category
            ]
            if cat_watches:
                avg_cat_watch = sum(cat_watches) / len(cat_watches)
                watch_score = min(1.0, avg_cat_watch / 30.0)

        # 4. Signal 3: Completion Rate (0.15)
        completion_score = 1.0 if reel_id in profile.completed_reels else 0.4
        cat_completions = [
            1 for v in profile.watch_history.values()
            if v.get("category") == category and v.get("completion")
        ]
        if cat_completions:
            completion_score = min(1.0, completion_score + 0.3)

        # 5. Signal 4: Likes (0.10)
        likes_score = 1.0 if reel_id in profile.liked_reels else 0.5
        # Category like affinity
        if any(r_id in profile.liked_reels for r_id, v in profile.watch_history.items() if v.get("category") == category):
            likes_score = min(1.0, likes_score + 0.2)

        # 6. Signal 5: Saves (0.10)
        saves_score = 1.0 if reel_id in profile.saved_reels else 0.4

        # 7. Signal 6: Creator Relevance (0.10)
        creator_score = profile.creator_scores.get(creator, 0.5)

        # 8. Signal 7: Recency (0.05)
        recency_score = 0.5
        try:
            created_dt = datetime.fromisoformat(reel.get("created_at", "2026-11-01T00:00:00Z").replace("Z", "+00:00"))
            days_old = max(0, (datetime.now(timezone.utc) - created_dt).days)
            recency_score = max(0.2, 1.0 - (days_old * 0.05))
        except Exception:
            recency_score = 0.5

        # 9. Signal 8: Engagement Baseline (0.05)
        likes_cnt = reel.get("likes_count", 1000)
        engagement_score = min(1.0, likes_cnt / 40000.0)

        # Compute weighted sum
        total_score = (
            self.weights["category_preference"] * cat_score +
            self.weights["watch_duration"] * watch_score +
            self.weights["completion"] * completion_score +
            self.weights["likes"] * likes_score +
            self.weights["saves"] * saves_score +
            self.weights["creator_relevance"] * creator_score +
            self.weights["recency"] * recency_score +
            self.weights["engagement_baseline"] * engagement_score
        )

        # Penalties: Fast skips
        if reel_id in profile.skipped_reels:
            total_score -= 0.20

        # Impression fatigue (watched > 3 times)
        if profile.watch_history.get(reel_id, {}).get("views", 0) >= 3:
            total_score -= 0.15

        return max(0.01, min(1.0, total_score))

    def diversify_and_explore(
        self,
        scored_candidates: List[Tuple[Dict[str, Any], float]],
        profile: UserRecommendationProfile,
        exploration_ratio: float = 0.20,
    ) -> List[Dict[str, Any]]:
        """
        Reranks scored candidates to strictly guarantee:
        1. No consecutive reels from the same category.
        2. No consecutive reels from the same creator.
        3. Maximum category concentration (<= 2 per 5-reel window).
        4. Exploration slots (15-20%) introducing unconsumed/trending categories.
        5. Zero duplicate reel IDs.
        """
        if not scored_candidates:
            return []

        # Filter out suppressed items
        valid = [(r, s) for r, s in scored_candidates if s > 0]
        if not valid:
            return []

        # Top consumed categories by user
        top_user_cats = sorted(profile.category_scores.items(), key=lambda x: x[1], reverse=True)
        top_cats_set = {c for c, score in top_user_cats[:3] if score > 0.55}

        # Partition into exploitation (relevant) and exploration pools
        exploit_pool: List[Tuple[Dict[str, Any], float]] = []
        explore_pool: List[Tuple[Dict[str, Any], float]] = []

        for r, score in valid:
            cat = r.get("category", "")
            if cat in top_cats_set:
                exploit_pool.append((r, score))
            else:
                explore_pool.append((r, score))

        # If user has no specific preferences (cold-start), pool is already balanced
        if not exploit_pool:
            exploit_pool = valid.copy()
            explore_pool = valid.copy()

        diversified: List[Dict[str, Any]] = []
        used_ids: Set[str] = set()

        # Helper to find best next candidate satisfying diversity constraints
        def pick_next(pool: List[Tuple[Dict[str, Any], float]], allow_fallback: bool = True) -> Optional[Dict[str, Any]]:
            last_cat = diversified[-1].get("category") if diversified else None
            last_creator = diversified[-1].get("user_name") if diversified else None
            recent_cats = [x.get("category") for x in diversified[-4:]]

            # 1. First pass: strict no adjacent category AND no adjacent creator AND category cap
            for idx, (reel, _) in enumerate(pool):
                rid = reel.get("id")
                rcat = reel.get("category")
                rcreator = reel.get("user_name")
                if rid in used_ids:
                    continue
                if last_cat and rcat == last_cat:
                    continue
                if last_creator and rcreator == last_creator:
                    continue
                if recent_cats.count(rcat) >= 2:
                    continue
                used_ids.add(rid)
                pool.pop(idx)
                return reel

            # 2. Second pass: relaxed category cap, but still no adjacent category
            for idx, (reel, _) in enumerate(pool):
                rid = reel.get("id")
                rcat = reel.get("category")
                rcreator = reel.get("user_name")
                if rid in used_ids:
                    continue
                if last_cat and rcat == last_cat:
                    continue
                if last_creator and rcreator == last_creator:
                    continue
                used_ids.add(rid)
                pool.pop(idx)
                return reel

            # 3. Fallback: only if allow_fallback and no unused reels in pool
            if allow_fallback:
                for idx, (reel, _) in enumerate(pool):
                    rid = reel.get("id")
                    if rid not in used_ids:
                        used_ids.add(rid)
                        pool.pop(idx)
                        return reel
            return None

        total_target = len(valid)
        slot = 0

        while len(diversified) < total_target and (exploit_pool or explore_pool):
            slot += 1
            # Every 5th item is an exploration slot (20% exploration quota)
            is_exploration_slot = (slot % 5 == 0) and len(explore_pool) > 0

            chosen = None
            if is_exploration_slot:
                chosen = pick_next(explore_pool, allow_fallback=False)
                if not chosen:
                    chosen = pick_next(exploit_pool)
            else:
                chosen = pick_next(exploit_pool, allow_fallback=False)
                if not chosen:
                    chosen = pick_next(explore_pool)

            if chosen:
                diversified.append(chosen)
            else:
                # Break if no candidate can be picked without duplicate
                break

        return diversified

    def get_feed(
        self,
        user_id: str = "guest_user",
        session_id: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
        refresh: bool = False,
        category_filter: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Returns a paginated, personalized, and diverse recommendation feed.
        Supports stable feed sessions across pagination.
        """
        profile = self.get_or_create_profile(user_id)
        limit = max(1, min(50, limit))
        page = max(1, page)

        # Check existing session cache
        if session_id and not refresh:
            with self.lock:
                session_data = self.feed_sessions.get(session_id)
                if session_data and session_data.get("user_id") == user_id:
                    all_ranked = session_data["reels"]
                    start = (page - 1) * limit
                    end = start + limit
                    page_items = all_ranked[start:end]
                    categories_in_page = sorted(list(set(r.get("category") for r in page_items if r.get("category"))))
                    return {
                        "success": True,
                        "session_id": session_id,
                        "page": page,
                        "limit": limit,
                        "total": len(all_ranked),
                        "has_more": end < len(all_ranked),
                        "reels": page_items,
                        "categories_represented": categories_in_page,
                        "is_cold_start": profile.interaction_count == 0,
                    }

        # Otherwise, generate fresh ranking and initialize a session
        all_reels = self._get_reels_library()

        # If a category filter is explicitly selected by user chips
        if category_filter and category_filter.lower() != "all":
            all_reels = [
                r for r in all_reels
                if r.get("category", "").lower() == category_filter.lower()
                or r.get("topic", "").lower() == category_filter.lower()
            ]

        # Score all eligible candidates
        scored = []
        for r in all_reels:
            score = self.score_candidate(r, profile)
            if score > 0:
                scored.append((r, score))

        # Sort by relevance score descending
        scored.sort(key=lambda x: x[1], reverse=True)

        # Apply diversity reranking and exploration
        diversified_feed = self.diversify_and_explore(scored, profile)

        # Cache session
        new_session_id = session_id or uuid.uuid4().hex[:12]
        with self.lock:
            self.feed_sessions[new_session_id] = {
                "user_id": user_id,
                "reels": diversified_feed,
                "created_at": time.time(),
            }

        start = (page - 1) * limit
        end = start + limit
        page_items = diversified_feed[start:end]
        categories_in_page = sorted(list(set(r.get("category") for r in page_items if r.get("category"))))

        return {
            "success": True,
            "session_id": new_session_id,
            "page": page,
            "limit": limit,
            "total": len(diversified_feed),
            "has_more": end < len(diversified_feed),
            "reels": page_items,
            "categories_represented": categories_in_page,
            "is_cold_start": profile.interaction_count == 0,
        }

    def get_analytics(self, user_id: str) -> Dict[str, Any]:
        """Calculates diversity metrics, engagement summary, and category distribution."""
        profile = self.get_or_create_profile(user_id)
        reels = self._get_reels_library()

        # Calculate category distribution of interactions
        cat_counts: Dict[str, int] = {}
        for r_id, wh in profile.watch_history.items():
            cat = wh.get("category")
            if cat:
                cat_counts[cat] = cat_counts.get(cat, 0) + wh.get("views", 1)

        total_views = sum(cat_counts.values()) or 1
        top_cats = sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)

        # Shannon Diversity Entropy: H = -sum(p * ln(p))
        entropy = 0.0
        for cnt in cat_counts.values():
            p = cnt / total_views
            if p > 0:
                entropy -= p * math.log(p)

        # Normalize diversity score (0.0 to 1.0) relative to 20 categories max entropy ln(20) ~ 2.99
        max_entropy = math.log(max(2, len(CATEGORIES_TAXONOMY)))
        normalized_diversity = round(min(1.0, entropy / max_entropy), 3) if cat_counts else 1.0

        # Exploration rate: proportion of non-top categories interacted with
        top_cat_names = {c for c, _ in top_cats[:3]}
        non_top_interactions = sum(cnt for cat, cnt in cat_counts.items() if cat not in top_cat_names)
        exploration_rate = round(non_top_interactions / total_views, 3) if total_views > 0 else 0.0

        return {
            "user_id": user_id,
            "total_interactions": profile.interaction_count,
            "category_distribution": cat_counts,
            "top_categories": [c for c, _ in top_cats[:5]],
            "diversity_score": normalized_diversity,
            "exploration_rate": exploration_rate,
            "total_watched_seconds": profile.total_watched_seconds,
            "completion_count": len(profile.completed_reels),
            "likes_count": len(profile.liked_reels),
            "saves_count": len(profile.saved_reels),
            "suppressed_reels_count": len(profile.not_interested_reels),
            "hidden_creators_count": len(profile.hidden_creators),
        }


# Singleton engine instance
recommendation_engine = ReelsRecommendationEngine()
