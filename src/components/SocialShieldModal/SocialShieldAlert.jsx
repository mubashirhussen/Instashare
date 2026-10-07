import React from 'react'
import { BsStars, BsX } from 'react-icons/bs'
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

  const translations = multilingual?.translations || {
    english: {
      langName: 'English',
      nativeLangLabel: 'English',
      statement: `Flagged toxic statement: '${originalText}'`,
      explanation: 'Flagged toxic statement violating community guidelines and unparliamentary speech standards.',
    },
    hindi: {
      langName: 'Hindi',
      nativeLangLabel: 'हिन्दी',
      statement: `ध्वजांकित हानिकारक कथन: '${originalText}'`,
      explanation: 'सामुदायिक दिशानिर्देशों और असंसदीय भाषा मानकों का उल्लंघन करने वाला ध्वजांकित कथन।',
    },
    telugu: {
      langName: 'Telugu',
      nativeLangLabel: 'తెలుగు',
      statement: `హానికరమైనదిగా గుర్తించబడిన వాక్యం: '${originalText}'`,
      explanation: 'కమ్యూనిటీ మార్గదర్శకాలు మరియు అసభా నిబంధనలను ఉల్లంఘించే ప్రమాదకరమైన వాక్యం.',
    },
    tamil: {
      langName: 'Tamil',
      nativeLangLabel: 'தமிழ்',
      statement: `தீங்கு விளைவிக்கும் செய்தியாகக் குறிக்கப்பட்டது: '${originalText}'`,
      explanation: 'சமூக வழிகாட்டுதல்களை மீறும் தகாத மற்றும் தீங்கு விளைவிக்கும் வாசகம்.',
    },
    kannada: {
      langName: 'Kannada',
      nativeLangLabel: 'ಕನ್ನಡ',
      statement: `ಹಾನಿಕಾರಕವೆಂದು ಗುರುತಿಸಲಾದ ಸಂದೇಶ: '${originalText}'`,
      explanation: 'ಸಮುದಾಯ ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಉಲ್ಲಂಘಿಸುವ ಅಸಭ್ಯ ಹಾಗೂ ಹಾನಿಕಾರಕ ಹೇಳಿಕೆ.',
    },
  }

  const sourceLang = multilingual?.sourceLanguage || 'English'

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

        {/* 4. Multilingual Translations & Explanations */}
        <div className="shield-multilingual-section">
          <div className="shield-multilingual-header">
            <div className="shield-sparkle-title">
              <BsStars className="sparkle-icon" size={16} />
              <span>Multilingual Translations &amp; Explanations</span>
            </div>
            <span className="shield-source-tag">Source: {sourceLang}</span>
          </div>

          <div className="shield-translations-grid">
            {/* English */}
            <div className="shield-translation-card">
              <div className="translation-card-top">
                <span className="card-lang-name">{translations.english.langName}</span>
                <span className="card-native-label">{translations.english.nativeLangLabel}</span>
              </div>
              <p className="translation-statement">{translations.english.statement}</p>
              {translations.english.explanation && (
                <p className="translation-explanation">{translations.english.explanation}</p>
              )}
            </div>

            {/* Hindi */}
            <div className="shield-translation-card">
              <div className="translation-card-top">
                <span className="card-lang-name">{translations.hindi.langName}</span>
                <span className="card-native-label">{translations.hindi.nativeLangLabel}</span>
              </div>
              <p className="translation-statement">{translations.hindi.statement}</p>
              {translations.hindi.explanation && (
                <p className="translation-explanation">{translations.hindi.explanation}</p>
              )}
            </div>

            {/* Telugu */}
            <div className="shield-translation-card">
              <div className="translation-card-top">
                <span className="card-lang-name">{translations.telugu.langName}</span>
                <span className="card-native-label">{translations.telugu.nativeLangLabel}</span>
              </div>
              <p className="translation-statement">{translations.telugu.statement}</p>
              {translations.telugu.explanation && (
                <p className="translation-explanation">{translations.telugu.explanation}</p>
              )}
            </div>

            {/* Tamil */}
            <div className="shield-translation-card">
              <div className="translation-card-top">
                <span className="card-lang-name">{translations.tamil.langName}</span>
                <span className="card-native-label">{translations.tamil.nativeLangLabel}</span>
              </div>
              <p className="translation-statement">{translations.tamil.statement}</p>
              {translations.tamil.explanation && (
                <p className="translation-explanation">{translations.tamil.explanation}</p>
              )}
            </div>

            {/* Kannada */}
            <div className="shield-translation-card shield-card-full-width">
              <div className="translation-card-top">
                <span className="card-lang-name">{translations.kannada.langName}</span>
                <span className="card-native-label">{translations.kannada.nativeLangLabel}</span>
              </div>
              <p className="translation-statement">{translations.kannada.statement}</p>
              {translations.kannada.explanation && (
                <p className="translation-explanation">{translations.kannada.explanation}</p>
              )}
            </div>
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
