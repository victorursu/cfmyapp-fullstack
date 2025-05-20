'use client'

import { useState } from 'react'
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [email, setEmail] = useState('')
  const [data, setData]   = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Submitting…')

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, jsonData: data }),
    })

    if (res.ok) {
      setStatus('✅ Submitted!')
      setEmail('')
      setData('')
    } else {
      const err = await res.json()
      setStatus(`❌ Error: ${err.error || res.statusText}`)
    }
  }

  return (
    <main className={styles.main}>
      <h1>Submit to Supabase</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Email
          <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
        </label>

        <label>
          Data (JSON)
          <textarea
              rows={6}
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder={`e.g. {"foo": "bar"}`}
              required
          />
        </label>

        <button type="submit">Send</button>
      </form>

      {status && <p className={styles.status}>{status}</p>}

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

    </main>
  );
}
