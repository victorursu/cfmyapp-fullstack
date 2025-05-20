'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [type, setType] = useState('')
  const [language, setLang] = useState('')
  const [data, setData]   = useState('')
  const [status, setStatus] = useState('')

  // whenever `type` changes, load the corresponding JSON
  useEffect(() => {
    if (!type) return

    setStatus('Loading template…')
    fetch(`/data/${type}.json`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load /data/${type}.json`)
          return res.json()
        })
        .then((json) => {
          // pretty-print into the textarea
          setData(JSON.stringify(json, null, 2))
          setStatus('')
        })
        .catch((err) => {
          console.error(err)
          setStatus(`⚠️ ${err.message}`)
        })
  }, [type])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // -- validate that `data` is valid JSON --
    try {
      JSON.parse(data)
    } catch (err) {
      setStatus('❌ Invalid JSON')
      return
    }
    setStatus('Submitting…')

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, language, payload: data }),
    })
    const result = await res.json()

    if (res.ok) {
      setStatus(`✅ Submitted ${result.id}`)
      setType('')
      setLang('')
      setData('')
    } else {
      setStatus(`❌ Error: ${result.error || res.statusText}`)
    }
  }

  return (
      <main className={styles.main}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>Create Literacy Questions.</h1>

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
                <option value="ro">🇷🇴 Română</option>
                <option value="en">🇬🇧 English</option>
                <option value="hu">🇭🇺 Magyar</option>
                <option value="rom">🏳️ Rromani</option>
                <option value="ua">🇺🇦 Україна</option>
              </select>
            </label>

            <label>
              Data (JSON)
              <textarea
                  rows={10}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder={`Select a type to load its template…`}
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
