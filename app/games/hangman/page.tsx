import React from "react";

export default function PremiumCastleMockup() {
  // مصفوفة الـ 15 غرفة موزعة هندسياً على قلعة ضخمة ذات أبعاد 2.5D
  const rooms = [
    // البرج الأيسر (5 غرف)
    { id: 1, cx: 250, cy: 300, soldiers: 10 },
    { id: 2, cx: 250, cy: 420, soldiers: 15 },
    { id: 3, cx: 250, cy: 540, soldiers: 5 },
    { id: 4, cx: 170, cy: 660, soldiers: 20 },
    { id: 5, cx: 330, cy: 660, soldiers: 8 },

    // البرج الأوسط الملكي (5 غرف) - أضخم وأعلى
    { id: 6, cx: 600, cy: 150, soldiers: 50 },
    { id: 7, cx: 480, cy: 300, soldiers: 12 },
    { id: 8, cx: 720, cy: 300, soldiers: 12 },
    { id: 9, cx: 480, cy: 460, soldiers: 30 },
    { id: 10, cx: 720, cy: 460, soldiers: 30 },

    // البرج الأيمن (5 غرف)
    { id: 11, cx: 950, cy: 300, soldiers: 10 },
    { id: 12, cx: 950, cy: 420, soldiers: 15 },
    { id: 13, cx: 950, cy: 540, soldiers: 5 },
    { id: 14, cx: 870, cy: 660, soldiers: 20 },
    { id: 15, cx: 1030, cy: 660, soldiers: 8 },
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#050b14] p-4 md:p-8 overflow-hidden font-sans">
      <div className="w-full max-w-6xl relative">
        {/* الحاوية الأساسية للقلعة - جودة عالمية */}
        <svg
          viewBox="0 0 1200 1000"
          className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ---- الفلاتر والتدرجات اللونية الاحترافية ---- */}
          <defs>
            {/* تدرج الأسطوانة لإعطاء بعد ثلاثي للأبراج */}
            <linearGradient id="tower3D" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="20%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="80%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* تدرج القمم (الأسقف الذهبية/النحاسية) */}
            <linearGradient id="roofGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="30%" stopColor="#b45309" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* تدرج الإضاءة السحرية للنوافذ */}
            <linearGradient id="magicGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* هالة الخلفية */}
            <radialGradient id="bgAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.15)" />
              <stop offset="50%" stopColor="rgba(129, 140, 248, 0.05)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
            </radialGradient>

            {/* فلاتر التوهج والظلال */}
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur1" />
              <feGaussianBlur stdDeviation="24" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter
              id="deepShadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="15"
                stdDeviation="10"
                floodColor="#000000"
                floodOpacity="0.8"
              />
            </filter>
          </defs>

          {/* ---- البيئة الخلفية ---- */}
          {/* هالة الطاقة خلف القلعة */}
          <circle cx="600" cy="500" r="500" fill="url(#bgAura)" />
          {/* قمر أو مصدر ضوء سحري */}
          <circle
            cx="600"
            cy="350"
            r="250"
            fill="#1e1b4b"
            opacity="0.3"
            filter="url(#neonGlow)"
          />

          {/* ---- هيكل القلعة (الأبراج والأسوار) ---- */}

          {/* السور الرابط بين الأبراج */}
          <path
            d="M 250 800 L 250 500 L 950 500 L 950 800 Z"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          {/* شرفات السور (Crenellations) */}
          <path
            d="M 250 500 L 250 450 L 300 450 L 300 500 L 350 500 L 350 450 L 400 450 L 400 500 L 450 500 L 450 450 L 500 450 L 500 500 L 550 500 L 550 450 L 600 450 L 600 500 L 650 500 L 650 450 L 700 450 L 700 500 L 750 500 L 750 450 L 800 450 L 800 500 L 850 500 L 850 450 L 900 450 L 900 500 L 950 500 Z"
            fill="url(#tower3D)"
          />

          {/* البرج الأيسر */}
          <rect
            x="120"
            y="200"
            width="260"
            height="600"
            rx="10"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          {/* قاعدة البرج الأيسر المتسعة */}
          <path
            d="M 100 800 L 120 700 L 380 700 L 400 800 Z"
            fill="url(#tower3D)"
          />
          {/* سقف البرج الأيسر (مخروطي) */}
          <path
            d="M 100 200 L 250 20 L 400 200 Z"
            fill="url(#roofGradient)"
            filter="url(#deepShadow)"
          />
          {/* حواف السقف */}
          <path d="M 90 200 L 410 200 L 410 220 L 90 220 Z" fill="#b45309" />

          {/* البرج الأيمن */}
          <rect
            x="820"
            y="200"
            width="260"
            height="600"
            rx="10"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          {/* قاعدة البرج الأيمن */}
          <path
            d="M 800 800 L 820 700 L 1080 700 L 1100 800 Z"
            fill="url(#tower3D)"
          />
          {/* سقف البرج الأيمن */}
          <path
            d="M 800 200 L 950 20 L 1100 200 Z"
            fill="url(#roofGradient)"
            filter="url(#deepShadow)"
          />
          <path
            d="M 790 200 L 1110 200 L 1110 220 L 790 220 Z"
            fill="#b45309"
          />

          {/* البرج الأوسط (الرئيسي الأعظم) */}
          <rect
            x="420"
            y="80"
            width="360"
            height="720"
            rx="15"
            fill="url(#tower3D)"
            filter="url(#deepShadow)"
          />
          {/* سقف البرج الأوسط */}
          <path
            d="M 390 80 L 600 -80 L 810 80 Z"
            fill="url(#roofGradient)"
            filter="url(#deepShadow)"
          />
          <path d="M 380 80 L 820 80 L 820 110 L 380 110 Z" fill="#f59e0b" />

          {/* البوابة الرئيسية الضخمة (بأسلوب دروع الطاقة) */}
          <path
            d="M 480 800 L 480 620 A 120 120 0 0 1 720 620 L 720 800 Z"
            fill="#020617"
            stroke="#38bdf8"
            strokeWidth="8"
            filter="url(#neonGlow)"
          />
          {/* خطوط طاقة داخل البوابة */}
          <path
            d="M 540 800 L 540 620 A 60 60 0 0 1 660 620 L 660 800"
            fill="none"
            stroke="#818cf8"
            strokeWidth="4"
            opacity="0.6"
          />
          <circle
            cx="600"
            cy="710"
            r="30"
            fill="url(#magicGlow)"
            filter="url(#neonGlow)"
          />
          <circle cx="600" cy="710" r="15" fill="#ffffff" />

          {/* القاعدة الصخرية العائمة (Floating Island Base) */}
          <path
            d="M 50 800 Q 600 830 1150 800 L 1100 870 Q 600 980 100 870 Z"
            fill="#020617"
            filter="url(#deepShadow)"
          />
          <path d="M 150 870 L 250 930 L 300 850 Z" fill="#0f172a" />
          <path d="M 900 860 L 800 950 L 700 850 Z" fill="#0f172a" />

          {/* ---- رسم الغرف (النوافذ) التفاعلية بأسلوب البوابات السحرية ---- */}
          {rooms.map((room) => (
            <g key={room.id} className="cursor-pointer group">
              {/* التعديل الجوهري لحل التعليق: تسريع الحركة وربط مركزها وإضافة will-change */}
              <g
                className="transition-transform duration-200 ease-out group-hover:scale-[1.12] will-change-transform"
                style={{ transformOrigin: `${room.cx}px ${room.cy}px` }}
              >
                {/* الإطار الخارجي المعدني للغرفة (شكل درع قوطي) */}
                <path
                  d={`M ${room.cx} ${room.cy - 45} L ${room.cx + 35} ${room.cy - 10} L ${room.cx + 35} ${room.cy + 40} A 35 15 0 0 1 ${room.cx - 35} ${room.cy + 40} L ${room.cx - 35} ${room.cy - 10} Z`}
                  className="fill-[#1e293b] stroke-[#f59e0b] stroke-[3px] group-hover:stroke-[#fbbf24] transition-colors duration-200"
                  filter="url(#deepShadow)"
                />

                {/* النواة السحرية (الخلفية المضيئة للرقم) */}
                <path
                  d={`M ${room.cx} ${room.cy - 35} L ${room.cx + 25} ${room.cy - 5} L ${room.cx + 25} ${room.cy + 30} A 25 10 0 0 1 ${room.cx - 25} ${room.cy + 30} L ${room.cx - 25} ${room.cy - 5} Z`}
                  fill="url(#magicGlow)"
                  className="group-hover:brightness-125 transition-all duration-200"
                  filter="url(#neonGlow)"
                />

                {/* نقوش تجميلية داخل الغرفة */}
                <circle
                  cx={room.cx}
                  cy={room.cy}
                  r="20"
                  fill="#020617"
                  opacity="0.5"
                />

                {/* رقم الجنود (بتنسيق بارز) */}
                <text
                  x={room.cx}
                  y={room.cy + 12}
                  textAnchor="middle"
                  fontSize="32"
                  fontWeight="900"
                  className="fill-white select-none pointer-events-none"
                  style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}
                >
                  {room.soldiers}
                </text>

                {/* مؤشر تفاعلي يظهر فوق الغرفة عند التأشير عليها */}
                <circle
                  cx={room.cx}
                  cy={room.cy - 60}
                  r="5"
                  fill="#fde047"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 animate-bounce"
                  filter="url(#neonGlow)"
                />
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
