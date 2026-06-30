import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // تهيئة الاتصال الآمن بالسيرفر لمعالجة الكوكيز
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // جلب بيانات المستخدم الموثق
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // الحماية الجدارية للوحة التحكم (Admin)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // التحقق من صلاحية المدير
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'Admin') {
      // إذا لم يكن مديراً، يتم طرده لصفحة اللاعب
      return NextResponse.redirect(new URL("/player", request.url));
    }
  }

  // إذا هو مسجل دخول وحاول يرجع لصفحة الدخول، وجهه للوحة التحكم
  if (request.nextUrl.pathname.startsWith("/login") && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // الحماية الجديدة: إذا حاول يدخل الألعاب أو الحساب الشخصي وهو مو مسجل، اطرده لصفحة اللاعب
  if (
    (request.nextUrl.pathname.startsWith("/games") || 
     request.nextUrl.pathname.startsWith("/my-games") || 
     request.nextUrl.pathname.startsWith("/profile")) && 
    !user
  ) {
    return NextResponse.redirect(new URL("/player", request.url));
  }

  return supabaseResponse;
}

// تحديد المسارات اللي يشتغل عليها ملف الأمان (نستثني ملفات النظام والصور)
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};