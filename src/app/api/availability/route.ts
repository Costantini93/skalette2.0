import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initDatabase } from '@/lib/db'

// Leggi disponibilità
export async function GET() {
  try {
    await initDatabase()
    const { rows } = await sql`
      SELECT date, time, table_id as "tableId"
      FROM blocked_slots
      ORDER BY date, time
    `
    return NextResponse.json({ blockedSlots: rows })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ blockedSlots: [] })
  }
}

// Aggiungi o rimuovi singolo slot
export async function POST(request: Request) {
  try {
    const body = await request.json()
    await initDatabase()
    
    const { action, date, time, tableId } = body
    
    if (action === 'block') {
      // Aggiungi slot bloccato
      await sql`
        INSERT INTO blocked_slots (date, time, table_id)
        VALUES (${date}, ${time}, ${tableId})
        ON CONFLICT (date, time, table_id) DO NOTHING
      `
    } else if (action === 'unblock') {
      // Rimuovi slot bloccato
      await sql`
        DELETE FROM blocked_slots
        WHERE date = ${date}
          AND time = ${time}
          AND table_id = ${tableId}
      `
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 })
  }
}
