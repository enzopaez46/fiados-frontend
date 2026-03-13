import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await fetch('https://fiados.onrender.com/health/', {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error) {
    // Catch any error to prevent cron job crash
    console.error('Error pinging backend:', error);
  }

  return NextResponse.json({ ok: true });
}