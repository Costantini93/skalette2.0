'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiCalendar, FiLogOut } from 'react-icons/fi'

interface BlockedSlot {
  date: string // YYYY-MM-DD
  time: string // HH:MM
  tableId: string
}

interface AvailabilityData {
  blockedSlots: BlockedSlot[]
}

const tables = [
  'B1', 'B2', 'B3', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'
]

const timeSlots = [
  '18:00', '18:30', '19:00', '19:30', '20:00', 
  '20:30', '21:00', '21:30', '22:00', '22:30'
]

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({ blockedSlots: [] })
  const [selectedDate, setSelectedDate] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token === 'admin_authenticated') {
      setIsAuthenticated(true)
      loadAvailability()
    }
  }, [])

  useEffect(() => {
    if (!selectedDate) {
      const today = new Date().toISOString().split('T')[0]
      setSelectedDate(today)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        setIsAuthenticated(true)
        loadAvailability()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    router.push('/')
  }

  const loadAvailability = async () => {
    try {
      const res = await fetch('/api/availability')
      const data = await res.json()
      setAvailabilityData(data)
    } catch (err) {
      console.error('Failed to load availability:', err)
    }
  }

  const isBlocked = (date: string, time: string, tableId: string) => {
    return availabilityData.blockedSlots.some(
      slot => slot.date === date && slot.time === time && slot.tableId === tableId
    )
  }

  const toggleBlock = async (date: string, time: string, tableId: string) => {
    const blocked = isBlocked(date, time, tableId)
    
    let newSlots
    if (blocked) {
      // Sblocca
      newSlots = availabilityData.blockedSlots.filter(
        slot => !(slot.date === date && slot.time === time && slot.tableId === tableId)
      )
    } else {
      // Blocca
      newSlots = [...availabilityData.blockedSlots, { date, time, tableId }]
    }

    const newData = { blockedSlots: newSlots }
    setAvailabilityData(newData)

    // Salva
    try {
      await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      })
      setSaveMessage('✓ Salvato')
      setTimeout(() => setSaveMessage(''), 2000)
    } catch (err) {
      setSaveMessage('✗ Errore salvataggio')
    }
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-900 border border-primary-500/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-white/60">SKALETTE Bistro</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="Inserisci password admin"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-dark-950 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifica...' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestione Disponibilità Tavoli</h1>
            <p className="text-white/60">Blocca i tavoli già prenotati da Dish o altri canali</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-white transition-colors"
          >
            <FiLogOut /> Esci
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-dark-900 border border-primary-500/20 rounded-xl p-6 mb-6">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <FiCalendar className="text-primary-400" />
            Seleziona Data
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
          />
          {saveMessage && (
            <span className="ml-4 text-green-400 text-sm">{saveMessage}</span>
          )}
        </div>

        {/* Availability Grid */}
        <div className="bg-dark-900 border border-primary-500/20 rounded-xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-white/80 font-medium pb-4 pr-4">Orario</th>
                {tables.map(table => (
                  <th key={table} className="text-center text-white/80 font-medium pb-4 px-2">
                    {table}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time} className="border-t border-dark-800">
                  <td className="py-3 pr-4 text-white/70 font-mono">{time}</td>
                  {tables.map(table => {
                    const blocked = isBlocked(selectedDate, time, table)
                    return (
                      <td key={table} className="px-2 py-3">
                        <button
                          onClick={() => toggleBlock(selectedDate, time, table)}
                          className={`w-full h-10 rounded-lg font-bold text-sm transition-all ${
                            blocked
                              ? 'bg-red-500/20 border-2 border-red-500 text-red-400 hover:bg-red-500/30'
                              : 'bg-green-500/20 border-2 border-green-500 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {blocked ? 'OCCUPATO' : 'Libero'}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
            <span className="text-white/70 text-sm">Disponibile per prenotazioni online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500/20 border-2 border-red-500"></div>
            <span className="text-white/70 text-sm">Bloccato (già prenotato)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
