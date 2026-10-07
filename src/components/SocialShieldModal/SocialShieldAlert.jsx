import React from 'react'
import { BsShieldShaded, BsExclamationTriangleFill, BsX } from 'react-icons/bs'
import './index.css'

const SocialShieldAlert = ({ blockResult, onClose }) => {
  if (!blockResult || !blockResult.isToxic) return null

  const { categories = [], confidence, reason, toxicityScore } = blockResult

  return (
    <div className="socialshield-alert-backdrop" role="alertdialog" aria-modal="true">
      <div className="socialshield-alert-card animate-shield-pop">
        <button
          type="button"
          className="socialshield-close-btn"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <BsX size={26} />
        </button>

        <div className="socialshield-badge-icon-wrap">
          <div className="shield-pulsing-glow" />
          <BsShieldShaded className="shield-main-icon" size={48} />
          <BsExclamationTriangleFill className="shield-warning-mini" size={20} />
        </div>

        <div className="socialshield-header-text">
          <span className="shield-tag-pill">AI CONTENT MODERATION ENGINE</span>
          <h2 className="shield-title">Harmful Content Blocked</h2>
          <p className="shield-subtitle">
            SocialShield AI intercepted and prevented this content from being published to protect our community.
          </p>
        </div>

        <div className="shield-details-box">
          <div className="shield-detail-row">
            <span className="detail-label">Status</span>
            <span className="status-blocked-pill">BLOCKED BY AI</span>
          </div>

          <div className="shield-detail-row">
            <span className="detail-label">Confidence Score</span>
            <span className="detail-value confidence-value">{confidence || `${((toxicityScore || 0.95) * 100).toFixed(1)}%`}</span>
          </div>

          {categories.length > 0 && (
            <div className="shield-detail-row">
              <span className="detail-label">Violations Detected</span>
              <div className="category-tags-wrap">
                {categories.map((cat, idx) => (
                  <span key={idx} className="category-tag-badge">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="shield-reason-box">
            <span className="reason-heading">Moderation Decision:</span>
            <p className="reason-text">{reason || 'Violated platform anti-harassment and safety guidelines.'}</p>
          </div>
        </div>

        <div className="shield-footer-actions">
          <button type="button" className="shield-understand-btn" onClick={onClose}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

export default SocialShieldAlert
