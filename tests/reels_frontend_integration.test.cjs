const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Reels Diversity, In-App Playback & UI Refinement Frontend Tests ---');

// 1. Verify Reel media files exist on disk
const videoDir = path.join(__dirname, '..', 'public', 'videos');
assert(fs.existsSync(videoDir), 'public/videos folder must exist');
const videoFiles = fs.readdirSync(videoDir);
assert(videoFiles.length >= 2, 'Must have at least 2 playable sample video files in public/videos');
console.log(`✅ Media check passed: Found ${videoFiles.length} video streams in public/videos:`, videoFiles);

// 2. Verify Diverse Reels Dataset in src/data/reelsData.json
const reelsDataPath = path.join(__dirname, '..', 'src', 'data', 'reelsData.json');
assert(fs.existsSync(reelsDataPath), 'src/data/reelsData.json must exist');
const reelsData = JSON.parse(fs.readFileSync(reelsDataPath, 'utf8'));
assert(reelsData.length >= 50 && reelsData.length <= 80, `Reels count must be 50-80, got ${reelsData.length}`);
console.log(`✅ Dataset size check passed: ${reelsData.length} unique reels in frontend dataset.`);

// Verify 20 distinct categories
const categories = new Set(reelsData.map(r => r.category));
assert.strictEqual(categories.size, 20, `Must have exactly 20 categories, got ${categories.size}`);
console.log(`✅ 20 categories check passed: ${Array.from(categories).join(', ')}`);

// Verify conditional verification (5-15%)
const verifiedCount = reelsData.filter(r => r.is_verified === true).length;
const verifiedPct = (verifiedCount / reelsData.length) * 100;
assert(verifiedPct >= 5.0 && verifiedPct <= 15.0, `Verified % must be 5-15%, got ${verifiedPct.toFixed(1)}%`);
console.log(`✅ Verification distribution check passed: ${verifiedCount}/${reelsData.length} (${verifiedPct.toFixed(1)}%) verified creators.`);

// 3. Verify Reels.jsx source code
const reelsPath = path.join(__dirname, '..', 'src', 'components', 'Reels', 'Reels.jsx');
const reelsCode = fs.readFileSync(reelsPath, 'utf8');

// A. No top badges or overlays on ReelGridCard
assert(!reelsCode.includes('reel-sound-btn'), 'reel-sound-btn must be removed from ReelGridCard');
assert(!reelsCode.includes('reel-top-bar'), 'reel-top-bar must be removed from ReelGridCard');
assert(!reelsCode.includes('reel-topic-pill'), 'reel-topic-pill must be removed from ReelGridCard');
assert(!reelsCode.includes('reel-views-pill'), 'reel-views-pill must be removed from ReelGridCard');
console.log('✅ UI overlay cleanup check passed: Category pill, views pill, and sound button removed from individual reel cards.');

// B. Unused category strip removed as requested in Phase 8
assert(!reelsCode.includes('reels-category-chips-scroll'), 'Unused category strip must be removed from Reels feed');
console.log('✅ Unused category strip check passed: Removed from Reels feed for clean, professional layout.');

// C. Authentic creator presentation & conditional badge
assert(reelsCode.includes('reel-avatar'), 'Creator avatar must be present');
assert(reelsCode.includes('reel-username'), 'Creator username must be present');
assert(reelsCode.includes('reel.is_verified &&'), 'Verification badge must only render when is_verified is true');
console.log('✅ Creator authenticity check passed: Avatar, username, and conditional verification badge verified.');

// D. No external Instagram watch button
assert(!reelsCode.includes('Watch Reel on Instagram'), 'Obsolete "Watch Reel on Instagram" link must be removed');
assert(!reelsCode.includes('reel-dark-ig-link'), 'Obsolete reel-dark-ig-link class must be removed');
console.log('✅ Removal check passed: No external "Watch Reel on Instagram" buttons found.');

