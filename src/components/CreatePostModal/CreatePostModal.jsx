import { useState, useRef, useEffect } from 'react'
import {
  BsImages,
  BsCameraVideo,
  BsX,
  BsCheckCircleFill,
  BsCloudArrowUp,
  BsFolder2Open,
  BsArrowLeft,
} from 'react-icons/bs'
import { addNewPost } from '../../utils/storage'
import './CreatePostModal.css'

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isVideo, setIsVideo] = useState(false)
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const fileInputRef = useRef(null)

  // Auto-open file explorer when modal opens
  useEffect(() => {
    if (isOpen && !previewUrl && fileInputRef.current) {
      // Small timeout to allow modal mount
      const timer = setTimeout(() => {
        fileInputRef.current?.click()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, previewUrl])

  if (!isOpen) return null

  const handleFile = file => {
    if (!file) return
    const isVid = file.type.startsWith('video/')
    const isImg = file.type.startsWith('image/')

    if (!isImg && !isVid) {
      setErrorMessage('Please select a valid image or video file.')
      return
    }

    setSelectedFile(file)
    setIsVideo(isVid)
    setErrorMessage('')

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    handleFile(file)
  }

  const handleDragOver = e => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    handleFile(file)
  }

  const handleResetFile = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setIsVideo(false)
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!previewUrl) {
      setErrorMessage('Please select an image or video file to upload.')
      return
    }

    const newPost = {
      id: `post_${Date.now()}`,
      image: previewUrl,
      videoUrl: isVideo ? previewUrl : null,
      isVideo: isVideo,
      caption: caption.trim() || 'New post shared from my device ✨',
      location: location.trim() || null,
      audioInfo: isVideo ? 'Original Audio • Reel' : null,
      likes: 0,
      comments: 0,
      date: 'Just now',
    }

    addNewPost(newPost)
    setIsSuccess(true)

    setTimeout(() => {
      setIsSuccess(false)
      setSelectedFile(null)
      setPreviewUrl('')
      setIsVideo(false)
      setCaption('')
      setLocation('')
      onClose()
      if (onPostCreated) onPostCreated()
    }, 1200)
  }

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="create-post-modal-card" onClick={e => e.stopPropagation()}>
        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="visually-hidden-file-input"
          id="direct-file-upload-input"
        />

        {/* Modal Header */}
        <div className="modal-header-bar">
          {previewUrl && !isSuccess ? (
            <button
              type="button"
              className="back-step-btn"
              onClick={handleResetFile}
              title="Change file"
            >
              <BsArrowLeft size={20} />
              <span>Change file</span>
            </button>
          ) : (
            <div className="header-title-wrap">
              <BsFolder2Open size={20} />
              <h3>Create New Post or Reel</h3>
            </div>
          )}

          <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close">
            <BsX size={26} />
          </button>
        </div>

        {isSuccess ? (
          <div className="modal-success-state">
            <BsCheckCircleFill size={60} className="success-icon-check" />
            <h4>Shared to Profile & Feed!</h4>
            <p>Your {isVideo ? 'video reel' : 'photo post'} is now uploaded and visible on your profile and home feed.</p>
          </div>
        ) : !previewUrl ? (
          /* File Explorer Dropzone & Browse button */
          <div
            className={`file-dropzone-container ${isDragging ? 'dragging-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-inner-content">
              <div className="upload-icon-circle">
                <BsCloudArrowUp size={48} className="cloud-upload-icon" />
              </div>

              <h3>Drag photos and videos here</h3>
              <p>Upload files directly from your computer, gallery, or image documents</p>

              <button
                type="button"
                className="select-computer-btn"
                onClick={e => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                <BsFolder2Open size={18} />
                <span>Select from computer / device</span>
              </button>

              <div className="supported-formats-hint">
                <span>Supports JPG, PNG, WEBP, GIF, MP4, MOV, WEBM</span>
              </div>
            </div>

            {errorMessage && <p className="dropzone-error-msg">{errorMessage}</p>}
          </div>
        ) : (
          /* Live Media Preview & Details Form */
          <form className="media-publish-form" onSubmit={handleSubmit}>
            <div className="publish-layout-split">
              {/* Media Preview Column */}
              <div className="publish-preview-pane">
                {isVideo ? (
                  <div className="video-preview-wrapper">
                    <video
                      src={previewUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      className="publish-live-video"
                    />
                    <span className="media-type-badge video-badge">
                      <BsCameraVideo size={14} /> Video Reel
                    </span>
                  </div>
                ) : (
                  <div className="image-preview-wrapper">
                    <img
                      src={previewUrl}
                      alt="Selected upload"
                      className="publish-live-image"
                    />
                    <span className="media-type-badge photo-badge">
                      <BsImages size={14} /> Photo Post
                    </span>
                  </div>
                )}
              </div>

              {/* Caption & Publish Column */}
              <div className="publish-details-pane">
                <div className="selected-file-meta">
                  <strong>{selectedFile?.name || 'Uploaded Media'}</strong>
                  <span>{selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB' : ''}</span>
                </div>

                <div className="details-input-block">
                  <label htmlFor="post-caption-input">Write a caption</label>
                  <textarea
                    id="post-caption-input"
                    rows={4}
                    placeholder="Write a caption... Add hashtags #InstaShare #Creators"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="details-input-block">
                  <label htmlFor="post-location-input">Add Location (Optional)</label>
                  <input
                    id="post-location-input"
                    type="text"
                    placeholder="e.g. Hyderabad, India"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>

                <div className="hashtag-suggestions">
                  <span onClick={() => setCaption(prev => prev + ' #Tech')}>#Tech</span>
                  <span onClick={() => setCaption(prev => prev + ' #Code')}>#Code</span>
                  <span onClick={() => setCaption(prev => prev + ' #Vibe')}>#Vibe</span>
                  <span onClick={() => setCaption(prev => prev + ' #Photography')}>#Photography</span>
                  <span onClick={() => setCaption(prev => prev + ' #Reels')}>#Reels</span>
                </div>

                {errorMessage && <p className="publish-error-msg">{errorMessage}</p>}

                <div className="publish-actions-footer">
                  <button
                    type="button"
                    className="change-file-btn"
                    onClick={handleResetFile}
                  >
                    Select another file
                  </button>

                  <button type="submit" className="publish-submit-btn">
                    Share to Profile & Feed
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreatePostModal
