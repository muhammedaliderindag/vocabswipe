import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Gerçek senaryoda burada veritabanı ping/bağlantı kontrolü yapılabilir
    const dbStatus = "CONNECTED"; 

    return NextResponse.json({
      status: "UP",
      database: dbStatus
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      status: "DOWN",
      database: "DISCONNECTED"
    }, { status: 503 });
  }
}
