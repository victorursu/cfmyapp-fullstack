// app/page.js
'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [type, setType] = useState('')
  const [language, setLang] = useState('')
  const [data, setData]   = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Submitting…')

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, language, payload: data }),
    })

    if (res.ok) {
      setStatus('✅ Submitted!')
      setType('')
      setLang('')
      setData('')
    } else {
      const err = await res.json()
      setStatus(`❌ Error: ${err.error || res.statusText}`)
    }
  }

  return (
      <main className={styles.main}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Submit Your Data</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label>
              Type
              <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
              >
                <option value="" disabled>Choose type…</option>
                <option value="fill_in_the_blanks">Fill in the Blanks</option>
                <option value="flip_cards">Flip Cards</option>
                <option value="single_choice">Single Choice</option>
                <option value="multichoice">Multi Choice</option>
                <option value="drag_words">Drag Words</option>
              </select>
            </label>

            <label>
              Language
              <select
                  value={language}
                  onChange={(e) => setLang(e.target.value)}
                  required
              >
                <option value="" disabled>Choose language…</option>
                <option value="ro">ro</option>
                <option value="hu">hu</option>
                <option value="ua">ua</option>
              </select>
            </label>

            <label>
              Data (JSON)
              <textarea
                  rows={6}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder={`e.g. {"foo":"bar"}`}
                  required
              />
            </label>

            <button type="submit" className={styles.submitBtn}>
              Send
            </button>
          </form>

          {status && <p className={styles.status}>{status}</p>}
        </div>
      </main>
  )
}
