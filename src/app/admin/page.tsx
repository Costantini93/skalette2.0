'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FiLock, FiCalendar, FiLogOut, FiClipboard, FiCheck, FiX, FiUser, FiPhone, FiClock } from 'react-icons/fi'

interface BlockedSlot {
  date: string // YYYY-MM-DD
  time: string // HH:MM
  tableId: string
}

interface AvailabilityData {
  blockedSlots: BlockedSlot[]
}

interface Reservation {
  id: string
  date: string
  time: string
  tableId: string
  guests: number
  firstName: string
  lastName: string
  phone: string
  serviceType: 'pranzo' | 'aperitivo' | 'cena'
  duration: number
  notes?: string
  status: 'pending' | 'confirmed' | 'rejected'
  timestamp: string
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
  const [activeTab, setActiveTab] = useState<'availability' | 'reservations'>('availability')
  
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData>({ blockedSlots: [] })
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('pending')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token === 'admin_authenticated') {
      setIsAuthenticated(true)
      loadAvailability()
      loadReservations()
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
        loadReservations()
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

  const loadReservations = async () => {
    try {
      const res = await fetch('/api/reservations')
      const data = await res.json()
      setReservations(data.reservations || [])
    } catch (err) {
      console.error('Failed to load reservations:', err)
    }
  }

  const handleAcceptReservation = async (reservationId: string) => {
    if (!confirm('Confermare questa prenotazione? Il tavolo verrà bloccato automaticamente.')) return

    try {
      const res = await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, action: 'confirm' })
      })

      if (res.ok) {
        await loadReservations()
        await loadAvailability()
        setSaveMessage('Prenotazione confermata!')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (err) {
      console.error('Error accepting reservation:', err)
      alert('Errore durante la conferma')
    }
  }

  const handleRejectReservation = async (reservationId: string) => {
    if (!confirm('Rifiutare questa prenotazione?')) return

    try {
      const res = await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, status: 'rejected' })
      })

      if (res.ok) {
        await loadReservations()
        setSaveMessage('Prenotazione rifiutata')
        setTimeout(() => setSaveMessage(''), 3000)
      }
    } catch (err) {
      console.error('Error rejecting reservation:', err)
      alert('Errore durante il rifiuto')
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
            <h1 className="text-3xl font-bold text-white mb-2">Pannello Amministrazione</h1>
            <p className="text-white/60">Gestisci disponibilità e prenotazioni</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-white transition-colors"
          >
            <FiLogOut /> Esci
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('availability')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'availability'
                ? 'bg-primary-500 text-dark-950'
                : 'bg-dark-800 text-white/70 hover:text-white'
            }`}
          >
            <FiCalendar /> Disponibilità Tavoli
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'reservations'
                ? 'bg-primary-500 text-dark-950'
                : 'bg-dark-800 text-white/70 hover:text-white'
            }`}
          >
            <FiClipboard /> Gestione Prenotazioni
          </button>
        </div>

        {saveMessage && (
          <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400">
            {saveMessage}
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div>
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
            </div>

            {/* Availability Grid */}
            <div className="bg-dark-900 border border-primary-500/20 rounded-xl p-6 overflow-x-auto">
              <p className="text-white/60 mb-4">Blocca i tavoli già prenotati da altri canali (Dish, telefono, ecc.)</p>
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
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'pending'
                    ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                    : 'bg-dark-800 text-white/70 hover:text-white'
                }`}
              >
                Da Confermare ({reservations.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'confirmed'
                    ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                    : 'bg-dark-800 text-white/70 hover:text-white'
                }`}
              >
                Confermate ({reservations.filter(r => r.status === 'confirmed').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'rejected'
                    ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                    : 'bg-dark-800 text-white/70 hover:text-white'
                }`}
              >
                Rifiutate ({reservations.filter(r => r.status === 'rejected').length})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-primary-500/20 border-2 border-primary-500 text-primary-400'
                    : 'bg-dark-800 text-white/70 hover:text-white'
                }`}
              >
                Tutte ({reservations.length})
              </button>
            </div>

            {/* Reservations List */}
            <div className="space-y-4">
              {reservations
                .filter(r => filter === 'all' || r.status === filter)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map(reservation => (
                  <div
                    key={reservation.id}
                    className={`bg-dark-900 border-2 rounded-xl p-6 ${
                      reservation.status === 'pending'
                        ? 'border-yellow-500/30'
                        : reservation.status === 'confirmed'
                        ? 'border-green-500/30'
                        : 'border-red-500/30'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {reservation.firstName} {reservation.lastName}
                        </h3>
                        <p className="text-white/60 text-sm">
                          ID: {reservation.id} | Ricevuta: {new Date(reservation.timestamp).toLocaleString('it-IT')}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        reservation.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : reservation.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {reservation.status === 'pending' ? 'DA CONFERMARE' : 
                         reservation.status === 'confirmed' ? 'CONFERMATA' : 'RIFIUTATA'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-sm mb-1 flex items-center gap-2">
                          <FiCalendar /> Data
                        </p>
                        <p className="text-white font-medium">{reservation.date}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1 flex items-center gap-2">
                          <FiClock /> Orario
                        </p>
                        <p className="text-white font-medium">{reservation.time}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1">Tavolo</p>
                        <p className="text-white font-medium">{reservation.tableId}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1 flex items-center gap-2">
                          <FiUser /> Persone
                        </p>
                        <p className="text-white font-medium">{reservation.guests}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-white/60 text-sm mb-1 flex items-center gap-2">
                          <FiPhone /> Telefono
                        </p>
                        <p className="text-white font-medium">{reservation.phone}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1">Servizio</p>
                        <p className="text-white font-medium">
                          {reservation.serviceType === 'pranzo' ? 'Pranzo' : 
                           reservation.serviceType === 'aperitivo' ? 'Aperitivo' : 'Cena'} 
                          ({reservation.duration}h)
                        </p>
                      </div>
                    </div>

                    {reservation.notes && (
                      <div className="mb-4">
                        <p className="text-white/60 text-sm mb-1">Note</p>
                        <p className="text-white/80">{reservation.notes}</p>
                      </div>
                    )}

                    {reservation.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptReservation(reservation.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                          <FiCheck /> Accetta e Blocca Tavolo
                        </button>
                        <button
                          onClick={() => handleRejectReservation(reservation.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors"
                        >
                          <FiX /> Rifiuta
                        </button>
                      </div>
                    )}
                  </div>
                ))}

              {reservations.filter(r => filter === 'all' || r.status === filter).length === 0 && (
                <div className="text-center py-12 text-white/60">
                  <FiClipboard className="mx-auto text-4xl mb-4" />
                  <p>Nessuna prenotazione {filter !== 'all' && `${filter === 'pending' ? 'da confermare' : filter === 'confirmed' ? 'confermata' : 'rifiutata'}`}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
