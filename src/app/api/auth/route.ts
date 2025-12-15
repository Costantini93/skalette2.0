import { NextResponse } from 'next/server'

// Password admin (cambiala con una tua sicura!)
const ADMIN_PASSWORD = 'skalette2024admin'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, token: 'admin_authenticated' })
    }
    
    return NextResponse.json({ success: false, message: 'Password errata' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Errore server' }, { status: 500 })
  }
}
