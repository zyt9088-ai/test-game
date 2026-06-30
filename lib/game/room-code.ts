/**
 * يولد كود غرفة عشوائي مكون من بادئة محددة متبوعة بـ 5 أحرف عشوائية (أرقام وحروف إنجليزية صغيرة)
 * @param prefix البادئة التي تميز نوع اللعبة (مثلاً: 'WD-' أو 'CW-')
 * @returns كود غرفة فريد (مثال: 'WD-a1b2c')
 */
export function generateRoomCode(prefix: string = ""): string {
  const randomChars = Math.random().toString(36).substring(2, 7);
  return `${prefix}${randomChars}`;
}
