import { useState, useEffect } from 'react'

const STORAGE_KEY = 'habit_tracker_data'

function todayKey() {
  return new Date().toISOString().split('T')[0]
}

function getStreak(completions) {
  const today = todayKey()
  let streak = 0
  const d = new Date()
  if (!completions.includes(today)) d.setDate(d.getDate() - 1)
  while (true) {
    const k = d.toISOString().split('T')[0]
    if (completions.includes(k)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return streak
}

function getLastNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (n - 1 - i))
    return d.toISOString().split('T')[0]
  })
}

export function useHabits() {
  const [habits, setHabits] = useState([])
  const [nextId, setNextId] = useState(1)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        setHabits(data.habits || [])
        setNextId(data.nextId || 1)
      }
    } catch (e) {}
  }, [])

  function persist(newHabits, newNextId) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits: newHabits, nextId: newNextId }))
  }

  function addHabit(name) {
    const updated = [...habits, { id: nextId, name, completions: [] }]
    const newNextId = nextId + 1
    setHabits(updated)
    setNextId(newNextId)
    persist(updated, newNextId)
  }

  function deleteHabit(id) {
    const updated = habits.filter(h => h.id !== id)
    setHabits(updated)
    persist(updated, nextId)
  }

  function toggleToday(id) {
    const today = todayKey()
    const updated = habits.map(h => {
      if (h.id !== id) return h
      const completions = h.completions.includes(today)
        ? h.completions.filter(d => d !== today)
        : [...h.completions, today]
      return { ...h, completions }
    })
    setHabits(updated)
    persist(updated, nextId)
  }

  const today = todayKey()
  const week = getLastNDays(7)
  const month = getLastNDays(28)

  const stats = {
    today: habits.filter(h => h.completions.includes(today)).length,
    total: habits.length,
    bestStreak: habits.length ? Math.max(...habits.map(h => getStreak(h.completions))) : 0,
    weekRate: (() => {
      const possible = week.length * habits.length
      const done = habits.reduce((acc, h) => acc + week.filter(d => h.completions.includes(d)).length, 0)
      return possible > 0 ? Math.round((done / possible) * 100) : null
    })(),
    month,
    week,
  }

  const habitsWithMeta = habits.map(h => ({
    ...h,
    doneToday: h.completions.includes(today),
    streak: getStreak(h.completions),
  }))

  return { habits: habitsWithMeta, stats, addHabit, deleteHabit, toggleToday }
}
