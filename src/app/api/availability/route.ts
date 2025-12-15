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

// Salva disponibilità
export async function POST(request: Request) {
  try {
    const body = await request.json()
    await initDatabase()
    
    // Prima cancella tutti gli slot bloccati
    await sql`DELETE FROM blocked_slots`
    
    // Poi inserisci i nuovi
    if (body.blockedSlots && body.blockedSlots.length > 0) {
      for (const slot of body.blockedSlots) {
        await sql`
          INSERT INTO blocked_slots (date, time, table_id)
          VALUES (${slot.date}, ${slot.time}, ${slot.tableId})
          ON CONFLICT (date, time, table_id) DO NOTHING
        `
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving availability:', error)
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 })
  }
}
