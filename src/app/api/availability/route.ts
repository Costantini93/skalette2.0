import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'availability.json')

// Assicura che la directory e il file esistano
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ blockedSlots: [] }))
  }
}

// Leggi disponibilità
export async function GET() {
  try {
    ensureDataFile()
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ blockedSlots: [] })
  }
}

// Salva disponibilità
export async function POST(request: Request) {
  try {
    const body = await request.json()
    ensureDataFile()
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 })
  }
}
