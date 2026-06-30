"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { ContactMessageSchema } from "@/lib/schemas";

export async function submitContactMessage(formData: FormData) {
  const data = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const parsed = ContactMessageSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await getSupabaseServer();

  try {
    const { data: isSpam, error: checkError } = await supabase.rpc('check_recent_message', {
      user_email: parsed.data.email,
      user_phone: parsed.data.phone
    });

    if (checkError) throw checkError;

    if (isSpam) {
      return { success: false, error: "عذراً يا بطل! تم استقبال رسالة من هذا البريد أو رقم الجوال خلال الـ 24 ساعة الماضية. يرجى المحاولة غداً لحماية النظام." };
    }

    const { error } = await supabase
      .from("contact_messages")
      .insert([{ 
        name: parsed.data.name, 
        phone: parsed.data.phone, 
        email: parsed.data.email, 
        message: parsed.data.message 
      }]);
      
    if (error) throw error;
    
    return { success: true, message: "تم إرسال رسالتك بنجاح! فريقنا بيتواصل معك بأقرب وقت 🎮🔥" };
  } catch (error: any) {
    console.error("Error sending message:", error);
    return { success: false, error: "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً." };
  }
}
