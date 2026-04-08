import { NextResponse } from 'next/server';

const providers: unknown[] = [];

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const newProvider = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    providers.unshift(newProvider);

    return NextResponse.json(
      {
        success: true,
        message: '✅ Regjistrimi u krye me sukses! Do t\'ju kontaktojmë brenda 24 orëve.',
        provider: newProvider
      }
    );

  } catch {
    return NextResponse.json(
      {
        success: false,
        message: '❌ Gabim në regjistrim'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(providers);
}