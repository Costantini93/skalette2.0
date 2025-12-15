import { createClient } from '@libsql/client'

let client: ReturnType<typeof createClient> | null = null

export function getDB() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    })
  }
  return client
}

export async function initDatabase() {
  try {
    const db = getDB()
    
    // Crea tabella reservations
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        table_id TEXT NOT NULL,
        guests INTEGER NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_type TEXT NOT NULL,
        duration REAL NOT NULL,
        notes TEXT,
        status TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Crea tabella blocked_slots
    await db.execute(`
      CREATE TABLE IF NOT EXISTS blocked_slots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        table_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, time, table_id)
      )
    `)

    // Crea indici per performance
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status)`)
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(date)`)

    console.log('✓ Database initialized successfully')
    return { success: true }
  } catch (error) {
    console.error('Database initialization error:', error)
    return { success: false, error }
  }
}
