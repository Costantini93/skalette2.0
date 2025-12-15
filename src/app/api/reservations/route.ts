import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const RESERVATIONS_FILE = path.join(process.cwd(), 'data', 'reservations.json')

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
  duration: number // in hours
  notes?: string
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
  timestamp: string
}

// Calcola durata in base al tipo di servizio
function getDuration(serviceType: string): number {
  switch (serviceType) {
    case 'pranzo':
      return 2
    case 'aperitivo':
      return 1.5
    case 'cena':
      return 2
    default:
      return 2
  }
}

// GET - Recupera tutte le prenotazioni
export async function GET() {
  try {
    const data = await fs.readFile(RESERVATIONS_FILE, 'utf-8')
    const reservations = JSON.parse(data)
    return NextResponse.json(reservations)
  } catch (error) {
    // Se il file non esiste, crea struttura vuota
    const emptyData = { reservations: [] }
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(emptyData, null, 2))
    return NextResponse.json(emptyData)
  }
}

// POST - Crea nuova prenotazione
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validazione
    if (!body.date || !body.time || !body.tableId || !body.guests || 
        !body.firstName || !body.lastName || !body.phone || !body.serviceType) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      )
    }

    // Leggi prenotazioni esistenti
    let data
    try {
      const fileContent = await fs.readFile(RESERVATIONS_FILE, 'utf-8')
      data = JSON.parse(fileContent)
    } catch {
      data = { reservations: [] }
    }

    // Crea nuova prenotazione
    const newReservation: Reservation = {
      id: `RES-${Date.now()}`,
      date: body.date,
      time: body.time,
      tableId: body.tableId,
      guests: parseInt(body.guests),
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      serviceType: body.serviceType,
      duration: getDuration(body.serviceType),
      notes: body.notes || '',
      status: 'pending',
      timestamp: new Date().toISOString()
    }

    // Aggiungi alla lista
    data.reservations.push(newReservation)

    // Salva
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ 
      success: true, 
      reservation: newReservation 
    })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Errore durante la creazione della prenotazione' },
      { status: 500 }
    )
  }
}

// PUT - Aggiorna stato prenotazione
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { reservationId, status, action } = body

    // Leggi file
    const fileContent = await fs.readFile(RESERVATIONS_FILE, 'utf-8')
    const data = JSON.parse(fileContent)

    // Trova prenotazione
    const reservation = data.reservations.find((r: Reservation) => r.id === reservationId)
    if (!reservation) {
      return NextResponse.json({ error: 'Prenotazione non trovata' }, { status: 404 })
    }

    // Aggiorna status
    if (status) {
      reservation.status = status
    }

    // Se azione è "confirm", blocca anche il tavolo
    if (action === 'confirm') {
      reservation.status = 'confirmed'
      
      // Blocca tavolo in availability.json
      const availabilityFile = path.join(process.cwd(), 'data', 'availability.json')
      let availabilityData
      
      try {
        const availContent = await fs.readFile(availabilityFile, 'utf-8')
        availabilityData = JSON.parse(availContent)
      } catch {
        availabilityData = { blockedSlots: [] }
      }

      // Calcola slot da bloccare in base alla durata
      const blockedSlots = []
      const [hours, minutes] = reservation.time.split(':').map(Number)
      const startMinutes = hours * 60 + minutes
      const durationMinutes = reservation.duration * 60
      
      // Genera slot ogni 30 minuti per la durata
      for (let offset = 0; offset < durationMinutes; offset += 30) {
        const slotMinutes = startMinutes + offset
        const slotHours = Math.floor(slotMinutes / 60)
        const slotMins = slotMinutes % 60
        const slotTime = `${String(slotHours).padStart(2, '0')}:${String(slotMins).padStart(2, '0')}`
        
        blockedSlots.push({
          date: reservation.date,
          time: slotTime,
          tableId: reservation.tableId
        })
      }

      // Aggiungi slot bloccati
      availabilityData.blockedSlots.push(...blockedSlots)
      
      // Salva availability
      await fs.writeFile(availabilityFile, JSON.stringify(availabilityData, null, 2))
    }

    // Se azione è "cancel", sblocca il tavolo e cambia status
    if (action === 'cancel') {
      reservation.status = 'cancelled'
      
      // Sblocca tavolo in availability.json
      const availabilityFile = path.join(process.cwd(), 'data', 'availability.json')
      let availabilityData
      
      try {
        const availContent = await fs.readFile(availabilityFile, 'utf-8')
        availabilityData = JSON.parse(availContent)
      } catch {
        availabilityData = { blockedSlots: [] }
      }

      // Calcola slot da sbloccare in base alla durata
      const [hours, minutes] = reservation.time.split(':').map(Number)
      const startMinutes = hours * 60 + minutes
      const durationMinutes = reservation.duration * 60
      
      // Rimuovi slot bloccati per questa prenotazione
      const slotsToRemove: { date: string; time: string; tableId: string }[] = []
      for (let offset = 0; offset < durationMinutes; offset += 30) {
        const slotMinutes = startMinutes + offset
        const slotHours = Math.floor(slotMinutes / 60)
        const slotMins = slotMinutes % 60
        const slotTime = `${String(slotHours).padStart(2, '0')}:${String(slotMins).padStart(2, '0')}`
        
        slotsToRemove.push({
          date: reservation.date,
          time: slotTime,
          tableId: reservation.tableId
        })
      }

      // Filtra via i slot bloccati
      availabilityData.blockedSlots = availabilityData.blockedSlots.filter(slot => {
        return !slotsToRemove.some(toRemove => 
          toRemove.date === slot.date && 
          toRemove.time === slot.time && 
          toRemove.tableId === slot.tableId
        )
      })
      
      // Salva availability
      await fs.writeFile(availabilityFile, JSON.stringify(availabilityData, null, 2))
    }

    // Salva prenotazioni aggiornate
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(data, null, 2))

    return NextResponse.json({ success: true, reservation })
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento' },
      { status: 500 }
    )
  }
}
