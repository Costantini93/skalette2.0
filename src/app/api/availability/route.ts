import { NextResponse } from 'next/server'
import { getDB, initDatabase } from '@/lib/db'

// Leggi disponibilità
export async function GET() {
  try {
    await initDatabase()
    const db = getDB()
    const result = await db.execute(`
      SELECT date, time, table_id as tableId
      FROM blocked_slots
      ORDER BY date, time
    `)
    return NextResponse.json({ blockedSlots: result.rows })
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
    const db = getDB()
    
    const { action, date, time, tableId } = body
    
    if (action === 'block') {
      // Aggiungi slot bloccato
      await db.execute({
        sql: `INSERT OR IGNORE INTO blocked_slots (date, time, table_id) VALUES (?, ?, ?)`,
        args: [date, time, tableId]
      })
    } else if (action === 'unblock') {
      // Rimuovi slot bloccato
      await db.execute({
        sql: `DELETE FROM blocked_slots WHERE date = ? AND time = ? AND table_id = ?`,
        args: [date, time, tableId]
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json({ success: false, error: 'Failed to update data' }, { status: 500 })
  }
}
