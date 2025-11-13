import React, { useState } from 'react'
import './ImageUploader.css'

export default function ImageUploader({ onChange = () => {}, initial = [] }){
  const [preview, setPreview] = useState(initial)

  function handleFiles(e){
    const files = Array.from(e.target.files || [])
    const urls = files.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setPreview(urls)
    onChange(files)
  }

  return (
    <div className="image-uploader">
      <input type="file" multiple accept="image/*" onChange={handleFiles} />
      <div className="preview-grid">
        {preview.map((p, i) => (
          <div className="preview-item" key={i}>
            <img src={p.url || p} alt={`preview-${i}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
