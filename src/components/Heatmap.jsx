import React from 'react'
import styles from './Heatmap.module.css'

export default function Heatmap({ habits, days }) {
  return (
    <div className={styles.section}>
      <div className={styles.label}>Activity — last 4 weeks</div>
      <div className={styles.grid}>
        {days.map((date) => {
          const count = habits.filter(h => h.completions.includes(date)).length
          const total = habits.length
          let style = {}
          if (total > 0 && count > 0) {
            const alpha = (0.2 + (count / total) * 0.8).toFixed(2)
            style = { background: `rgba(45,106,79,${alpha})` }
          }
          return (
            <div
              key={date}
              className={styles.cell}
              style={style}
              title={`${date}: ${count}/${total}`}
            />
          )
        })}
      </div>
      <div className={styles.mapLabels}>
        <span>4 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}
