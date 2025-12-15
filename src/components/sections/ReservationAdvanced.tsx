'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCalendar, FiUsers, FiClock, FiPhone, FiUser, FiMessageSquare, FiCheck, FiAlertCircle } from 'react-icons/fi'
import MagneticButton from '../ui/MagneticButton'

interface BlockedSlot {
  date: string
  time: string
  tableId: string
}

interface Table {
  id: string
  name: string
  minSeats: number
  maxSeats: number
  type: 'sgabello' | 'tavolo'
}

interface TablePosition {
  x: number
  y: number
  width: number
  height: number
  radius?: number
}

const tables: Table[] = [
  { id: 'B1', name: 'Bancone B1', minSeats: 1, maxSeats: 4, type: 'sgabello' },
  { id: 'B2', name: 'Bancone B2', minSeats: 1, maxSeats: 4, type: 'sgabello' },
  { id: 'B3', name: 'Bancone B3', minSeats: 1, maxSeats: 4, type: 'sgabello' },
  { id: 'S1', name: 'Tavolo S1', minSeats: 3, maxSeats: 5, type: 'tavolo' },
  { id: 'S2', name: 'Tavolo S2', minSeats: 2, maxSeats: 3, type: 'tavolo' },
  { id: 'S3', name: 'Tavolo S3', minSeats: 3, maxSeats: 5, type: 'tavolo' },
  { id: 'S4', name: 'Tavolo S4', minSeats: 1, maxSeats: 2, type: 'tavolo' },
  { id: 'S5', name: 'Tavolo S5', minSeats: 1, maxSeats: 2, type: 'tavolo' },
  { id: 'S6', name: 'Tavolo S6', minSeats: 1, maxSeats: 2, type: 'tavolo' },
  { id: 'S7', name: 'Tavolo S7', minSeats: 1, maxSeats: 2, type: 'tavolo' },
  { id: 'S8', name: 'Tavolo S8', minSeats: 3, maxSeats: 5, type: 'tavolo' },
]

