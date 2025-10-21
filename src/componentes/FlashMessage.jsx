import React, { useEffect, useState } from 'react'

export default function FlashMessage() {
  const [msg, setMsg] = useState(null)
  const [type, setType] = useState('info')

  useEffect(() => {
    const handler = (e) => {
      const detail = e.detail || {}
      setMsg(detail.text || 'Mensaje')
      setType(detail.type || 'info')
      // auto dismiss after 3s
      setTimeout(() => setMsg(null), 3000)
    }
    window.addEventListener('flash', handler)
    return () => window.removeEventListener('flash', handler)
  }, [])

  if (!msg) return null

  const cls = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;

  return (
    <div className={cls} role="alert" style={{ zIndex: 2000 }}>
      {msg}
    </div>
  )
}
