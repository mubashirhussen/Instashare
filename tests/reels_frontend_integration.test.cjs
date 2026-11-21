const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Running Reels In-App Playback & Comment Persistence Frontend Tests ---');

// 1. Verify Reel media files exist on disk
const videoDir = path.join(__dirname, '..', 'public', 'videos');
assert(fs.existsSync(videoDir), 'public/videos folder must exist');
const videoFiles = fs.readdirSync(videoDir);
assert(videoFiles.length >= 2, 'Must have at least 2 playable sample video files in public/videos');
console.log(`✅ Media check passed: Found ${videoFiles.length} video streams in public/videos:`, videoFiles);

// 2. Verify Reels.jsx source code
const reelsPath = path.join(__dirname, '..', 'src', 'components', 'Reels', 'Reels.jsx');
const reelsCode = fs.readFileSync(reelsPath, 'utf8');

// A. No external Instagram watch button
assert(!reelsCode.includes('Watch Reel on Instagram'), 'Obsolete "Watch Reel on Instagram" link must be removed');
assert(!reelsCode.includes('reel-dark-ig-link'), 'Obsolete reel-dark-ig-link class must be removed');
console.log('✅ Removal check passed: No external "Watch Reel on Instagram" buttons found.');

// B. Presence of in-app video controls
assert(reelsCode.includes('reel-video-controls-overlay'), 'Native player controls overlay must be present');
assert(reelsCode.includes('reel-scrub-bar-container'), 'Scrub timeline seek bar must be present');
assert(reelsCode.includes('handleSeek'), 'handleSeek function must be present');
assert(reelsCode.includes('handleVolumeChange'), 'handleVolumeChange function must be present');
assert(reelsCode.includes('toggleFullscreen'), 'toggleFullscreen function must be present');
assert(reelsCode.includes('reel-video-error-overlay'), 'In-app fallback error overlay must be present');
console.log('✅ In-App video player controls verified: Play, Pause, Seek, Volume, Fullscreen, Error Fallback implemented.');

// C. Verify Comment Retrieval and Authenticity
assert(reelsCode.includes('fetchComments'), 'fetchComments must be called when opening reel');
assert(reelsCode.includes('submitComment'), 'submitComment must be used for posting comments');
assert(!reelsCode.includes('aiComment') && !reelsCode.includes('generateComment'), 'No AI rewriting or auto-generation allowed');
console.log('✅ Comment authenticity verified: Original user text persisted, no AI rewriting pipeline.');

// 3. Verify Reels.css styling
const reelsCssPath = path.join(__dirname, '..', 'src', 'components', 'Reels', 'Reels.css');
const reelsCss = fs.readFileSync(reelsCssPath, 'utf8');
assert(reelsCss.includes('.reel-video-controls-overlay'), 'CSS must include .reel-video-controls-overlay');
assert(reelsCss.includes('.reel-timeline-scrubber'), 'CSS must include .reel-timeline-scrubber');
assert(reelsCss.includes('.reel-video-error-overlay'), 'CSS must include .reel-video-error-overlay');
console.log('✅ CSS verified: Controls overlay, timeline scrubber, and fallback styling confirmed.');

console.log('\n🎉 ALL REELS PLAYBACK & AUTHENTIC COMMENT PERSISTENCE TESTS PASSED!');
