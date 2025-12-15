import { sql } from '@vercel/postgres'

export async function initDatabase() {
  try {
    // Crea tabella reservations
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(255) PRIMARY KEY,
        date VARCHAR(10) NOT NULL,
        time VARCHAR(5) NOT NULL,
        table_id VARCHAR(50) NOT NULL,
        guests INTEGER NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        service_type VARCHAR(20) NOT NULL,
        duration DECIMAL(3,1) NOT NULL,
        notes TEXT,
        status VARCHAR(20) NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Crea tabella blocked_slots
    await sql`
      CREATE TABLE IF NOT EXISTS blocked_slots (
        id SERIAL PRIMARY KEY,
        date VARCHAR(10) NOT NULL,
        time VARCHAR(5) NOT NULL,
        table_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, time, table_id)
      )
    `

    // Crea indici per performance
    await sql`CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date)`
    await sql`CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_blocked_slots_date ON blocked_slots(date)`

    console.log('✓ Database initialized successfully')
    return { success: true }
  } catch (error) {
    console.error('Database initialization error:', error)
    return { success: false, error }
  }
}
