import { NextResponse } from 'next/server';

// Database i thjeshtë në memory për kontaktet
const contacts: unknown[] = [];

export async function POST(request: Request) {
  try {
    // Merr të dhënat nga forma
    const data = await request.json();

    // Ruaj në "database" (array)
    const newContact = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    contacts.unshift(newContact); // Shto në fillim

    // Kthe përgjigjen e suksesit
    return NextResponse.json(
      {
        success: true,
        message: '✅ Kërkesa u dërgua me sukses! Do t\'ju kontaktojmë brenda 24 orëve.',
        data: newContact
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Gabim në server:', error);

    return NextResponse.json(
      {
        success: false,
        message: '❌ Gabim në server. Ju lutem provoni përsëri.'
      },
      { status: 500 }
    );
  }
}

// GET: Merr të gjitha kontaktet (për admin)
export async function GET() {
  return NextResponse.json(contacts);
}