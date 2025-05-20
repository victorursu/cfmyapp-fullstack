// app/questions/QuestionsTable.js
'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'


export default function QuestionsTable({ initialQuestions }) {
    const [questions, setQuestions] = useState(initialQuestions)
    const [selected, setSelected] = useState([])
    const [modalPayload, setModalPayload] = useState(null)

  // close modal on Escape
  useEffect(() => {
    if (!modalPayload) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalPayload(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [modalPayload])

    const toggle = (id) =>
        setSelected((s) =>
            s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
        )

    const handleDelete = async () => {
        if (selected.length === 0) return
        if (
            !confirm(
                `Are you sure you want to delete ${selected.length} question${
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
            // remove from local state
            setQuestions(questions.filter((q) => !selected.includes(q.id)))
            setSelected([])
        } else {
            alert('Error deleting questions')
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>All Literacy Questions.</h1>
            <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={selected.length === 0}
            >
                Delete Selected
            </button>

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
                {questions.map((q) => (
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
                        <td>{q.payload?.sentence ?? q.payload?.question  ?? q.payload?.template  ?? 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
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
