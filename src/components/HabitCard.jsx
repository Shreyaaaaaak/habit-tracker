import React from 'react'
import styles from './HabitCard.module.css'

const WEEK_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const TODAY = new Date().toISOString().split('T')[0]

export default function HabitCard({ habit, weekDates, onToggle, onDelete }) {
  return (
    <div className={`${styles.card} ${habit.doneToday ? styles.done : ''}`}>
      <div className={styles.top}>
        <button
          className={`${styles.checkBtn} ${habit.doneToday ? styles.checked : ''}`}
          onClick={() => onToggle(habit.id)}
          aria-label={habit.doneToday ? 'Mark incomplete' : 'Mark complete'}
        >
          {habit.doneToday && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <span className={styles.name}>{habit.name}</span>

        <span className={`${styles.streak} ${habit.streak === 0 ? styles.streakZero : ''}`}>
          {habit.streak > 0 ? '★ ' : ''}{habit.streak}d
        </span>

        <button className={styles.delBtn} onClick={() => onDelete(habit.id)} title="Remove habit">×</button>
      </div>

      <div className={styles.week}>
        {weekDates.map((date) => {
          const done = habit.completions.includes(date)
          const isToday = date === TODAY
          return (
            <div key={date} className={styles.wday}>
              <div className={`${styles.dot} ${done ? styles.dotDone : ''} ${isToday ? styles.dotToday : ''}`} />
              <div className={styles.wlbl}>{WEEK_LABELS[new Date(date + 'T12:00:00').getDay()]}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
