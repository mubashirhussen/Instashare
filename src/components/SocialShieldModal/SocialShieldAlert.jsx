import React from 'react'
import { BsStars, BsX, BsTranslate } from 'react-icons/bs'
import './index.css'

const SocialShieldAlert = ({ blockResult, onClose }) => {
  if (!blockResult || !blockResult.isToxic) return null

  const {
    categories = [],
    confidence = '92.0%',
    reason,
    originalText = '',
    context = 'comment',
    multilingual,
  } = blockResult

  // Determine dynamic title
  let contextTitle = 'Social Comment Blocked from Publishing'
  if (context === 'direct_message' || context === 'chat') {
    contextTitle = 'Direct Message Blocked from Sending'
  } else if (context === 'post' || context === 'post_caption' || context === 'image_upload' || context === 'video_upload') {
    contextTitle = 'Social Post Blocked from Publishing'
  } else if (context === 'reel_comment') {
    contextTitle = 'Reel Comment Blocked from Publishing'
  }

  const violationText =
    reason ||
    'Violated Parliamentary Standards: Detected Multilingual profanity / unparliamentary language'

  const matchedWord = multilingual?.matchedWord || originalText

  const translations = multilingual?.translations || {
    english: {
      langName: 'English',
      nativeLangLabel: 'English',
      word: matchedWord,
      meaning: 'Son of a whore / abusive profanity',
    },
    hindi: {
      langName: 'Hindi',
      nativeLangLabel: 'हिन्दी',
      word: matchedWord,
      meaning: 'वेश्या की संतान / अत्यंत अश्लील गाली (Veshya ki santaan)',
    },
    telugu: {
      langName: 'Telugu',
      nativeLangLabel: 'తెలుగు',
      word: matchedWord,
      meaning: 'వేశ్య యొక్క కుమారుడు / తీవ్రమైన అసభ్యకరమైన తిట్టు',
    },
    tamil: {
      langName: 'Tamil',
      nativeLangLabel: 'தமிழ்',
      word: matchedWord,
      meaning: 'வேசியின் மகன் (Vaesiyin magan)',
    },
    kannada: {
      langName: 'Kannada',
      nativeLangLabel: 'ಕನ್ನಡ',
      word: matchedWord,
      meaning: 'ವೇಶ್ಯೆಯ ಮಗ (Vēśyeya maga)',
    },
    malayalam: {
      langName: 'Malayalam',
      nativeLangLabel: 'മലയാളം',
      word: matchedWord,
      meaning: 'വ്യഭിചാരിയുടെ മകൻ (Vyabhichaariyude makan)',
    },
  }

  const sourceLang = multilingual?.sourceLanguage || 'Telugu'

  const langList = [
    { key: 'english', labelPrefix: 'Meaning:' },
    { key: 'hindi', labelPrefix: 'अर्थ (Meaning):' },
    { key: 'telugu', labelPrefix: 'అర్థం (Meaning):' },
    { key: 'tamil', labelPrefix: 'பொருள் (Meaning):' },
    { key: 'kannada', labelPrefix: 'ಅರ್ಥ (Meaning):' },
    { key: 'malayalam', labelPrefix: 'അർത്ഥം (Meaning):' },
  ]

  return (
    <div className="shield-modal-backdrop" role="alertdialog" aria-modal="true">
      <div className="shield-modal-card">
        {/* Top Dismiss Cross */}
        <button
          type="button"
          className="shield-modal-close-icon"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <BsX size={24} />
        </button>

        {/* 1. Header Activation Banner */}
        <div className="shield-top-banner">
          <span className="shield-activation-pill">
            PRE-POST PREVENTION SHIELD ACTIVATED
          </span>
          <h2 className="shield-main-heading">{contextTitle}</h2>
        </div>

        {/* 2. Violation Banner Card */}
        <div className="shield-violation-card">
          <p className="shield-violation-text">
            <strong>Violation:</strong> {violationText}
          </p>
        </div>

        {/* 3. Original Blocked Input Code Block */}
        <div className="shield-input-section">
          <span className="shield-section-label">ORIGINAL BLOCKED INPUT:</span>
          <div className="shield-code-block">
            <code>"{originalText || 'Content blocked prior to dispatch'}"</code>
          </div>
        </div>

        {/* 4. Multilingual Word Translations & Exact Meanings */}
        <div className="shield-multilingual-section">
          <div className="shield-multilingual-header">
            <div className="shield-sparkle-title">
              <BsStars className="sparkle-icon" size={16} />
              <span>Multilingual Translations &amp; Exact Meanings</span>
            </div>
            <span className="shield-source-tag">Detected Language: {sourceLang}</span>
          </div>

          <div className="shield-translations-grid">
            {langList.map(({ key, labelPrefix }) => {
              const item = translations[key]
              if (!item) return null
              return (
                <div key={key} className="shield-translation-card">
                  <div className="translation-card-top">
                    <span className="card-lang-name">{item.langName}</span>
                    <span className="card-native-label">{item.nativeLangLabel}</span>
                  </div>
                  <div className="card-meaning-content">
                    <span className="meaning-field-label">{labelPrefix}</span>
                    <p className="translation-exact-meaning">{item.meaning}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 5. Safety Violation Score Bar */}
        <div className="shield-score-bar">
          <span className="score-label">Safety Violation Score:</span>
          <span className="score-value">{confidence}</span>
        </div>

        {/* 6. Action Button */}
        <button
          type="button"
          className="shield-confirm-action-btn"
          onClick={onClose}
        >
          I UNDERSTAND (CONTENT WITHHELD)
        </button>
      </div>
    </div>
  )
}

export default SocialShieldAlert