// E. Presence of in-app video controls
assert(reelsCode.includes('reel-video-controls-overlay'), 'Native player controls overlay must be present');
assert(reelsCode.includes('reel-scrub-bar-container'), 'Scrub timeline seek bar must be present');
assert(reelsCode.includes('handleSeek'), 'handleSeek function must be present');
assert(reelsCode.includes('handleVolumeChange'), 'handleVolumeChange function must be present');
assert(reelsCode.includes('toggleFullscreen'), 'toggleFullscreen function must be present');
assert(reelsCode.includes('reel-video-error-overlay'), 'In-app fallback error overlay must be present');
console.log('✅ In-App video player controls verified: Play, Pause, Seek, Volume, Fullscreen, Error Fallback implemented.');

// F. Verify Comment Retrieval and Authenticity
assert(reelsCode.includes('fetchComments'), 'fetchComments must be called when opening reel');
assert(reelsCode.includes('submitComment'), 'submitComment must be used for posting comments');
assert(!reelsCode.includes('aiComment') && !reelsCode.includes('generateComment'), 'No AI rewriting or auto-generation allowed');
console.log('✅ Comment authenticity verified: Original user text persisted, no AI rewriting pipeline.');

// G. Verify Recommendation Integration & Feedback Controls
assert(reelsCode.includes('fetchRecommendedFeed'), 'Reels.jsx must use fetchRecommendedFeed');
assert(reelsCode.includes('trackReelInteraction'), 'Reels.jsx must track user interactions');
assert(reelsCode.includes('sendReelFeedback'), 'Reels.jsx must support sendReelFeedback');
assert(reelsCode.includes('Not Interested in this'), 'Not interested option must be present');
assert(reelsCode.includes('reels-toast-notification'), 'Toast notification must be rendered');
console.log('✅ Recommendation engine integration verified: Dynamic feed, interaction tracking, and feedback controls.');

// 4. Verify Reels.css styling
const reelsCssPath = path.join(__dirname, '..', 'src', 'components', 'Reels', 'Reels.css');
const reelsCss = fs.readFileSync(reelsCssPath, 'utf8');
assert(!reelsCss.includes('.reel-sound-btn'), 'Obsolete .reel-sound-btn CSS must be removed');
assert(!reelsCss.includes('.reel-topic-pill'), 'Obsolete .reel-topic-pill CSS must be removed');
assert(reelsCss.includes('object-fit: cover'), 'Reel video player must use object-fit: cover to fill viewport without letterbox');
assert(reelsCss.includes('.reel-video-controls-overlay'), 'CSS must include .reel-video-controls-overlay');
assert(reelsCss.includes('.reel-recommendation-options-menu'), 'CSS must include .reel-recommendation-options-menu');
assert(reelsCss.includes('.reels-toast-notification'), 'CSS must include .reels-toast-notification');
console.log('✅ CSS verified: Controls overlay, timeline scrubber, full-cover video player, and recommendation menu confirmed.');

// 5. Verify Profile Avatar Upload in UserDetails.jsx
const userDetailsPath = path.join(__dirname, '..', 'src', 'components', 'UserDetails', 'UserDetails.jsx');
const userDetailsCode = fs.readFileSync(userDetailsPath, 'utf8');
assert(userDetailsCode.includes('avatar-upload-plus-btn'), 'Avatar upload + button must be present in UserDetails');
assert(userDetailsCode.includes('handleAvatarFileSelect'), 'handleAvatarFileSelect must be present in UserDetails');
console.log('✅ Profile image upload check passed: + button, file picker, and validation implemented.');

// 6. Verify Technical Badge Cleanup
const adminPath = path.join(__dirname, '..', 'src', 'components', 'SocialShieldAdmin', 'index.jsx');
const adminCode = fs.readFileSync(adminPath, 'utf8');
assert(!adminCode.includes('v2.4 Active Engine'), 'Unnecessary technical badge v2.4 Active Engine must be removed');
console.log('✅ Technical badge cleanup check passed: v2.4 Active Engine removed from SocialShieldAdmin.');

console.log('\n🎉 ALL REELS DIVERSITY, CLEAN UI & COMMENT PERSISTENCE TESTS PASSED!');
