import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function CameraCapture({ onCapture = ()=>{}, onClose = ()=>{} }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [_stream, setStream] = useState(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    let mounted = true
    async function start() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported in this browser')
        }
        const s = await navigator.mediaDevices.getUserMedia({ video: true })
        if (!mounted) return
        setStream(s)
        streamRef.current = s
        if (videoRef.current) videoRef.current.srcObject = s
      } catch (e) {
        setError(e && e.message ? e.message : String(e))
      }
    }
    start()
    return () => {
      mounted = false
      if (streamRef.current) {
        try { streamRef.current.getTracks().forEach(t => t.stop()) } catch (_){ void _ }
        streamRef.current = null
      }
    }
  }, [])

  const handleCapture = () => {
    const v = videoRef.current
    const c = canvasRef.current
    if (!v || !c) return
    c.width = v.videoWidth || 640
    c.height = v.videoHeight || 480
    const ctx = c.getContext('2d')
    ctx.drawImage(v, 0, 0, c.width, c.height)
    const dataUrl = c.toDataURL('image/jpeg')
    setPreview(dataUrl)
  }

  const handleUse = () => {
    if (preview) onCapture(preview)
    cleanupAndClose()
  }

  const handleFile = (ev) => {
    const f = ev.target.files && ev.target.files[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => setPreview(r.result)
    r.readAsDataURL(f)
  }

  const cleanupAndClose = () => {
    if (streamRef.current) {
      try { streamRef.current.getTracks().forEach(t => t.stop()) } catch (_){ void _ }
      streamRef.current = null
    }
    onClose()
  }

  const modal = (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9000}}>
      <div style={{width:'min(920px,96%)',background:'#fff',borderRadius:12,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:12,borderBottom:'1px solid #eee'}}>
          <div style={{fontWeight:700}}>Take a photo</div>
          <div>
            <button className="btn" onClick={cleanupAndClose} style={{marginRight:8}}>Close</button>
          </div>
        </div>

        <div style={{display:'flex',gap:12,alignItems:'flex-start',padding:12}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:8}}>
            {error ? (
              <div style={{padding:16,color:'var(--md-sys-color-error)'}}>Camera error: {error}</div>
            ) : (
              <div style={{position:'relative',background:'#000',borderRadius:8,overflow:'hidden'}}>
                <video ref={videoRef} autoPlay playsInline muted style={{width:'100%',height:'auto',display: preview ? 'none' : 'block'}} />
                {preview && (
                  <img src={preview} alt="preview" style={{width:'100%',height:'auto',display:'block'}} />
                )}
              </div>
            )}

            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <button className="btn" onClick={handleCapture} disabled={!!preview}><span className="material-symbols-rounded">camera_alt</span> Capture</button>
              <button className="btn" onClick={() => setPreview(null)} disabled={!preview}><span className="material-symbols-rounded">autorenew</span> Retake</button>
              <button className="btn success" onClick={handleUse} disabled={!preview}><span className="material-symbols-rounded">check</span> Use photo</button>
              <label style={{display:'inline-flex',alignItems:'center',justifyContent:'center'}} className="btn secondary">
                <span className="material-symbols-rounded">upload_file</span>
                <span style={{marginLeft:8}}>Upload</span>
                <input type="file" accept="image/*" onChange={handleFile} style={{display:'none'}} />
              </label>
            </div>
          </div>

          <div style={{width:220,display:'flex',flexDirection:'column',gap:8}}>
            <div style={{fontWeight:700}}>Preview</div>
            <div style={{width:220,height:180,background:'#f6f6f6',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
              {preview ? <img src={preview} alt="preview small" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{color:'#666'}}>No photo yet</div>}
            </div>
            <div style={{fontSize:12,color:'#666'}}>You can capture from your camera or upload an image.</div>
          </div>
        </div>

        <canvas ref={canvasRef} style={{display:'none'}} />
      </div>
    </div>
  )

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(modal, document.body)
  }
  return modal
}
