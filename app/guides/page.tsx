"use client";
import React, { useState } from "react";
import { Tajawal } from "next/font/google";
import { TopNav } from "@/components/home/TopNav";
import { Swords, Globe, Gavel, Users, Clock, Trophy, Target, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
});

export default function GameGuidesPage() {
  const [activeGame, setActiveGame] = useState("auction");

  const games = [
    {
      id: "auction",
      title: "المزايدات",
      icon: Gavel,
      color: "amber",
      players: "فريقان (مع حكم)",
      duration: "حتى انتهاء اللعبة",
      difficulty: "سهل إلى صعب",
      description: "لعبة تعتمد على تقييم الأسئلة وإدارة الرصيد بذكاء. زايد على فئات الأسئلة، ضاعف أرباحك، واستخدم الكمائن للإطاحة بخصومك.",
      rules: [
        "صفحة تأسيس الفريقين: يقوم الحكم بتعديل أسماء الفريقين ومشاركة صفحة الفرق من خلال الرابط أو الباركود أو الكود.",
        "يختار قائد الفريق اسم الفريق الخاص به وينتظر الحكم لبدء اللعبة.",
        "لكل فريق رصيد ثابت بمقدار 50,000.",
        "يظهر على شاشة الفريقين فئة السؤال (علوم، جغرافيا، دين...) ويقوم كل فريق بالمزايدة لشراء السؤال (السؤال مجهول حتى الفوز به).",
        "إذا تساوت المزايدة، يفوز الفريق صاحب الدور بالسؤال تلقائياً.",
        "بعد الفوز بالفئة يظهر خيارين: (لعب عادي) أو (تفعيل الدبل - خصم إضافي على نفس سعر المزايدة).",
        "تظهر 3 خيارات للسؤال: أ- إجابة بدون خيارات. ب- إجابة مع خيارات. ج- بيع السؤال للخصم (بضعف مبلغ مزايدة الخصم).",
        "الإجابة بدون خيارات: يحصل الفريق على 10 نقاط، أو يستخدم (الكمين) لاسترداد مبلغ مزايدته وخصم مزايدة الخصم (إذا كانت 5000 أو أقل).",
        "الإجابة مع خيارات: يحصل الفريق على 5 نقاط، أو يستخدم (الكمين) بنفس الشروط السابقة.",
        "لا يمكن بيع السؤال عند تفعيل (الدبل).",
        "لكل فريق 3 كمائن طوال فترة اللعبة.",
        "لا يمكن المزايدة بأقل من 1000، وتكون المزايدة بمضاعفات 100 فقط.",
        "تنتهي اللعبة بانتهاء الأسئلة. وفي حال نفاد رصيد أحد الفريقين، يُقسم رصيد الفريق الآخر إجبارياً على عدد الأسئلة المتبقية."
      ],
      tips: "استخدم الكمين في الأوقات الحاسمة لاستنزاف رصيد الخصم، وتجنب تفعيل الدبل إذا لم تكن متأكداً من الإجابة."
    },
    {
      id: "castle-war",
      title: "حرب القلاع",
      icon: Swords,
      color: "rose",
      players: "فريقان (مع حكم)",
      duration: "حتى انتهاء اللعبة",
      difficulty: "سهل إلى صعب",
      description: "قم بحماية جنودك واخفاءهم في غرف القلعة واستخدم الجاسوس لتدمير الغرفة المكتضة بالجنود وفخخ غرفة لاصطياد الجنود أو تدميرهم عبر مجموعة من التحديات.",
      rules: [
        "صفحة تأسيس الفريقين: يقوم الحكم بتعديل أسماء الفريقين ومشاركة صفحة توزيع الجنود لكل قائد (عبر الرابط أو الباركود أو الكود).",
        "توزيع الجنود: يوزع كل فريق 120 جندي على 15 غرفة في القلعة بحرية (يتوفر التوزيع العشوائي).",
        "القائد: يوضع في غرفة مستقلة. إذا اختار الخصم غرفته يتم خصم 30 جندي إضافي من الفريق المهزوم.",
        "الفخ: يوضع في غرفة مستقلة. إذا اختاره الخصم يحق للفريق صاحب الفخ اختيار (خصم 20 جندي من الخصم، أو أسر 20 جندي وإضافتهم لجنوده).",
        "السرية التامة: يمنع إخبار الفريق الآخر بأماكن توزيع الجنود، خاصة القائد والفخ.",
        "تحدي توقع الرقم: يختار كل فريق رقماً (0-500) سراً. يبدأ السائل، والخصم يجيب بـ'أكثر' أو 'أقل'. يفوز من يخمن الرقم أولاً.",
        "تحدي 30 ثانية: مزايدة بين اللاعبين (كم تقدر تذكر من...). الفائز بالمزايدة يجب أن يذكر العدد المطلوب دون تكرار في 30 ثانية.",
        "تحدي 5 ثواني: أذكر 3 أشياء يطلبها الحكم في 5 ثواني فقط.",
        "أسئلة عامة: سؤال بـ 3 خيارات يجب الإجابة عليه خلال 15 ثانية.",
        "تحدي الفريق: يظهر تحدي مفاجئ ويجب على الفريق أو أحد الأعضاء تنفيذه حسب نوع التحدي.",
        "الفوز في التحدي: عند فوز الفريق في أي تحدي، يختار غرفة لتدميرها ويتم خصم الجنود المتواجدين فيها.",
        "الجاسوس: مساعدة تستخدم مرة واحدة لكل فريق، وتستهدف تلقائياً الغرفة الأكثر اكتظاظاً بالجنود.",
        "الخسارة: يخسر الفريق الذي يفقد جميع جنوده أولاً."
      ],
      tips: "استخدم الجاسوس بعناية ولا تستعجل الإجابة واستخدم خيارات الفخ بذكاء."
    },
    {
      id: "world-domination",
      title: "السيطرة على العالم",
      icon: Globe,
      color: "blue",
      players: "فريقان (مع حكم)",
      duration: "حتى انتهاء الدول",
      difficulty: "متوسط إلى صعب",
      description: "لعبة استراتيجية تعتمد على احتلال الدول وتكوين النفوذ واستخدام البطاقات التكتيكية (احتلال، حماية، قصف، غزو، تجسس) للسيطرة على مجريات المعركة.",
      rules: [
        "إعداد الخريطة: يحدد الحكم أسماء الفريقين وعدد الدول الأساسية ودول التحدي، ثم يعتمد الخريطة للعب.",
        "دول التحدي: يختار الحكم دوله الخاصة، ويشارك كل فريق في اختيار دولة عشوائية (تتلوّن بالبنفسجي).",
        "العواصم: يختار الفريق الأول عاصمة (تاج أزرق)، ثم الفريق الثاني (تاج أحمر).",
        "النقاط: 6 دول قيمتها 2000، دول الحكم قيمتها 2000، والباقي 1000. (لا تظهر نقاط الدولة للجمهور إلا بعد الإجابة عليها).",
        "يبدأ اللعب عند الفريق الأول ثم الثاني، ويكون السؤال المعروض يخص الدولة المختارة نفسها.",
        "الإجابة: لكل سؤال 3 خيارات، وإذا كانت إجابة الفريقين صحيحة تُحسب النقاط للفريق صاحب الدور فقط.",
        "خمس بطاقات تكتيكية لكل فريق لا يجبر الفريق على استخدامها.",
        "احتلال (3 بطاقات): لاحتلال دولة من الخصم (يجب ألا تكون محمية، ولا عاصمة، ولا محتلة مسبقاً) ولا يمكن استعادتها من الفريق الآخر بعد الاحتلال.",
        "• حماية (5 بطاقات): لحماية دولة تم الإجابة عليها ولا تُفك إلا بالقصف (تظهر أيقونة درع). يمكن طلب الحماية قبل دور الخصم.",
        "• قصف (3 بطاقات): لفك حماية دولة، أو لخصم نصف نقاط دولة الخصم إذا لم تكن محمية.",
        "• غزو (بطاقتان): لمهاجمة العاصمة (يجب أن يملك المهاجم 6000 نقطة فما فوق). النجاح يسلب ثلث نقاط الخصم، والإخفاق يخصم ثلث نقاطك.",
        "• تجسس (بطاقتان): تجبر الخصم عند اختيارها على الوقوع في دولة قيمتها 2000 نقطة.",
        "يمكن للفريق صاحب الدور تغيير السؤال مقابل خصم 1000 نقطة من رصيده.",
        "دول الحكم (التحديات) لا يتم لعبها إلا بعد انتهاء واحتلال كافة الدول الأساسية.",
        "الفوز: تنتهي اللعبة عند انتهاء جميع الدول والفريق الأعلى نقاطاً هو الفائز."
      ],
      tips: "لا تغتر بفارق النقاط، فبطاقة (الغزو) على العاصمة ودول التحدي ذات الـ 2000 كوينز قد تقلب موازين المعركة في أي لحظة!"
    },
    {
      id: "challenges",
      title: "تحديات الحكم والفريق",
      icon: Sparkles,
      color: "purple",
      players: "الفريقان (بإشراف الحكم)",
      duration: "من دقيقة إلى دقيقتين",
      difficulty: "مختلف (حسب التحدي)",
      description: "مجموعة من التحديات الجانبية التي يطرحها الحكم لإضافة المتعة والتشويق واختبار مهارات وسرعة بديهة الفرق.",
      rules: [
        "تحدي الأغاني : يختار الحكم حرف ويقوم الفريق الذي عليه الدور ببدء أغنية بنفس الحرف المختار ، ثم يبدأ الفريق الثاني بغناء أغنية بنفس آخر حرف لأغنية الفريق الاول ، الفريق الذي يتأخر عن خمس ثواني بتقدير الحكم هو الخسران.",
        "نطق الكلمات المتشابهة: يقوم الحكم باختيار مقطع من اليوتيوب على سبيل المثال ' لحم فحم شحم ' والمطلوب من اللاعب نطق الكلمات بالشكل الصحيح بالتزامن مع الموسيقى الموجودة في المقطع.",
        "استخرج كلمات من حروف (حسب الكلمة الموجودة في التحدي): كل فريق لمدة دقيقة يقوم باستخراج أكبر قدر ممكن من كلمات بشرط أن تكون من حروف الكلمة التي في التحدي ، مثال (استخرج كلمات من كلمة بحر : فيستخرج الفريق ' بر - حر - رب - حب ..وهكذا').",
        "حار بارد: يتم اختيار عضو من الفريق الذي عليه التحدي ويخرج خارج المكان الموجود فيه ، فيتفق الفريق الثاني على حركة معينة مثلاً ' تحريك الريموت من مكان إلى مكان' ، فيستدعونه ويبدأ اللعبة ، المطلوب من اللاعب المشي في الغرفة أو المكان والفريق الثاني يقول بارد بارد بارد بارد حتى يقترب من الريموت فيقولون حار لمرة واحدة حتى يفهم أنه يجب أن يمسك الريموت ، فيكملون بارد بارد حتى يضعه بالمكان المطلوب وهكذا ، مدة التحدي من دقيقة ونصف إلى دقيقتين بتقدير الحكم.",
        "داخل برى: تعتمد هذه اللعبة على المكان الموجودين فيه ، المطلوب دائرة كبيرة ويقف الفريق كامل أو عدد من الفريقين خارج الدائرة ، فيقول الحكم داخل ' هنا يجب أن يقفز الجميع داخل الدائرة ، ويقول برى ' فيجب أن يخرجوا من الدائرة بسرعة ' ، من يعكس الأمر يخرج ، من يتأخر يخرج ، يفوز آخر واحد يبقى.",
        "ولا كلمة: يرشح الفريق الذي عليه التحدي لاعب ، فيقوم الحكم بتحديد مسلسل أو أغنية أو فيلم مسرحية ويخبر اللاعب دون علم فريقه ويخبره إسم الفئة وبلد الإنتاج للمسلسل ، المطلوب من اللاعب لمدة دقيقتين شرح المطلوب بدون كلام والفريق يخمن ما هي الإجابة.",
        "الحرف الممنوع: يختار الفريق الذي عليه التحدي لاعب من طرفهم ، يقوم الحكم باختيار حرف ممنوع على اللاعب نطق هذا الحرف في إجاباته ، يبدأ التحدي والفريق الثاني يلقي أسئلة في محاولة منه لإيقاع اللاعب في الفخ ليجاوب وينطق الحرف المختار. ' ممنوع يتأخر عن ثلاث ثواني - ممنوع تكرار الإجابات ، ممنوع تكرار السؤال من الفريق الثاني ، ممنوع الأجوبة الغير منطقية ، ممنوع الإجابة بأي لغة غير العربية.",
        "اعكس اللهجة : مطلوب من اللاعب الذي عليه التحدي من أحد الفرق تنفيذ التحدي بالحديث بعكس اللهجة المطلوبة منه ، مثلاً ' اللاعب الاول يتحدث بالمصري ! يجيب باللهجة السورية ، إذا أجاب اللاعب الأول بالسورية مطلوب يجيب بالمصرية وهكذا ' لمدة دقيقة ، يخسر إذا تحدث غير اللهجة او تأخر.",
        "مثل مشهد من مسلسل او فيلم: مطلوب على اللاعب تمثيل مشهد للمسلسل الموجود بالتحدي المطلوب ليس الدقة بالمشهد المطلوب التحدث بلهجة المسلسل والكلام عن أحداث المسلسل حتى لو قام بالتأليف."
      ],
      tips: "تعتمد التحديات على خفة الدم وسرعة البديهة، استمتع بالتجربة ولا تتردد في ابتكار أساليب جديدة لإرباك الخصم!"
    }
  ];

  const activeGameData = games.find(g => g.id === activeGame) || games[0];
  const ActiveIcon = activeGameData.icon;

  const colorClasses = {
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/20"
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/20"
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20"
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      gradient: "from-purple-500 to-fuchsia-600",
      shadow: "shadow-purple-500/20"
    }
  };

  const activeColors = colorClasses[activeGameData.color as keyof typeof colorClasses];

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white ${tajawal.className} flex flex-col`} dir="rtl">
      <TopNav />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 py-12 mt-24 md:mt-32">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">دليل الألعاب <span className="text-blue-600 dark:text-blue-400">الاحترافي</span></h1>
          <p className="text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto">تعرف على قوانين الألعاب، استراتيجيات الفوز، وكيف تتفوق على أصدقائك في منصتنا.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* القائمة الجانبية للألعاب */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/20 flex flex-col gap-3 sticky top-28">
              {games.map((game) => {
                const Icon = game.icon;
                const isActive = activeGame === game.id;
                const c = colorClasses[game.color as keyof typeof colorClasses];

                return (
                  <button
                    key={game.id}
                    onClick={() => setActiveGame(game.id)}
                    className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all font-black text-right ${isActive
                      ? `${c.bg} ${c.text} shadow-sm border ${c.border}`
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                      }`}
                  >
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-white dark:bg-slate-950' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      <Icon size={24} className={isActive ? c.text : "text-slate-500"} />
                    </div>
                    <span className="text-lg">{game.title}</span>
                    {isActive && <ChevronLeft size={20} className="mr-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* مساحة العرض الرئيسية للعبة */}
          <div className="flex-grow">
            <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-2xl ${activeColors.shadow} overflow-hidden animate-fade-in`}>

              {/* ترويسة اللعبة */}
              <div className={`relative p-8 md:p-12 overflow-hidden bg-gradient-to-br ${activeColors.gradient}`}>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-white">
                  <div className="p-6 bg-white/20 backdrop-blur-md rounded-[2rem] shadow-xl border border-white/30">
                    <ActiveIcon size={64} className="drop-shadow-lg" />
                  </div>
                  <div className="text-center md:text-right">
                    <h2 className="text-4xl font-black mb-3 drop-shadow-md">{activeGameData.title}</h2>
                    <p className="text-white/90 font-bold text-lg leading-relaxed max-w-xl">
                      {activeGameData.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12">
                {/* الإحصائيات السريعة */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Users className="text-blue-500" />
                    <div>
                      <div className="text-xs text-slate-500 font-bold">عدد اللاعبين</div>
                      <div className="font-black text-slate-900 dark:text-white">{activeGameData.players}</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Clock className="text-emerald-500" />
                    <div>
                      <div className="text-xs text-slate-500 font-bold">مدة الجولة</div>
                      <div className="font-black text-slate-900 dark:text-white">{activeGameData.duration}</div>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                    <Target className="text-rose-500" />
                    <div>
                      <div className="text-xs text-slate-500 font-bold">مستوى الصعوبة</div>
                      <div className="font-black text-slate-900 dark:text-white">{activeGameData.difficulty}</div>
                    </div>
                  </div>
                </div>

                {/* قوانين اللعبة */}
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <Trophy className={activeColors.text} />
                    كيف تلعب وتفوز؟
                  </h3>
                  <div className="space-y-4">
                    {activeGameData.rules.map((rule, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-white bg-gradient-to-br ${activeColors.gradient}`}>
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-bold mt-1">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* نصيحة المحترفين */}
                <div className={`p-6 rounded-2xl border ${activeColors.border} ${activeColors.bg} flex gap-4 items-start`}>
                  <Sparkles size={28} className={`shrink-0 ${activeColors.text} mt-1`} />
                  <div>
                    <h4 className={`text-lg font-black mb-2 ${activeColors.text}`}>نصيحة المحترفين</h4>
                    <p className="text-slate-800 dark:text-slate-200 font-bold leading-relaxed">{activeGameData.tips}</p>
                  </div>
                </div>

                {activeGameData.id !== "challenges" && (
                  <div className="mt-8 text-center">
                    <Link href={`/games/${activeGameData.id}`} className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white bg-gradient-to-r ${activeColors.gradient} hover:-translate-y-1 transition-transform shadow-lg ${activeColors.shadow}`}>
                      العب الآن
                      <ChevronLeft size={20} />
                    </Link>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
