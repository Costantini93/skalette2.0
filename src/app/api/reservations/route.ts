import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initDatabase } from '@/lib/db'

interface BlockedSlot {
  date: string
  time: string
  tableId: string
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
  duration: number // in hours
  notes?: string
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed'
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
    await initDatabase()
    const { rows } = await sql`
      SELECT 
        id,
        date,
        time,
        table_id as "tableId",
        guests,
        first_name as "firstName",
        last_name as "lastName",
        phone,
        service_type as "serviceType",
        duration,
        notes,
        status,
        timestamp
      FROM reservations
      ORDER BY date DESC, time DESC
    `
    return NextResponse.json({ reservations: rows })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json({ reservations: [] })
  }
}

// Funzione per verificare sovrapposizioni tra prenotazioni
function checkOverlap(
  newDate: string,
  newStartTime: string,
  newDuration: number,
  existingReservations: Reservation[],
  tableId: string
): { hasOverlap: boolean; nextReservationTime?: string; availableUntil?: string } {
  const [newHours, newMinutes] = newStartTime.split(':').map(Number)
  const newStartMinutes = newHours * 60 + newMinutes
  const newEndMinutes = newStartMinutes + newDuration * 60

  for (const res of existingReservations) {
    // Ignora prenotazioni cancellate, rifiutate o completate
    if (res.status === 'cancelled' || res.status === 'rejected' || res.status === 'completed') {
      continue
    }

    // Controlla solo prenotazioni dello stesso tavolo e stessa data
    if (res.tableId !== tableId || res.date !== newDate) {
      continue
    }

    const [resHours, resMinutes] = res.time.split(':').map(Number)
    const resStartMinutes = resHours * 60 + resMinutes
    const resEndMinutes = resStartMinutes + res.duration * 60

    // Verifica sovrapposizione: la nuova prenotazione inizia prima che finisca la esistente
    // E la nuova prenotazione finisce dopo che inizia la esistente
    if (newStartMinutes < resEndMinutes && newEndMinutes > resStartMinutes) {
      // C'è sovrapposizione - restituisce l'ora di inizio della prenotazione esistente
      return {
        hasOverlap: true,
        nextReservationTime: res.time,
        availableUntil: res.time
      }
    }
  }

  return { hasOverlap: false } // Nessuna sovrapposizione
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

    await initDatabase()

    // Leggi prenotazioni esistenti
    const { rows } = await sql`
      SELECT 
        id,
        date,
        time,
        table_id as "tableId",
        guests,
        first_name as "firstName",
        last_name as "lastName",
        phone,
        service_type as "serviceType",
        duration,
        notes,
        status,
        timestamp
      FROM reservations
      WHERE date >= CURRENT_DATE
    `

    const duration = getDuration(body.serviceType)

    // Controlla sovrapposizioni con prenotazioni esistenti
    const overlapCheck = checkOverlap(
      body.date,
      body.time,
      duration,
      rows,
      body.tableId
    )

    // Se c'è sovrapposizione e l'utente non ha confermato, restituisci warning
    if (overlapCheck.hasOverlap && !body.confirmOverlap) {
      return NextResponse.json(
        { 
          warning: true,
          availableUntil: overlapCheck.availableUntil,
          message: `Questo tavolo è disponibile fino alle ${overlapCheck.availableUntil}. Vuoi procedere comunque?`
        },
        { status: 200 }
      )
    }

    // Se c'è sovrapposizione e l'utente ha confermato, procedi comunque con la prenotazione
    // (l'admin potrà gestire la situazione manualmente)

    // Crea nuova prenotazione
    const reservationId = `RES-${Date.now()}`
    const timestamp = new Date().toISOString()

    await sql`
      INSERT INTO reservations (
        id, date, time, table_id, guests, first_name, last_name, 
        phone, service_type, duration, notes, status, timestamp
      ) VALUES (
        ${reservationId},
        ${body.date},
        ${body.time},
        ${body.tableId},
        ${parseInt(body.guests)},
        ${body.firstName},
        ${body.lastName},
        ${body.phone},
        ${body.serviceType},
        ${duration},
        ${body.notes || ''},
        'pending',
        ${timestamp}
      )
    `

    const newReservation = {
      id: reservationId,
      date: body.date,
      time: body.time,
      tableId: body.tableId,
      guests: parseInt(body.guests),
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      serviceType: body.serviceType,
      duration: duration,
      notes: body.notes || '',
      status: 'pending',
      timestamp: timestamp
    }

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

    await initDatabase()

    // Trova prenotazione
    const { rows } = await sql`
      SELECT 
        id,
        date,
        time,
        table_id as "tableId",
        guests,
        first_name as "firstName",
        last_name as "lastName",
        phone,
        service_type as "serviceType",
        duration,
        notes,
        status,
        timestamp
      FROM reservations
      WHERE id = ${reservationId}
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Prenotazione non trovata' }, { status: 404 })
    }

    const reservation = rows[0]
    let newStatus = status || reservation.status

    // Se azione è "confirm", blocca anche il tavolo
    if (action === 'confirm') {
      newStatus = 'confirmed'
      
      // Calcola slot da bloccare in base alla durata
      const [hours, minutes] = reservation.time.split(':').map(Number)
      const startMinutes = hours * 60 + minutes
      const durationMinutes = reservation.duration * 60
      
      // Genera e inserisci slot bloccati
      for (let offset = 0; offset < durationMinutes; offset += 30) {
        const slotMinutes = startMinutes + offset
        const slotHours = Math.floor(slotMinutes / 60)
        const slotMins = slotMinutes % 60
        const slotTime = `${String(slotHours).padStart(2, '0')}:${String(slotMins).padStart(2, '0')}`
        
        await sql`
          INSERT INTO blocked_slots (date, time, table_id)
          VALUES (${reservation.date}, ${slotTime}, ${reservation.tableId})
          ON CONFLICT (date, time, table_id) DO NOTHING
        `
      }
    }

    // Se azione è "cancel" o "complete", sblocca il tavolo
    if (action === 'cancel' || action === 'complete') {
      newStatus = action === 'cancel' ? 'cancelled' : 'completed'
      
      // Calcola slot da sbloccare
      const [hours, minutes] = reservation.time.split(':').map(Number)
      const startMinutes = hours * 60 + minutes
      const durationMinutes = reservation.duration * 60
      
      // Rimuovi slot bloccati per questa prenotazione
      for (let offset = 0; offset < durationMinutes; offset += 30) {
        const slotMinutes = startMinutes + offset
        const slotHours = Math.floor(slotMinutes / 60)
        const slotMins = slotMinutes % 60
        const slotTime = `${String(slotHours).padStart(2, '0')}:${String(slotMins).padStart(2, '0')}`
        
        await sql`
          DELETE FROM blocked_slots
          WHERE date = ${reservation.date}
            AND time = ${slotTime}
            AND table_id = ${reservation.tableId}
        `
      }
    }

    // Aggiorna status prenotazione
    await sql`
      UPDATE reservations
      SET status = ${newStatus}
      WHERE id = ${reservationId}
    `

    return NextResponse.json({ 
      success: true, 
      reservation: { ...reservation, status: newStatus }
    })
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento' },
      { status: 500 }
    )
  }
}
