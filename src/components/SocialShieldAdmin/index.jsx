import React, { useState, useEffect } from 'react'
import {
  BsShieldCheck,
  BsShieldX,
  BsShieldShaded,
  BsExclamationOctagonFill,
  BsCheckCircleFill,
  BsActivity,
  BsSearch,
  BsTrash,
  BsArrowRepeat,
  BsLightningFill,
} from 'react-icons/bs'
import Header from '../Header'
import {
  getModerationLogs,
  getModerationAnalytics,
  clearModerationLogs,
  moderateText,
} from '../../services/socialShieldAI'
import './index.css'

const SocialShieldAdmin = () => {
  const [logs, setLogs] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchLog, setSearchLog] = useState('')
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [isTesting, setIsTesting] = useState(false)

  const refreshData = () => {
    setLogs(getModerationLogs())
    setAnalytics(getModerationAnalytics())
  }

  useEffect(() => {
    refreshData()
    const handleUpdate = () => refreshData()
    window.addEventListener('socialshield_log_updated', handleUpdate)
    return () => window.removeEventListener('socialshield_log_updated', handleUpdate)
  }, [])

  const handleRunLiveTest = async e => {
    e.preventDefault()
    if (!testInput.trim()) return
    setIsTesting(true)
    const result = await moderateText(testInput.trim(), 'admin_sandbox_test', 'admin_tester')
    setTestResult(result)
    setIsTesting(false)
    refreshData()
  }

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all moderation logs?')) {
      clearModerationLogs()
      refreshData()
      setTestResult(null)
    }
  }

  const filteredLogs = logs.filter(item => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'BLOCKED' && item.isToxic) ||
      (filterStatus === 'ALLOWED' && !item.isToxic)
    const matchesSearch =
      !searchLog.trim() ||
      (item.contentSample || '').toLowerCase().includes(searchLog.toLowerCase()) ||
      (item.author || '').toLowerCase().includes(searchLog.toLowerCase()) ||
      (item.categories || []).some(c => c.toLowerCase().includes(searchLog.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  return (
    <div className="socialshield-admin-page">
      <Header />

      <main className="socialshield-main-wrapper">
        {/* Page Hero Header */}
        <section className="admin-hero-banner">
          <div className="hero-branding">
            <div className="shield-icon-badge">
              <BsShieldShaded size={32} />
            </div>
            <div>
              <div className="hero-title-row">
                <h1 className="admin-title">SocialShield AI</h1>
                <span className="version-badge">v2.4 Active Engine</span>
              </div>
              <p className="admin-subtitle">
                Real-Time Toxic Content Detection & Pre-Publish Moderation Decision Engine
              </p>
            </div>
          </div>

          <div className="hero-actions">
            <button type="button" className="action-refresh-btn" onClick={refreshData}>
              <BsArrowRepeat size={16} />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </section>

        {/* Analytics KPI Metric Cards */}
        {analytics && (
          <section className="kpi-metrics-grid">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Total Monitored</span>
                <BsActivity className="kpi-icon blue" size={20} />
              </div>
              <h2 className="kpi-value">{analytics.totalChecked}</h2>
              <span className="kpi-footer">Across posts, comments & DMs</span>
            </div>

            <div className="kpi-card blocked">
              <div className="kpi-header">
                <span className="kpi-label">Harmful Blocked</span>
                <BsShieldX className="kpi-icon red" size={20} />
              </div>
              <h2 className="kpi-value text-red">{analytics.totalBlocked}</h2>
              <span className="kpi-footer text-red-sub">
                {analytics.toxicityRate} Interception Rate
              </span>
            </div>

            <div className="kpi-card safe">
              <div className="kpi-header">
                <span className="kpi-label">Safe & Allowed</span>
                <BsShieldCheck className="kpi-icon green" size={20} />
              </div>
              <h2 className="kpi-value text-green">{analytics.totalSafe}</h2>
              <span className="kpi-footer text-green-sub">Verified compliant</span>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Model Confidence</span>
                <BsLightningFill className="kpi-icon gold" size={20} />
              </div>
              <h2 className="kpi-value text-gold">{analytics.averageConfidence}</h2>
              <span className="kpi-footer">RoBERTa & ConvNeXt Tiny</span>
            </div>
          </section>
        )}

        {/* Live AI Sandbox Tester */}
        <section className="admin-section-box live-sandbox-box">
          <div className="box-header-row">
            <div>
              <h3 className="box-title">⚡ Real-Time AI Moderation Sandbox</h3>
              <p className="box-desc">
                Test any text or phrase to evaluate real-time Transformer classification, confidence score, and moderation decision.
              </p>
            </div>
          </div>

          <form className="sandbox-test-form" onSubmit={handleRunLiveTest}>
            <div className="sandbox-input-wrapper">
              <input
                type="text"
                className="sandbox-input"
                placeholder="Type a sample message, toxic sentence, or clean comment to test AI..."
                value={testInput}
                onChange={e => setTestInput(e.target.value)}
              />
              <button type="submit" className="sandbox-submit-btn" disabled={isTesting || !testInput.trim()}>
                {isTesting ? 'Analyzing...' : 'Test Toxicity'}
              </button>
            </div>
          </form>

          {testResult && (
            <div className={`sandbox-result-card ${testResult.isToxic ? 'blocked' : 'allowed'}`}>
              <div className="result-status-badge-row">
                <div className="status-indicator-group">
                  {testResult.isToxic ? (
                    <BsExclamationOctagonFill className="status-icon red" size={20} />
                  ) : (
                    <BsCheckCircleFill className="status-icon green" size={20} />
                  )}
                  <span className={`status-text ${testResult.isToxic ? 'red' : 'green'}`}>
                    {testResult.status}: {testResult.isToxic ? 'Content Will Be Blocked' : 'Content Safe to Publish'}
                  </span>
                </div>
                <span className="confidence-pill">Confidence: {testResult.confidence}</span>
              </div>

              <p className="result-reason-text">{testResult.reason}</p>

              {testResult.categories?.length > 0 && (
                <div className="result-categories-row">
                  <span className="cat-label">Categories:</span>
                  {testResult.categories.map((c, i) => (
                    <span key={i} className="cat-badge">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Live Moderation Audit Logs Table */}
        <section className="admin-section-box logs-table-box">
          <div className="logs-header-control-row">
            <div>
              <h3 className="box-title">🛡️ Live Moderation Audit Logs</h3>
              <p className="box-desc">
                Every text, comment, direct message, and upload is screened before publishing.
              </p>
            </div>

            <div className="logs-actions-toolbar">
              <div className="logs-search-box">
                <BsSearch size={14} className="search-svg" />
                <input
                  type="text"
                  placeholder="Filter logs by text or user..."
                  value={searchLog}
                  onChange={e => setSearchLog(e.target.value)}
                />
              </div>

              <div className="status-filter-buttons">
                <button
                  type="button"
                  className={`filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('ALL')}
                >
                  All ({logs.length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filterStatus === 'BLOCKED' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('BLOCKED')}
                >
                  Blocked ({logs.filter(l => l.isToxic).length})
                </button>
                <button
                  type="button"
                  className={`filter-btn ${filterStatus === 'ALLOWED' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('ALLOWED')}
                >
                  Allowed ({logs.filter(l => !l.isToxic).length})
                </button>
              </div>

              <button
                type="button"
                className="clear-logs-btn"
                onClick={handleClearLogs}
                title="Clear audit logs"
              >
                <BsTrash size={14} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="logs-table-container">
            {filteredLogs.length > 0 ? (
              <table className="socialshield-logs-table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Context</th>
                    <th>Content Sample</th>
                    <th>Violations</th>
                    <th>Score / Conf.</th>
                    <th>User</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} className={log.isToxic ? 'row-blocked' : 'row-allowed'}>
                      <td>
                        <span className={`table-status-pill ${log.isToxic ? 'blocked' : 'allowed'}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>
                        <span className="context-tag">{log.context || log.contentType}</span>
                      </td>
                      <td className="content-sample-cell" title={log.fullContent || log.contentSample}>
                        {log.contentSample}
                      </td>
                      <td>
                        {log.categories?.length > 0 ? (
                          <div className="table-categories-wrap">
                            {log.categories.map((cat, i) => (
                              <span key={i} className="category-pill-mini">
                                {cat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        <strong className={log.isToxic ? 'text-red' : 'text-green'}>
                          {log.confidence || `${((log.toxicityScore || 0) * 100).toFixed(0)}%`}
                        </strong>
                      </td>
                      <td>
                        <span className="user-label">@{log.author || 'user'}</span>
                      </td>
                      <td className="time-cell">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-logs-state">
                <BsShieldCheck size={40} className="empty-icon" />
                <p>No moderation logs match your current filter.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default SocialShieldAdmin
