// app/questions/QuestionsTable.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import styles from './page.module.css'

// initialize a client using your public anon key
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function QuestionsTable({ initialQuestions }) {
    // start with whatever came from the server, but we'll overwrite on mount
    const [questions, setQuestions] = useState(initialQuestions)
    const [selected, setSelected] = useState([])
    const [modalPayload, setModalPayload] = useState(null)
    const [filterType, setFilterType] = useState('')
    const [filterLanguage, setFilterLanguage] = useState('')

    // ⚡️ fetch fresh data whenever this component mounts
    useEffect(() => {
        async function loadQuestions() {
            const { data, error } = await supabase
                .from('literacyQuestions')
                .select('id, created_at, type, language, payload')
                .order('created_at', { ascending: false })
            if (!error && data) {
                setQuestions(data)
            }
        }
        loadQuestions()
    }, [])

    // close modal on Escape
    useEffect(() => {
        if (!modalPayload) return
        const onKey = (e) => e.key === 'Escape' && setModalPayload(null)
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [modalPayload])

    const toggle = (id) =>
        setSelected((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
        )

    const handleDelete = async () => {
        if (!selected.length) return
        if (
            !confirm(
                `Delete ${selected.length} question${
                    selected.length > 1 ? 's' : ''
                }?`
            )
        )
            return

        const res = await fetch('/api/questions/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selected }),
        })
        if (res.ok) {
            // update the list in-place
            setQuestions(questions.filter((q) => !selected.includes(q.id)))
            setSelected([])
        } else {
            alert('Error deleting questions')
        }
    }

    // build filter dropdowns from the *current* list
    const types = Array.from(new Set(questions.map((q) => q.type)))
    const languages = Array.from(new Set(questions.map((q) => q.language)))

    // apply user-selected filters
    const filtered = questions.filter(
        (q) =>
            (!filterType || q.type === filterType) &&
            (!filterLanguage || q.language === filterLanguage)
    )

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>All Literacy Questions.</h1>

            <Link href="/">
                <button className={styles.createBtn}>
                    Create a new question
                </button>
            </Link>

            {/* toolbar: filters + delete */}
            <div className={styles.toolbar}>
                <div className={styles.filters}>
                    <label>
                        Type:
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {types.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Language:
                        <select
                            value={filterLanguage}
                            onChange={(e) => setFilterLanguage(e.target.value)}
                        >
                            <option value="">All Languages</option>
                            {languages.map((l) => (
                                <option key={l} value={l}>
                                    {l}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    disabled={!selected.length}
                >
                    Delete Selected
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.selectCol}>✓</th>
                    <th>ID</th>
                    <th>Created At</th>
                    <th>Type</th>
                    <th>Language</th>
                    <th>Title</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((q) => {
                    const title =
                        q.payload?.sentence ??
                        q.payload?.question ??
                        q.payload?.template ??
                        'N/A'
                    return (
                        <tr key={q.id}>
                            <td className={styles.selectCol}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(q.id)}
                                    onChange={() => toggle(q.id)}
                                />
                            </td>
                            <td
                                className={styles.clickableId}
                                onClick={() => setModalPayload(q.payload)}
                            >
                                {q.id}
                            </td>
                            <td>{new Date(q.created_at).toLocaleString()}</td>
                            <td>{q.type}</td>
                            <td>{q.language}</td>
                            <td>{title}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>

            {/* JSON modal */}
            {modalPayload && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setModalPayload(null)}
                        >
                            ×
                        </button>
                        <textarea
                            readOnly
                            value={JSON.stringify(modalPayload, null, 2)}
                            className={styles.modalTextarea}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
