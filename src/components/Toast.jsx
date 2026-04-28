import React, { useEffect } from 'react'
import styles from './Toast.module.css'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 2000)
    return () => clearTimeout(t)
  }, [message])

  return (
    <div className={`${styles.toast} ${message ? styles.show : ''}`}>
      {message}
    </div>
  )
}
