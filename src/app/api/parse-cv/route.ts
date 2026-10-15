import { NextRequest, NextResponse } from 'next/server';
import { parseCvText } from '@/lib/cv-parser';

// pdf-parse butuh runtime Node (bukan Edge) karena memakai Buffer.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX_REQUESTS = 10; // per IP dalam 1 window

// In-memory rate limiter — cukup untuk single instance.
// Untuk deploy serverless multi-region, ganti dengan Upstash / Redis.
interface RateEntry { count: number; resetAt: number; }
const rateStore = new Map<string, RateEntry>();

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

function applyRateLimit(ip: string): { ok: boolean; retryAfter?: number; } {
  const now = Date.now();
  const entry = rateStore.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { ok: true };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check duluan — sebelum baca body apapun.
    const ip = getClientIp(request);
    const rate = applyRateLimit(ip);
    if (!rate.ok) {
      const res = NextResponse.json(
        { error: `Too many requests. Try again in ${rate.retryAfter} seconds.` },
        { status: 429 }
      );
      res.headers.set('Retry-After', String(rate.retryAfter ?? 60));
      res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS));
      return res;
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Resume file was not provided.' }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum size is 5 MB.` },
        { status: 413 }
      );
    }
    if (file.size === 0) {
      return NextResponse.json({ error: 'The file is empty.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Import dinamis: pdf-parse membaca beberapa modul internal saat load,
    // dan lebih aman dipanggil di dalam handler daripada di top-level import.
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);

    if (!data.text || data.text.trim().length < 20) {
      return NextResponse.json(
        { error: 'No readable text found in this PDF. It may be a scan or image rather than a text document.' },
        { status: 422 }
      );
    }

    const result = parseCvText(data.text);

    return NextResponse.json({
      skills: result.skills,
      experiences: result.experiences,
      charCount: data.text.length,
    });
  } catch (err) {
    console.error('parse-cv error:', err);
    return NextResponse.json({ error: 'Could not process the PDF. Try another file or enter the details manually.' }, { status: 500 });
  }
}
