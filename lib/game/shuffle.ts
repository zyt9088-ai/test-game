/**
 * خلط المصفوفة باستخدام خوارزمية Fisher-Yates shuffle
 * هذه الخوارزمية تضمن توزيعاً عشوائياً متساوياً لجميع العناصر
 * بدلاً من `array.sort(() => 0.5 - Math.random())` التي لا تعطي نتائج دقيقة
 * 
 * @param array المصفوفة المراد خلطها
 * @returns مصفوفة جديدة تحتوي على العناصر مخلوطة
 */
export function shuffleArray<T>(array: T[]): T[] {
  // إنشاء نسخة جديدة حتى لا نعدل على المصفوفة الأصلية
  const newArray = [...array];
  
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  
  return newArray;
}