export default function ReservationAdvanced() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [step, setStep] = useState(1) // 1: Persone, 2: Tavolo, 3: Dettagli
  const [formData, setFormData] = useState({
    guests: '',
    selectedTable: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    phone: '',
    notes: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [availableTables, setAvailableTables] = useState<Table[]>([])
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([])

  // Carica disponibilità dal server
  useEffect(() => {
    loadAvailability()
  }, [])

  const loadAvailability = async () => {
    try {
      const res = await fetch('/api/availability')
      const data = await res.json()
      setBlockedSlots(data.blockedSlots || [])
    } catch (err) {
      console.error('Failed to load availability:', err)
    }
  }

  // Controlla se un tavolo è bloccato per data/ora
  const isTableBlocked = (tableId: string, date: string, time: string) => {
    return blockedSlots.some(
      slot => slot.tableId === tableId && slot.date === date && slot.time === time
    )
  }

  // Verifica se un tavolo è compatibile con il numero di ospiti
  const isTableCompatibleWithGuests = (tableId: string) => {
    if (!formData.guests) return true
    const numGuests = parseInt(formData.guests)
    if (isNaN(numGuests) || numGuests === 0) return true
    
    const table = tables.find(t => t.id === tableId)
    if (!table) return false
    
    return numGuests >= table.minSeats && numGuests <= table.maxSeats
  }

  // Coordinate finali ottimizzate
  const tablePositions: Record<string, TablePosition> = {
    banco: { x: 90, y: 155, width: 400, height: 105 },
    scala: { x: 433, y: 293, width: 100, height: 100 },
    entrata: { x: 15, y: 331, width: 50, height: 100 },
    S1: { x: 585, y: 126, width: 160, height: 105 },
    S2: { x: 825, y: 103, width: 100, height: 100, radius: 58 },
    S3: { x: 1005, y: 126, width: 160, height: 105 },
    B3: { x: 79, y: 457, width: 100, height: 105 },
    B2: { x: 209, y: 459, width: 100, height: 105 },
    B1: { x: 338, y: 461, width: 100, height: 105 },
    S8: { x: 504, y: 420, width: 160, height: 105 },
    S7: { x: 693, y: 420, width: 100, height: 105 },
    S6: { x: 816, y: 420, width: 100, height: 105 },
    S5: { x: 940, y: 420, width: 100, height: 105 },
    S4: { x: 1064, y: 420, width: 100, height: 105 },
    divano: { x: 485, y: 540, width: 690, height: 50 },
    divanoS1: { x: 584, y: 57, width: 160, height: 50 },
    divanoS2: { x: 811, y: 36, width: 140, height: 50 },
    divanoS3: { x: 1006, y: 57, width: 160, height: 50 }
  }

  const handleGuestsChange = (guests: string) => {
    const numGuests = parseInt(guests)
    setFormData({ ...formData, guests, selectedTable: '' })

    if (numGuests >= 6) {
      setAvailableTables([])
    } else if (numGuests > 0) {
      // Filtra per numero persone E per disponibilità (se data/ora sono già selezionate)
      let filtered = tables.filter(
        (table) => numGuests >= table.minSeats && numGuests <= table.maxSeats
      )
      
      // Se data e ora sono già selezionate, rimuovi tavoli bloccati
      if (formData.date && formData.time) {
        filtered = filtered.filter(
          table => !isTableBlocked(table.id, formData.date, formData.time)
        )
      }
      
      setAvailableTables(filtered)
    } else {
      setAvailableTables([])
    }
  }

  // Aggiorna tavoli disponibili quando cambiano data/ora
  const handleDateTimeChange = (field: 'date' | 'time', value: string) => {
    const newFormData = { ...formData, [field]: value, selectedTable: '' }
    setFormData(newFormData)

    // Se abbiamo ospiti, data e ora, filtra i tavoli disponibili
    if (newFormData.guests && newFormData.date && newFormData.time) {
      const numGuests = parseInt(newFormData.guests)
      let filtered = tables.filter(
        (table) => numGuests >= table.minSeats && numGuests <= table.maxSeats
      )
      
      filtered = filtered.filter(
        table => !isTableBlocked(table.id, newFormData.date, newFormData.time)
      )
      
      setAvailableTables(filtered)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Crea evento per calendario
    const startDate = new Date(`${formData.date}T${formData.time}`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // +2 ore

    const event = {
      title: `⏳ SKALETTE - Prenotazione in Attesa di Conferma - ${formData.firstName} ${formData.lastName}`,
      description: `Tavolo: ${formData.selectedTable}\nPersone: ${formData.guests}\nTelefono: ${formData.phone}\nNote: ${formData.notes}`,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    }

    // Genera file .ics per Google Calendar, Apple Calendar, Outlook
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SKALETTE BISTRO//Reservations//EN
BEGIN:VEVENT
UID:${Date.now()}@skalette.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:SKALETTE BISTRO
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    // Download file .ics
    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `prenotazione-skalette-${formData.date}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setStep(1)
      setFormData({
        guests: '',
        selectedTable: '',
        date: '',
        time: '',
        firstName: '',
        lastName: '',
        phone: '',
        notes: '',
      })
    }, 5000)
  }

  const isStepValid = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return formData.guests && parseInt(formData.guests) > 0 && parseInt(formData.guests) < 6
      case 2:
        return formData.selectedTable && formData.date && formData.time
      case 3:
        return formData.firstName && formData.lastName && formData.phone
      default:
        return false
    }
  }

  return (
    <section id="prenota" className="py-20 bg-dark-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-primary-400 font-serif text-lg md:text-xl mb-4 block"
          >
            Prenota il Tuo Tavolo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Richiedi la Tua <span className="text-gradient">Prenotazione</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Seleziona il numero di ospiti, scegli il tuo tavolo preferito e invia la richiesta. Ti confermeremo la disponibilità entro 24 ore
          </motion.p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'bg-primary-500 text-dark-950'
                    : 'bg-dark-800 text-white/50'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 md:w-24 h-1 transition-all ${
                    step > s ? 'bg-primary-500' : 'bg-dark-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-2xl mx-auto glass-effect p-8 rounded-2xl text-center"
            >
              <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheck className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Richiesta Inviata!</h3>
              <p className="text-white/70 mb-4">
                Abbiamo ricevuto la tua richiesta di prenotazione. Ti confermeremo la disponibilità entro 24 ore via telefono o SMS.
              </p>
              <p className="text-white/60 text-sm mb-4">
                Telefono: {formData.phone}
              </p>
              <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                <p className="text-sm text-white/80">
                  💡 <strong>Nota:</strong> Il file calendario scaricato contiene la prenotazione provvisoria. Aggiungi il promemoria, ma attendi la nostra conferma prima di considerarla definitiva.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="max-w-4xl mx-auto"
            >
              {/* Step 1: Numero Persone */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass-effect p-8 rounded-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FiUsers className="text-primary-400" />
                    Numero di Persone
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleGuestsChange(num.toString())}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          formData.guests === num.toString()
                            ? 'border-primary-500 bg-primary-500/10'
                            : 'border-dark-700 hover:border-primary-500/50'
                        }`}
                      >
                        <div className="text-4xl font-bold">{num}</div>
                        <div className="text-sm text-white/60 mt-2">
                          {num === 1 ? 'persona' : 'persone'}
                        </div>
                      </button>
                    ))}
                  </div>

                  {formData.guests && parseInt(formData.guests) >= 6 && (
                    <div className="bg-accent-500/10 border border-accent-500 rounded-xl p-6 flex items-start gap-4">
                      <FiAlertCircle className="text-accent-400 text-2xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-lg mb-2">Per gruppi da 6+ persone</h4>
                        <p className="text-white/70 mb-3">
                          Per prenotazioni di 6 o più persone, ti preghiamo di contattarci telefonicamente per organizzare al meglio il tuo evento.
                        </p>
                        <a
                          href="tel:+39000000000"
                          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold"
                        >
                          <FiPhone /> +39 000 000 0000
                        </a>
                      </div>
                    </div>
                  )}

                  {isStepValid(1) && (
                    <div className="mt-8 flex justify-end">
                      <MagneticButton
                        variant="primary"
                        size="large"
                        onClick={() => setStep(2)}
                      >
                        Continua
                      </MagneticButton>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Selezione Tavolo + Data/Ora */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="glass-effect p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-6">Scegli il Tuo Tavolo</h3>
                    
                    {/* Mappa Locale Elegante */}
                    <div className="mb-8 relative">
                      <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-dark-900 to-dark-950 rounded-2xl p-8 shadow-2xl border border-primary-900/20">
                        {/* Titolo Mappa */}
                        <div className="text-center mb-6">
                          <h4 className="text-lg font-semibold text-primary-400">Layout del Locale</h4>
                          <p className="text-sm text-white/60">Seleziona il tuo tavolo dalla lista qui sotto</p>
                        </div>

                        {/* SVG Mappa */}
                        <svg 
                          viewBox="0 0 1200 600" 
                          className="w-full h-auto"
                        >
                          {/* Sfondo con griglia leggera */}
                          <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
                            </pattern>
                            <filter id="glow">
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                          </defs>
                          
                          <rect width="1200" height="600" fill="url(#grid)"/>

                          {/* ENTRATA - Sinistra */}
                          {tablePositions.entrata && (
                            <g>
                              <rect 
                                x={tablePositions.entrata.x} 
                                y={tablePositions.entrata.y} 
                                width={tablePositions.entrata.width} 
                                height={tablePositions.entrata.height} 
                                rx="8" 
                                fill="rgba(212, 175, 55, 0.08)" 
                                stroke="#D4AF37"
                                strokeWidth="2.5"
                                strokeDasharray="10,5"
                              />
                              <text 
                                x={tablePositions.entrata.x + tablePositions.entrata.width/2} 
                                y={tablePositions.entrata.y + tablePositions.entrata.height/2} 
                                textAnchor="middle" 
                                fill="#D4AF37" 
                                fontSize="14" 
                                fontWeight="500" 
                                transform={`rotate(-90 ${tablePositions.entrata.x + tablePositions.entrata.width/2} ${tablePositions.entrata.y + tablePositions.entrata.height/2})`}
                                style={{ pointerEvents: 'none' }}
                              >
                                ENTRATA
                              </text>
                            </g>
                          )}

                          {/* B3, B2, B1 */}
                          {tablePositions.B3 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('B3', formData.date, formData.time)) || !isTableCompatibleWithGuests('B3') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.B3.x} 
                                y={tablePositions.B3.y} 
                                width={tablePositions.B3.width} 
                                height={tablePositions.B3.height} 
                                rx="8"
                                fill={formData.selectedTable === 'B3' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('B3', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('B3', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'B3' ? '4' : '2.5'}
                                filter={formData.selectedTable === 'B3' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.B3.x + tablePositions.B3.width/2} y={tablePositions.B3.y + tablePositions.B3.height/2 - 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('B3', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="20" fontWeight="bold" style={{ pointerEvents: 'none' }}>B3</text>
                              <text x={tablePositions.B3.x + tablePositions.B3.width/2} y={tablePositions.B3.y + tablePositions.B3.height/2 + 15} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('B3', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="11" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('B3', formData.date, formData.time) ? '🔒 Occupato' : '1-4 posti'}</text>
                            </g>
                          )}

                          {tablePositions.B2 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('B2', formData.date, formData.time)) || !isTableCompatibleWithGuests('B2') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.B2.x} 
                                y={tablePositions.B2.y} 
                                width={tablePositions.B2.width} 
                                height={tablePositions.B2.height} 
                                rx="8"
                                fill={formData.selectedTable === 'B2' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('B2', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('B2', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'B2' ? '4' : '2.5'}
                                filter={formData.selectedTable === 'B2' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.B2.x + tablePositions.B2.width/2} y={tablePositions.B2.y + tablePositions.B2.height/2 - 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('B2', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="20" fontWeight="bold" style={{ pointerEvents: 'none' }}>B2</text>
                              <text x={tablePositions.B2.x + tablePositions.B2.width/2} y={tablePositions.B2.y + tablePositions.B2.height/2 + 15} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('B2', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="11" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('B2', formData.date, formData.time) ? '🔒 Occupato' : '1-4 posti'}</text>
                            </g>
                          )}

                          {tablePositions.B1 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('B1', formData.date, formData.time)) || !isTableCompatibleWithGuests('B1') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.B1.x} 
                                y={tablePositions.B1.y} 
                                width={tablePositions.B1.width} 
                                height={tablePositions.B1.height} 
                                rx="8"
                                fill={formData.selectedTable === 'B1' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('B1', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('B1', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'B1' ? '4' : '2.5'}
                                filter={formData.selectedTable === 'B1' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.B1.x + tablePositions.B1.width/2} y={tablePositions.B1.y + tablePositions.B1.height/2 - 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('B1', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="20" fontWeight="bold" style={{ pointerEvents: 'none' }}>B1</text>
                              <text x={tablePositions.B1.x + tablePositions.B1.width/2} y={tablePositions.B1.y + tablePositions.B1.height/2 + 15} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('B1', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="11" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('B1', formData.date, formData.time) ? '🔒 Occupato' : '1-4 posti'}</text>
                            </g>
                          )}

                          {/* BANCO - Grande area alta sinistra */}
                          {tablePositions.banco && (
                            <g>
                              <rect 
                                x={tablePositions.banco.x} 
                                y={tablePositions.banco.y} 
                                width={tablePositions.banco.width} 
                                height={tablePositions.banco.height} 
                                rx="10"
                                fill="rgba(212, 175, 55, 0.08)"
                                stroke="#D4AF37"
                                strokeWidth="2.5"
                              />
                              <text x={tablePositions.banco.x + tablePositions.banco.width/2} y={tablePositions.banco.y + tablePositions.banco.height/2 + 5} textAnchor="middle" fill="#D4AF37" fontSize="28" fontWeight="bold" opacity="0.5" style={{ pointerEvents: 'none' }}>BANCO</text>
                            </g>
                          )}

                          {/* SCALA - Centro più in basso */}
                          {tablePositions.scala && (
                            <g>
                              <rect 
                                x={tablePositions.scala.x} 
                                y={tablePositions.scala.y} 
                                width={tablePositions.scala.width} 
                                height={tablePositions.scala.height} 
                                rx="8"
                                fill="rgba(212, 175, 55, 0.06)"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                opacity="0.5"
                              />
                              <line x1={tablePositions.scala.x + 10} y1={tablePositions.scala.y + 5} x2={tablePositions.scala.x + 10} y2={tablePositions.scala.y + tablePositions.scala.height - 5} stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" style={{ pointerEvents: 'none' }}/>
                              <line x1={tablePositions.scala.x + 25} y1={tablePositions.scala.y + 5} x2={tablePositions.scala.x + 25} y2={tablePositions.scala.y + tablePositions.scala.height - 5} stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" style={{ pointerEvents: 'none' }}/>
                              <line x1={tablePositions.scala.x + 40} y1={tablePositions.scala.y + 5} x2={tablePositions.scala.x + 40} y2={tablePositions.scala.y + tablePositions.scala.height - 5} stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" style={{ pointerEvents: 'none' }}/>
                              <line x1={tablePositions.scala.x + 55} y1={tablePositions.scala.y + 5} x2={tablePositions.scala.x + 55} y2={tablePositions.scala.y + tablePositions.scala.height - 5} stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" style={{ pointerEvents: 'none' }}/>
                              <line x1={tablePositions.scala.x + 70} y1={tablePositions.scala.y + 5} x2={tablePositions.scala.x + 70} y2={tablePositions.scala.y + tablePositions.scala.height - 5} stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" style={{ pointerEvents: 'none' }}/>
                              <line x1={tablePositions.scala.x + 85} y1={tablePositions.scala.y + 5} x2={tablePositions.scala.x + 85} y2={tablePositions.scala.y + tablePositions.scala.height - 5} stroke="#D4AF37" strokeWidth="1.5" opacity="0.5" style={{ pointerEvents: 'none' }}/>
                              <text x={tablePositions.scala.x + tablePositions.scala.width/2} y={tablePositions.scala.y + tablePositions.scala.height + 20} textAnchor="middle" fill="#D4AF37" fontSize="12" fontWeight="500" opacity="0.5" style={{ pointerEvents: 'none' }}>SCALA</text>
                            </g>
                          )}

                          {/* S1 - Sinistra */}
                          {tablePositions.S1 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S1', formData.date, formData.time)) || !isTableCompatibleWithGuests('S1') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.S1.x} 
                                y={tablePositions.S1.y} 
                                width={tablePositions.S1.width} 
                                height={tablePositions.S1.height} 
                                rx="10"
                                fill={formData.selectedTable === 'S1' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S1', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S1', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S1' ? '4' : '2.5'}
                                filter={formData.selectedTable === 'S1' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S1.x + tablePositions.S1.width/2} y={tablePositions.S1.y + tablePositions.S1.height/2 + 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S1', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="22" fontWeight="bold" style={{ pointerEvents: 'none' }}>S1</text>
                              <text x={tablePositions.S1.x + tablePositions.S1.width/2} y={tablePositions.S1.y + tablePositions.S1.height/2 + 23} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S1', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="11" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S1', formData.date, formData.time) ? '🔒 Occupato' : '3-5 posti'}</text>
                            </g>
                          )}

                          {/* S3 - Destra */}
                          {tablePositions.S3 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S3', formData.date, formData.time)) || !isTableCompatibleWithGuests('S3') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.S3.x} 
                                y={tablePositions.S3.y} 
                                width={tablePositions.S3.width} 
                                height={tablePositions.S3.height} 
                                rx="10"
                                fill={formData.selectedTable === 'S3' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S3', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S3', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S3' ? '4' : '2.5'}
                                filter={formData.selectedTable === 'S3' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S3.x + tablePositions.S3.width/2} y={tablePositions.S3.y + tablePositions.S3.height/2 + 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S3', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="22" fontWeight="bold" style={{ pointerEvents: 'none' }}>S3</text>
                              <text x={tablePositions.S3.x + tablePositions.S3.width/2} y={tablePositions.S3.y + tablePositions.S3.height/2 + 23} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S3', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="11" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S3', formData.date, formData.time) ? '🔒 Occupato' : '3-5 posti'}</text>
                            </g>
                          )}

                          {/* S2 - Centro Circolare */}
                          {tablePositions.S2 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S2', formData.date, formData.time)) || !isTableCompatibleWithGuests('S2') ? '0.3' : '1'}>
                              <circle 
                                cx={tablePositions.S2.x + (tablePositions.S2.radius || 58)} 
                                cy={tablePositions.S2.y + (tablePositions.S2.radius || 58)} 
                                r={tablePositions.S2.radius || 58}
                                fill={formData.selectedTable === 'S2' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S2', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S2', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S2' ? '4' : '2.5'}
                                filter={formData.selectedTable === 'S2' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S2.x + 58} y={tablePositions.S2.y + 61} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S2', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="24" fontWeight="bold" style={{ pointerEvents: 'none' }}>S2</text>
                              <text x={tablePositions.S2.x + 58} y={tablePositions.S2.y + 79} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S2', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="11" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S2', formData.date, formData.time) ? '🔒 Occupato' : '2-3 posti'}</text>
                            </g>
                          )}

                          {/* S8 - Tavolo Grande Basso Sinistra */}
                          {tablePositions.S8 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S8', formData.date, formData.time)) || !isTableCompatibleWithGuests('S8') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.S8.x} 
                                y={tablePositions.S8.y} 
                                width={tablePositions.S8.width} 
                                height={tablePositions.S8.height} 
                                rx="10"
                                fill={formData.selectedTable === 'S8' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S8', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S8', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S8' ? '4' : '2.5'}
                                filter={formData.selectedTable === 'S8' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S8.x + tablePositions.S8.width/2} y={tablePositions.S8.y + tablePositions.S8.height/2 + 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S8', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="22" fontWeight="bold" style={{ pointerEvents: 'none' }}>S8</text>
                              <text x={tablePositions.S8.x + tablePositions.S8.width/2} y={tablePositions.S8.y + tablePositions.S8.height/2 + 23} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S8', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="11" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S8', formData.date, formData.time) ? '🔒 Occupato' : '3-5 posti'}</text>
                            </g>
                          )}

                          {/* S7 */}
                          {tablePositions.S7 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S7', formData.date, formData.time)) || !isTableCompatibleWithGuests('S7') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.S7.x} 
                                y={tablePositions.S7.y} 
                                width={tablePositions.S7.width} 
                                height={tablePositions.S7.height} 
                                rx="8"
                                fill={formData.selectedTable === 'S7' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S7', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S7', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S7' ? '3.5' : '2.5'}
                                filter={formData.selectedTable === 'S7' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S7.x + tablePositions.S7.width/2} y={tablePositions.S7.y + tablePositions.S7.height/2 + 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S7', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="18" fontWeight="bold" style={{ pointerEvents: 'none' }}>S7</text>
                              <text x={tablePositions.S7.x + tablePositions.S7.width/2} y={tablePositions.S7.y + tablePositions.S7.height/2 + 20} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S7', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="10" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S7', formData.date, formData.time) ? '🔒' : '1-2 p'}</text>
                            </g>
                          )}

                          {/* S6 */}
                          {tablePositions.S6 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S6', formData.date, formData.time)) || !isTableCompatibleWithGuests('S6') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.S6.x} 
                                y={tablePositions.S6.y} 
                                width={tablePositions.S6.width} 
                                height={tablePositions.S6.height} 
                                rx="8"
                                fill={formData.selectedTable === 'S6' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S6', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S6', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S6' ? '3.5' : '2.5'}
                                filter={formData.selectedTable === 'S6' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S6.x + tablePositions.S6.width/2} y={tablePositions.S6.y + tablePositions.S6.height/2 + 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S6', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="18" fontWeight="bold" style={{ pointerEvents: 'none' }}>S6</text>
                              <text x={tablePositions.S6.x + tablePositions.S6.width/2} y={tablePositions.S6.y + tablePositions.S6.height/2 + 20} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S6', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="10" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S6', formData.date, formData.time) ? '🔒' : '1-2 p'}</text>
                            </g>
                          )}

                          {/* S5 */}
                          {tablePositions.S5 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S5', formData.date, formData.time)) || !isTableCompatibleWithGuests('S5') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.S5.x} 
                                y={tablePositions.S5.y} 
                                width={tablePositions.S5.width} 
                                height={tablePositions.S5.height} 
                                rx="8"
                                fill={formData.selectedTable === 'S5' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S5', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S5', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S5' ? '3.5' : '2.5'}
                                filter={formData.selectedTable === 'S5' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S5.x + tablePositions.S5.width/2} y={tablePositions.S5.y + tablePositions.S5.height/2 + 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S5', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="18" fontWeight="bold" style={{ pointerEvents: 'none' }}>S5</text>
                              <text x={tablePositions.S5.x + tablePositions.S5.width/2} y={tablePositions.S5.y + tablePositions.S5.height/2 + 20} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S5', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="10" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S5', formData.date, formData.time) ? '🔒' : '1-2 p'}</text>
                            </g>
                          )}

                          {/* S4 */}
                          {tablePositions.S4 && (
                            <g opacity={(formData.date && formData.time && isTableBlocked('S4', formData.date, formData.time)) || !isTableCompatibleWithGuests('S4') ? '0.3' : '1'}>
                              <rect 
                                x={tablePositions.S4.x} 
                                y={tablePositions.S4.y} 
                                width={tablePositions.S4.width} 
                                height={tablePositions.S4.height} 
                                rx="8"
                                fill={formData.selectedTable === 'S4' ? 'rgba(212, 175, 55, 0.25)' : (formData.date && formData.time && isTableBlocked('S4', formData.date, formData.time) ? 'rgba(255, 0, 0, 0.15)' : 'rgba(212, 175, 55, 0.08)')}
                                stroke={formData.date && formData.time && isTableBlocked('S4', formData.date, formData.time) ? '#FF0000' : '#D4AF37'}
                                strokeWidth={formData.selectedTable === 'S4' ? '3.5' : '2.5'}
                                filter={formData.selectedTable === 'S4' ? 'url(#glow)' : ''}
                              />
                              <text x={tablePositions.S4.x + tablePositions.S4.width/2} y={tablePositions.S4.y + tablePositions.S4.height/2 + 5} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S4', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="18" fontWeight="bold" style={{ pointerEvents: 'none' }}>S4</text>
                              <text x={tablePositions.S4.x + tablePositions.S4.width/2} y={tablePositions.S4.y + tablePositions.S4.height/2 + 20} textAnchor="middle" fill={formData.date && formData.time && isTableBlocked('S4', formData.date, formData.time) ? '#FFFFFF' : '#D4AF37'} fontSize="10" opacity="1" style={{ pointerEvents: 'none' }}>{formData.date && formData.time && isTableBlocked('S4', formData.date, formData.time) ? '🔒' : '1-2 p'}</text>
                            </g>
                          )}

                          {/* DIVANO - Sotto i tavoli bassi */}
                          {tablePositions.divano && (
                            <g>
                              <rect 
                                x={tablePositions.divano.x} 
                                y={tablePositions.divano.y} 
                                width={tablePositions.divano.width} 
                                height={tablePositions.divano.height} 
                                rx="6"
                                fill="rgba(212, 175, 55, 0.06)"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                opacity="0.5"
                              />
                              <text x={tablePositions.divano.x + tablePositions.divano.width/2} y={tablePositions.divano.y + tablePositions.divano.height/2 + 4} textAnchor="middle" fill="#D4AF37" fontSize="12" fontWeight="500" opacity="0.5" style={{ pointerEvents: 'none' }}>DIVANO</text>
                            </g>
                          )}

                          {/* DIVANO S1 */}
                          {tablePositions.divanoS1 && (
                            <g>
                              <rect 
                                x={tablePositions.divanoS1.x} 
                                y={tablePositions.divanoS1.y} 
                                width={tablePositions.divanoS1.width} 
                                height={tablePositions.divanoS1.height} 
                                rx="4"
                                fill="rgba(212, 175, 55, 0.06)"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                opacity="0.5"
                              />
                              <text x={tablePositions.divanoS1.x + tablePositions.divanoS1.width/2} y={tablePositions.divanoS1.y + tablePositions.divanoS1.height/2 + 3} textAnchor="middle" fill="#D4AF37" fontSize="9" fontWeight="500" opacity="0.5" style={{ pointerEvents: 'none' }}>DIVANO</text>
                            </g>
                          )}

                          {/* DIVANO S2 */}
                          {tablePositions.divanoS2 && (
                            <g>
                              <rect 
                                x={tablePositions.divanoS2.x} 
                                y={tablePositions.divanoS2.y} 
                                width={tablePositions.divanoS2.width} 
                                height={tablePositions.divanoS2.height} 
                                rx="4"
                                fill="rgba(212, 175, 55, 0.06)"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                opacity="0.5"
                              />
                              <text x={tablePositions.divanoS2.x + tablePositions.divanoS2.width/2} y={tablePositions.divanoS2.y + tablePositions.divanoS2.height/2 + 3} textAnchor="middle" fill="#D4AF37" fontSize="9" fontWeight="500" opacity="0.5" style={{ pointerEvents: 'none' }}>DIVANO</text>
                            </g>
                          )}

                          {/* DIVANO S3 */}
                          {tablePositions.divanoS3 && (
                            <g>
                              <rect 
                                x={tablePositions.divanoS3.x} 
                                y={tablePositions.divanoS3.y} 
                                width={tablePositions.divanoS3.width} 
                                height={tablePositions.divanoS3.height} 
                                rx="4"
                                fill="rgba(212, 175, 55, 0.06)"
                                stroke="#D4AF37"
                                strokeWidth="2"
                                opacity="0.5"
                              />
                              <text x={tablePositions.divanoS3.x + tablePositions.divanoS3.width/2} y={tablePositions.divanoS3.y + tablePositions.divanoS3.height/2 + 3} textAnchor="middle" fill="#D4AF37" fontSize="9" fontWeight="500" opacity="0.5" style={{ pointerEvents: 'none' }}>DIVANO</text>
                            </g>
                          )}
                        </svg>

                        {/* Indicatore Selezione */}
                        {formData.selectedTable && (
                          <div className="mt-6 flex justify-center">
                            <div className="bg-primary-500/10 px-6 py-3 rounded-xl border border-primary-500/30 backdrop-blur-sm">
                              <span className="text-primary-400 font-bold text-lg">✓ Selezionato: {formData.selectedTable}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xl font-semibold mb-4 text-center">Seleziona dalla lista:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableTables.map((table) => (
                        <button
                          key={table.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, selectedTable: table.id })
                          }
                          className={`p-6 rounded-xl border-2 transition-all text-left ${
                            formData.selectedTable === table.id
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-dark-700 hover:border-primary-500/50'
                          }`}
                        >
                          <div className="font-bold text-xl mb-2">{table.name}</div>
                          <div className="text-sm text-white/60">
                            {table.minSeats === table.maxSeats
                              ? `${table.maxSeats} persone`
                              : `${table.minSeats}-${table.maxSeats} persone`}
                          </div>
                          <div className="text-xs text-primary-400 mt-2">
                            {table.type === 'sgabello' ? '🪑 Sgabelli' : '🪑 Tavolo'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="glass-effect p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-6">Data e Orario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 mb-2 font-medium">
                          <FiCalendar className="inline mr-2" />
                          Data
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleDateTimeChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2 font-medium">
                          <FiClock className="inline mr-2" />
                          Orario
                        </label>
                        <select
                          value={formData.time}
                          onChange={(e) => handleDateTimeChange('time', e.target.value)}
                          className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                          required
                        >
                          <option value="">Seleziona orario</option>
                          <option value="12:00">12:00</option>
                          <option value="12:30">12:30</option>
                          <option value="13:00">13:00</option>
                          <option value="13:30">13:30</option>
                          <option value="19:00">19:00</option>
                          <option value="19:30">19:30</option>
                          <option value="20:00">20:00</option>
                          <option value="20:30">20:30</option>
                          <option value="21:00">21:00</option>
                          <option value="21:30">21:30</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <MagneticButton
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Indietro
                    </MagneticButton>
                    {isStepValid(2) && (
                      <MagneticButton
                        variant="primary"
                        size="large"
                        onClick={() => setStep(3)}
                      >
                        Continua
                      </MagneticButton>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Dettagli Personali */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass-effect p-8 rounded-2xl"
                >
                  <h3 className="text-2xl font-bold mb-6">I Tuoi Dati</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        <FiUser className="inline mr-2" />
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">
                        <FiUser className="inline mr-2" />
                        Cognome *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-white/80 mb-2 font-medium">
                      <FiPhone className="inline mr-2" />
                      Numero di Telefono *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+39 000 000 0000"
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-white/80 mb-2 font-medium">
                      <FiMessageSquare className="inline mr-2" />
                      Note (Opzionale)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={4}
                      placeholder="Allergie, intolleranze, richieste speciali..."
                      className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl focus:outline-none focus:border-primary-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Riepilogo */}
                  <div className="bg-dark-900/50 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-lg mb-4">Riepilogo Prenotazione</h4>
                    <div className="space-y-2 text-white/70">
                      <div><strong>Persone:</strong> {formData.guests}</div>
                      <div><strong>Tavolo:</strong> {formData.selectedTable}</div>
                      <div><strong>Data:</strong> {formData.date}</div>
                      <div><strong>Orario:</strong> {formData.time}</div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <MagneticButton
                      variant="outline"
                      onClick={() => setStep(2)}
                    >
                      Indietro
                    </MagneticButton>
                    {isStepValid(3) && (
                      <MagneticButton variant="primary" size="large">
                        Conferma Prenotazione
                      </MagneticButton>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
