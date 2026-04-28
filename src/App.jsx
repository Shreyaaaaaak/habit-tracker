import React, { useState } from 'react'
import { useHabits } from './useHabits'
import HabitCard from './components/HabitCard'
import Heatmap from './components/Heatmap'
import Toast from './components/Toast'
import styles from './App.module.css'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric'
}).toUpperCase()

export default function App() {
  const { habits, stats, addHabit, deleteHabit, toggleToday } = useHabits()
  const [input, setInput] = useState('')
  const [toast, setToast] = useState('')

  function handleAdd() {
    const name = input.trim()
    if (!name) return
    addHabit(name)
    setInput('')
    showToast('Habit added')
  }

  function handleToggle(id) {
    const h = habits.find(h => h.id === id)
    const wasDone = h?.doneToday
    toggleToday(id)
    if (!wasDone) showToast('Great work! +1 streak')
  }

  function handleDelete(id) {
    deleteHabit(id)
    showToast('Habit removed')
  }

  function showToast(msg) {
    setToast(msg)
  }

  return (
    <div className={styles.app}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Habits</h1>
        <span className={styles.date}>{today}</span>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statNum}>{stats.total > 0 ? `${stats.today}/${stats.total}` : '–'}</div>
          <div className={styles.statLbl}>Today</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>{stats.total > 0 ? `${stats.bestStreak}d` : '–'}</div>
          <div className={styles.statLbl}>Best streak</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>{stats.weekRate !== null ? `${stats.weekRate}%` : '–'}</div>
          <div className={styles.statLbl}>This week</div>
        </div>
      </div>

      <div className={styles.sectionLabel}>Today's habits</div>

      <div className={styles.addRow}>
        <input
          className={styles.addInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new habit…"
          maxLength={50}
        />
        <button className={styles.addBtn} onClick={handleAdd}>Add</button>
      </div>

      <div className={styles.habits}>
        {habits.length === 0 ? (
          <div className={styles.empty}>No habits yet — add one above to get started.</div>
        ) : (
          habits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              weekDates={stats.week}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <Heatmap habits={habits} days={stats.month} />

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}
