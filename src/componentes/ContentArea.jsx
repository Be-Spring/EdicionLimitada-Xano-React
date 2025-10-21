import React from 'react'

// ContentArea: occupies the space between header and footer and receives changing content as children.
// It adds top/bottom padding to avoid overlap with fixed header/footer and ensures a minimum height.
export default function ContentArea({ children, className = '' }) {
  return (
    <div
      className={"content-area " + className}
      style={{
        paddingTop: '88px', // leave space for fixed header
        paddingBottom: '80px', // space for footer
        minHeight: 'calc(100vh - 168px)'
      }}
    >
      {children}
    </div>
  )
}
