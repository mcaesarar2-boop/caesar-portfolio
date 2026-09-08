/**
 * Date Utilities for Trip Simulation
 * Mendukung kalkulasi interaktif durasi perjalanan (hari & malam) dan formatting tanggal Indonesia.
 */

export function isValidDateStr(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

/**
 * Menghitung selisih hari dan malam berdasarkan tanggal mulai dan tanggal selesai.
 * Contoh: 10 Okt s/d 15 Okt = 5 Malam, 6 Hari.
 * Jika tanggal sama = 0 Malam, 1 Hari.
 */
export function calculateDurationFromDates(
  startDate: string,
  endDate: string
): { days: number; nights: number } {
  if (!isValidDateStr(startDate) || !isValidDateStr(endDate)) {
    return { days: 0, nights: 0 };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Normalisasi ke UTC midnight untuk mencegah offset timezone issue
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = endUTC - startUTC;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { days: 0, nights: 0 };
  }

  const nights = diffDays;
  const days = nights === 0 ? 1 : nights + 1;

  return { days, nights };
}

/**
 * Menambahkan sejumlah hari ke tanggal tertentu (format YYYY-MM-DD).
 */
export function addDaysToDateStr(dateStr: string, days: number): string {
  if (!isValidDateStr(dateStr)) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Format tanggal ke bahasa Indonesia yang ramah pengguna.
 * Contoh: 2026-10-15 -> "15 Okt 2026"
 */
export function formatDateIndo(dateStr?: string): string {
  if (!dateStr || !isValidDateStr(dateStr)) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

