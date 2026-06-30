// إعدادات وبيانات الألعاب الأساسية في المنصة
export const GAMES_LIST = [
    {
      id: "castle-war",
      title: "حرب القلاع",
      path: "/games/castle-war",
      color: "rose",
    },
    {
      id: "world-domination",
      title: "السيطرة على العالم",
      path: "/games/world-domination",
      color: "blue",
    },
    {
      id: "auction",
      title: "حرب المزايدات",
      path: "/games/auction",
      color: "amber",
    }
  ];
  
  // الحد الأدنى للنقاط المطلوبة لتغيير السؤال في لعبة السيطرة على العالم
  export const WD_GAME_CONFIG = {
    CHANGE_QUESTION_COST: 1000,
    MIN_SCORE_FOR_CAPITAL_ATTACK: 6000,
    DEFAULT_TIMER_SECONDS: 20,
  };