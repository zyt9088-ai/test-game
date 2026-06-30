"use server";

import { getSupabaseServer } from "@/lib/supabase/server";
import { UpdateProfileSchema } from "@/lib/schemas";

export async function updateProfile(formData: FormData) {
  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phoneNumber: formData.get("phoneNumber") || "",
  };

  const parsed = UpdateProfileSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = await getSupabaseServer();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "يجب تسجيل الدخول لتحديث الحساب" };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        phone_number: parsed.data.phoneNumber,
      })
      .eq("id", user.id);

    if (error) throw error;

    return { success: true, message: "تم تحديث بيانات حسابك بنجاح." };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: "حدث خطأ أثناء حفظ التغييرات." };
  }
}
