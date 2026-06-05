"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cairo } from "next/font/google";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import {
  Globe,
  Swords,
  X,
  Play,
  Coins,
  Trophy,
  ArrowRight,
  MonitorPlay,
  MapPin,
  ShieldCheck,
  Shield,
  Rocket,
  RefreshCw,
  PlusCircle,
  MinusCircle,
  ArrowLeftRight,
  Star,
  Crown,
  Shuffle,
  CheckCircle2,
} from "lucide-react";

const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "700", "900"] });
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const TankIcon = ({
  className,
  size = 24,
}: {
  className?: string;
  size?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 11V9a2 2 0 0 1 2-2h4" />
    <path d="M14 7h6" />
    <rect x="2" y="13" width="20" height="6" rx="3" />
    <path d="M5 13v-1.5a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5V13" />
    <circle cx="6" cy="16" r="1" />
    <circle cx="12" cy="16" r="1" />
    <circle cx="18" cy="16" r="1" />
  </svg>
);

const CONTINENTS = [
  { name: "العالم", center: [0, 0] as [number, number], zoom: 1 },
  { name: "آسيا", center: [90, 30] as [number, number], zoom: 1.8 },
  { name: "أوروبا", center: [15, 50] as [number, number], zoom: 3 },
  { name: "أفريقيا", center: [20, 0] as [number, number], zoom: 2.2 },
  { name: "أمريكا ن.", center: [-100, 40] as [number, number], zoom: 1.8 },
  { name: "أمريكا ج.", center: [-60, -15] as [number, number], zoom: 2.5 },
  { name: "أوقيانوسيا", center: [140, -25] as [number, number], zoom: 3 },
  { name: "الشرق الأوسط", center: [45, 25] as [number, number], zoom: 4 },
];

export default function WorldDominationGame() {
  const [gameState, setGameState] = useState<
    | "lobby"
    | "setupMap"
    | "setupChallenges"
    | "setupCapitals"
    | "playing"
    | "gameOver"
  >("lobby");
  const [team1Name, setTeam1Name] = useState<string>("الفريق الأول");
  const [team2Name, setTeam2Name] = useState<string>("الفريق الثاني");
  const [score1, setScore1] = useState<number>(200);
  const [score2, setScore2] = useState<number>(200);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [dbCountries, setDbCountries] = useState<any[]>([]);
  const [dbWdChallenges, setDbWdChallenges] = useState<string[]>([]);
  const [countriesLimit, setCountriesLimit] = useState<number>(20);
  const [challengesCount, setChallengesCount] = useState<number>(2);
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [timer, setTimer] = useState<number>(20);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [team1Choice, setTeam1Choice] = useState<string | null>(null);
  const [team2Choice, setTeam2Choice] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [isQuestionRevealed, setIsQuestionRevealed] = useState<boolean>(false);

  const [mapPosition, setMapPosition] = useState({
    center: [0, 0] as [number, number],
    zoom: 1,
    name: "العالم",
  });

  const [capitals, setCapitals] = useState<{
    team1: string | null;
    team2: string | null;
  }>({ team1: null, team2: null });
  const [stolenCapitalAlert, setStolenCapitalAlert] = useState<{
    winner: 1 | 2;
    loser: 1 | 2;
    points: number;
    countryName: string;
  } | null>(null);

  const [challengesUsed1, setChallengesUsed1] = useState<number>(0);
  const [challengesUsed2, setChallengesUsed2] = useState<number>(0);

  const [cards1, setCards1] = useState({
    capture: 3,
    protect: 5,
    airStrike: 3,
    capitalCapture: 2,
  });
  const [cards2, setCards2] = useState({
    capture: 3,
    protect: 5,
    airStrike: 3,
    capitalCapture: 2,
  });
  const [protectedCountries, setProtectedCountries] = useState<any>({});

  const [forcedWinner, setForcedWinner] = useState<1 | 2 | null>(null);
  const [quickProtectTeam, setQuickProtectTeam] = useState<1 | 2 | null>(null);

  useEffect(() => {
    const savedCountries = localStorage.getItem("admin_wd_countries_db");
    if (savedCountries) {
      try {
        setDbCountries(JSON.parse(savedCountries));
      } catch (e) {}
    }
    const savedChallenges = localStorage.getItem("admin_wd_challenges_db");
    if (savedChallenges) {
      try {
        setDbWdChallenges(JSON.parse(savedChallenges));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "wd_live_sync",
      JSON.stringify({
        gameState,
        team1Name,
        team2Name,
        score1,
        score2,
        turn,
        countries,
        selectedCountry:
          isAttacking && !selectedCountry?.activeQuestion
            ? null
            : selectedCountry,
        timer,
        team1Choice,
        team2Choice,
        showResult,
        isAttacking,
        isQuestionRevealed,
        cards1,
        cards2,
        protectedCountries,
        challengesUsed1,
        challengesUsed2,
        mapPosition,
        capitals,
        stolenCapitalAlert,
        timestamp: Date.now(),
      }),
    );
  }, [
    gameState,
    team1Name,
    team2Name,
    score1,
    score2,
    turn,
    countries,
    selectedCountry,
    timer,
    team1Choice,
    team2Choice,
    showResult,
    isAttacking,
    isQuestionRevealed,
    cards1,
    cards2,
    protectedCountries,
    challengesUsed1,
    challengesUsed2,
    mapPosition,
    capitals,
    stolenCapitalAlert,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0)
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    else if (timer === 0) setIsTimerRunning(false);
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const startGame = () => {
    if (dbCountries.length === 0) {
      alert("الرجاء إضافة دول من لوحة تحكم الآدمن أولاً!");
      return;
    }

    const actualChallengeCount = Math.min(
      challengesCount,
      dbWdChallenges.length,
    );
    let needed = countriesLimit + actualChallengeCount + 2;

    if (needed > dbCountries.length) {
      needed = dbCountries.length;
      alert(
        `تنبيه: عدد الدول في البنك (${dbCountries.length}) أقل من المطلوب. سيتم استخدام جميع الدول المتاحة.`,
      );
    }

    setChallengesCount(actualChallengeCount);

    const allMapped = dbCountries.map((c) => ({
      ...c,
      owner: null,
      lastOwner: null,
      wasOwnedBefore: false,
      forbiddenFor: [],
      isStolen: false,
      isChallenge: false,
      value: 1000,
      originalValue: 1000,
      activeQuestion: null,
      isActive: false,
    }));

    const shuffled = [...allMapped].sort(() => 0.5 - Math.random());
    for (let i = 0; i < needed; i++) {
      shuffled[i].isActive = true;
    }

    setScore1(200);
    setScore2(200);
    setTurn(1);
    setChallengesUsed1(0);
    setChallengesUsed2(0);
    setCards1({ capture: 3, protect: 5, airStrike: 3, capitalCapture: 2 });
    setCards2({ capture: 3, protect: 5, airStrike: 3, capitalCapture: 2 });
    setProtectedCountries({});
    setIsAttacking(false);
    setIsQuestionRevealed(false);
    setForcedWinner(null);
    setCountries(shuffled);
    setCapitals({ team1: null, team2: null });
    setMapPosition({ center: [0, 0], zoom: 1, name: "العالم" });
    setStolenCapitalAlert(null);

    setGameState("setupMap");
  };

  const randomizeMap = () => {
    const needed = countriesLimit + challengesCount + 2;
    const maxAvailable = Math.min(needed, countries.length);

    setCountries((prev) => {
      const reset = prev.map((c) => ({ ...c, isActive: false }));
      const shuffled = [...reset].sort(() => 0.5 - Math.random());
      for (let i = 0; i < maxAvailable; i++) {
        shuffled[i].isActive = true;
      }
      return shuffled;
    });
  };

  const confirmMap = () => {
    const active = countries.filter((c) => c.isActive);
    const needed = countriesLimit + challengesCount + 2;
    const maxAvailable = Math.min(needed, countries.length);

    if (active.length !== maxAvailable) {
      alert(
        `يجب تفعيل ${maxAvailable} دولة بالضبط! المفعّل حالياً: ${active.length}`,
      );
      return;
    }

    const shuffledActive = [...active].sort(() => 0.5 - Math.random());
    setCountries(shuffledActive);

    if (challengesCount > 0) {
      setGameState("setupChallenges");
    } else {
      setGameState("setupCapitals");
    }
  };

  const confirmChallenges = () => {
    const currentChallengeCount = countries.filter((c) => c.isChallenge).length;
    if (currentChallengeCount < challengesCount) {
      alert(`الرجاء تحديد ${challengesCount} دول لتحدي الحكم قبل المتابعة.`);
      return;
    }

    const shuffledChallenges = [...dbWdChallenges].sort(
      () => 0.5 - Math.random(),
    );
    let chIdx = 0;

    const finalCountries = countries.map((c) => {
      if (c.isChallenge) {
        return {
          ...c,
          activeQuestion: {
            q: shuffledChallenges[chIdx++] || "تحدي حكم (غير مسجل)",
            options: [],
            a: "",
          },
        };
      }
      return c;
    });

    setCountries(finalCountries);
    setGameState("setupCapitals");
    setTurn(1);
  };

  const handleCountryClick = (geoId: string) => {
    const country = countries.find((c) => c.geoId === geoId);
    if (!country) return;

    if (gameState === "setupMap") {
      const needed = countriesLimit + challengesCount + 2;
      const maxAvailable = Math.min(needed, countries.length);
      const activeCount = countries.filter((c) => c.isActive).length;

      if (!country.isActive && activeCount >= maxAvailable) {
        alert(
          `لقد وصلت للحد الأقصى (${maxAvailable} دولة). ألغِ تفعيل دولة أخرى أولاً.`,
        );
        return;
      }

      setCountries((prev) =>
        prev.map((c) =>
          c.id === country.id ? { ...c, isActive: !c.isActive } : c,
        ),
      );
      return;
    }

    if (gameState === "setupChallenges") {
      const isCurrentlyChallenge = country.isChallenge;
      const currentChallengeCount = countries.filter(
        (c) => c.isChallenge,
      ).length;

      if (!isCurrentlyChallenge && currentChallengeCount >= challengesCount) {
        alert(`لقد قمت بتحديد ${challengesCount} دول للتحدي بالفعل.`);
        return;
      }

      setCountries((prev) =>
        prev.map((c) => {
          if (c.id === country.id) {
            if (c.isChallenge) {
              return { ...c, isChallenge: false, value: c.originalValue };
            } else {
              return {
                ...c,
                isChallenge: true,
                value: 2000,
                originalValue: 2000,
              };
            }
          }
          return c;
        }),
      );
      return;
    }

    if (gameState === "setupCapitals") {
      if (country.isChallenge) {
        alert("لا يمكن تعيين دولة تحدي كعاصمة! الرجاء اختيار دولة أساسية.");
        return;
      }
      if (turn === 1) {
        setCapitals((prev) => ({ ...prev, team1: country.id }));
        setCountries((prev) =>
          prev.map((c) =>
            c.id === country.id
              ? {
                  ...c,
                  owner: 1,
                  wasOwnedBefore: true,
                  value: 0,
                  originalValue: 0,
                }
              : c,
          ),
        );
        setTurn(2);
      } else {
        if (country.id === capitals.team1) {
          alert("تم اختيار هذه الدولة كعاصمة للفريق الأول! اختر دولة أخرى.");
          return;
        }
        setCapitals((prev) => ({ ...prev, team2: country.id }));

        setCountries((prev) => {
          let updated = prev.map((c) =>
            c.id === country.id
              ? {
                  ...c,
                  owner: 2,
                  wasOwnedBefore: true,
                  value: 0,
                  originalValue: 0,
                }
              : c,
          );

          let normalFree = updated.filter(
            (c) =>
              !c.isChallenge && c.id !== capitals.team1 && c.id !== country.id,
          );
          const shuffledNormal = [...normalFree].sort(
            () => 0.5 - Math.random(),
          );
          const num2000 = Math.min(4, shuffledNormal.length);
          const upgradedIds = shuffledNormal.slice(0, num2000).map((c) => c.id);

          return updated.map((c) =>
            upgradedIds.includes(c.id)
              ? { ...c, value: 2000, originalValue: 2000 }
              : c,
          );
        });

        setGameState("playing");
        setTurn(1);
      }
      return;
    }

    const isOwnCapital =
      country.id === (turn === 1 ? capitals.team1 : capitals.team2);
    if (isOwnCapital) {
      alert("هذه عاصمتكم الأساسية! 👑\nلا يمكنكم الهجوم عليها.");
      return;
    }

    if (
      protectedCountries[country.id] &&
      country.owner !== null &&
      country.owner !== turn
    ) {
      setSelectedCountry({ ...country, activeQuestion: null });
      return;
    }

    let activeQ = country.activeQuestion;

    if (!country.isChallenge && !activeQ && country.questions?.length > 0) {
      activeQ =
        country.questions[Math.floor(Math.random() * country.questions.length)];
    }

    setSelectedCountry({ ...country, activeQuestion: activeQ });
    setTimer(20);
    setTeam1Choice(null);
    setTeam2Choice(null);
    setShowResult(false);
    setIsTimerRunning(false);
    setIsAttacking(false);
    setIsQuestionRevealed(false);
    setForcedWinner(null);
  };

  const handleChangeQuestion = () => {
    if (!selectedCountry || selectedCountry.isChallenge) return;

    const currentScore = turn === 1 ? score1 : score2;
    if (currentScore < 1000) {
      alert("رصيد الفريق غير كافٍ (مطلوب 1000 نقطة) لتغيير السؤال!");
      return;
    }

    const availableQs =
      selectedCountry.questions?.filter(
        (q: any) => q.q !== selectedCountry.activeQuestion?.q,
      ) || [];
    if (availableQs.length === 0) {
      alert("ما فيه أسئلة إضافية مسجلة لهذي الدولة!");
      return;
    }

    if (confirm("سيتم خصم 1000 نقطة لتغيير السؤال، هل أنت متأكد؟")) {
      if (turn === 1) setScore1((s) => s - 1000);
      else setScore2((s) => s - 1000);

      const newQ = availableQs[Math.floor(Math.random() * availableQs.length)];
      setSelectedCountry({ ...selectedCountry, activeQuestion: newQ });
      setTeam1Choice(null);
      setTeam2Choice(null);
      setShowResult(false);
      setTimer(20);
      setIsTimerRunning(false);
      setIsQuestionRevealed(false);
      setForcedWinner(null);
    }
  };

  const handleRefereeChangeQuestion = () => {
    if (!selectedCountry) return;

    if (selectedCountry.isChallenge) {
      const availableChallenges = dbWdChallenges.filter(
        (ch) => ch !== selectedCountry.activeQuestion?.q,
      );
      if (availableChallenges.length === 0) {
        alert("لا توجد تحديات إضافية مسجلة في البنك!");
        return;
      }
      const newChallenge =
        availableChallenges[
          Math.floor(Math.random() * availableChallenges.length)
        ];
      setSelectedCountry({
        ...selectedCountry,
        activeQuestion: { q: newChallenge, options: [], a: "" },
      });
    } else {
      const availableQs =
        selectedCountry.questions?.filter(
          (q: any) => q.q !== selectedCountry.activeQuestion?.q,
        ) || [];
      if (availableQs.length === 0) {
        alert("لا توجد أسئلة إضافية مسجلة لهذه الدولة!");
        return;
      }
      const newQ = availableQs[Math.floor(Math.random() * availableQs.length)];
      setSelectedCountry({ ...selectedCountry, activeQuestion: newQ });
    }

    setTeam1Choice(null);
    setTeam2Choice(null);
    setShowResult(false);
    setTimer(20);
    setIsTimerRunning(false);
    setIsQuestionRevealed(false);
    setForcedWinner(null);
  };

  const adjustScore = (tId: 1 | 2, amount: number) => {
    if (tId === 1) setScore1((s) => Math.max(0, s + amount));
    else setScore2((s) => Math.max(0, s + amount));
  };

  const handleManualFree = () => {
    if (confirm(`هل أنت متأكد من سحب هذه الدولة وجعلها حرة للجميع؟`)) {
      const updated = countries.map((c) => {
        if (c.id === selectedCountry.id) {
          if (c.owner === 1) setScore1((s) => Math.max(0, s - c.value));
          if (c.owner === 2) setScore2((s) => Math.max(0, s - c.value));
          return {
            ...c,
            owner: null,
            lastOwner: null,
            wasOwnedBefore: false,
            forbiddenFor: [],
            isStolen: false,
          };
        }
        return c;
      });
      setCountries(updated);
      setSelectedCountry(null);
      setTeam1Choice(null);
      setTeam2Choice(null);
      setShowResult(false);
      setIsAttacking(false);
      setIsQuestionRevealed(false);
      setForcedWinner(null);
    }
  };

  const useCaptureCard = () => {
    const currentCards = turn === 1 ? cards1 : cards2;
    const isOpponentCapital =
      selectedCountry.id === (turn === 1 ? capitals.team2 : capitals.team1);

    if (isOpponentCapital) {
      if (currentCards.capitalCapture <= 0) {
        alert("لقد استنفذ الفريق جميع بطاقات غزو العاصمة!");
        return;
      }
      if ((turn === 1 ? score1 : score2) <= 6000) {
        alert("رصيدكم لا يتجاوز 6000 نقطة! لا يمكنكم الهجوم على عاصمة الخصم.");
        return;
      }
    } else {
      if (currentCards.capture <= 0) {
        alert("لقد استنفذ الفريق جميع بطاقات الاستحلال (الدبابة)!");
        return;
      }
    }

    if (
      confirm(
        `سيتم خصم بطاقة ${isOpponentCapital ? "غزو العاصمة" : "استحلال"} وبدء الهجوم الأبدي، هل أنت متأكد؟`,
      )
    ) {
      if (turn === 1) {
        if (isOpponentCapital)
          setCards1((prev: any) => ({
            ...prev,
            capitalCapture: prev.capitalCapture - 1,
          }));
        else setCards1((prev: any) => ({ ...prev, capture: prev.capture - 1 }));
      } else {
        if (isOpponentCapital)
          setCards2((prev: any) => ({
            ...prev,
            capitalCapture: prev.capitalCapture - 1,
          }));
        else setCards2((prev: any) => ({ ...prev, capture: prev.capture - 1 }));
      }

      const updatedCountries = countries.map((c) => {
        if (c.id === selectedCountry.id) {
          return { ...c, owner: null, lastOwner: c.owner };
        }
        return c;
      });

      setCountries(updatedCountries);
      setIsAttacking(true);
      setIsQuestionRevealed(false);

      let activeQ = selectedCountry.activeQuestion;
      if (!selectedCountry.isChallenge) {
        activeQ =
          selectedCountry.questions?.[
            Math.floor(Math.random() * selectedCountry.questions.length)
          ];
      }
      setSelectedCountry({
        ...selectedCountry,
        owner: null,
        lastOwner: selectedCountry.owner,
        activeQuestion: activeQ,
      });
    }
  };

  const useAirStrike = () => {
    const currentCards = turn === 1 ? cards1 : cards2;
    const isOpponentCapital =
      selectedCountry.id === (turn === 1 ? capitals.team2 : capitals.team1);

    if (currentCards.airStrike <= 0) {
      alert("لقد استنفذ الفريق جميع بطاقات القصف (صاروخ)!");
      return;
    }

    if (isOpponentCapital) {
      alert(
        "ممنوع! لا يمكن قصف العاصمة بالصواريخ. يجب الهجوم عليها بالمواجهة المباشرة (الاستحلال) وفقط إذا كان رصيدك فوق 6000 نقطة.",
      );
      return;
    }

    if (
      confirm(
        `القصف المدمر! سيتم خصم بطاقة قصف، وسيتم خصم نصف قيمة الدولة (${Math.floor(selectedCountry.value / 2)}) من رصيد المدافع ومن قيمة الدولة نفسها، ولن تتحرر الدولة. هل أنت متأكد؟`,
      )
    ) {
      if (turn === 1) {
        setCards1((prev: any) => ({ ...prev, airStrike: prev.airStrike - 1 }));
      } else {
        setCards2((prev: any) => ({ ...prev, airStrike: prev.airStrike - 1 }));
      }

      const penalty = Math.floor(selectedCountry.value / 2);
      if (selectedCountry.owner === 1)
        setScore1((s) => Math.max(0, s - penalty));
      if (selectedCountry.owner === 2)
        setScore2((s) => Math.max(0, s - penalty));

      setProtectedCountries((prev: any) => {
        const next = { ...prev };
        delete next[selectedCountry.id];
        return next;
      });

      const updatedCountries = countries.map((c) => {
        if (c.id === selectedCountry.id) {
          return { ...c, value: Math.max(0, c.value - penalty) };
        }
        return c;
      });

      setCountries(updatedCountries);
      setSelectedCountry(null);
    }
  };

  const useProtectCard = () => {
    const currentCards = turn === 1 ? cards1 : cards2;
    if (currentCards.protect <= 0) {
      alert("انتهت بطاقات الحماية (الدرع)!");
      return;
    }

    if (turn === 1)
      setCards1((prev: any) => ({ ...prev, protect: prev.protect - 1 }));
    else setCards2((prev: any) => ({ ...prev, protect: prev.protect - 1 }));

    setProtectedCountries((prev: any) => ({
      ...prev,
      [selectedCountry.id]: true,
    }));
    alert(
      "تم تفعيل الحماية! الدولة أصبحت محصنة ضد الدبابات (لكنها لا تزال معرضة للقصف).",
    );
    if (!showResult) setSelectedCountry(null);
  };

  const handleConfirmAnswers = () => {
    if (selectedCountry.isChallenge) {
      if (turn === 1) setChallengesUsed1((prev: number) => prev + 1);
      else setChallengesUsed2((prev: number) => prev + 1);
    }

    if (isAttacking) {
      const attackerChoice = turn === 1 ? team1Choice : team2Choice;
      if (!attackerChoice) {
        alert("لازم تختار إجابة الفريق المهاجم أولاً!");
        return;
      }
      setShowResult(true);
      setIsTimerRunning(false);
      return;
    }

    if (!team1Choice || !team2Choice) {
      alert("لازم تختار إجابة الفريقين أولاً عشان تعتمد النتيجة!");
      return;
    }

    setShowResult(true);
    setIsTimerRunning(false);
  };

  const endTurn = () => {
    setSelectedCountry(null);
    setTeam1Choice(null);
    setTeam2Choice(null);
    setShowResult(false);
    setIsAttacking(false);
    setIsQuestionRevealed(false);
    setForcedWinner(null);
    setTurn((t) => (t === 1 ? 2 : 1));
  };

  const handleCapture = (winner: 1 | 2, isForced: boolean = false) => {
    if (!selectedCountry) return;

    let finalScore1 = score1;
    let finalScore2 = score2;

    const isOpponentCapital =
      selectedCountry.id === (winner === 1 ? capitals.team2 : capitals.team1);
    const victim =
      selectedCountry.owner !== null
        ? selectedCountry.owner
        : selectedCountry.lastOwner;

    if (isAttacking || (isForced && victim !== null && victim !== winner)) {
      if (!isOpponentCapital) {
        if (victim === 1)
          finalScore1 = Math.max(0, finalScore1 - selectedCountry.value);
        if (victim === 2)
          finalScore2 = Math.max(0, finalScore2 - selectedCountry.value);
      }
    }

    let capitalStolen = false;
    let stealAmount = 0;

    if (isOpponentCapital) {
      capitalStolen = true;
      stealAmount = Math.floor((winner === 1 ? finalScore2 : finalScore1) / 3);
      if (winner === 1) {
        finalScore1 += stealAmount;
      } else {
        finalScore2 += stealAmount;
      }
    } else {
      if (winner === 1) finalScore1 += selectedCountry.value;
      else finalScore2 += selectedCountry.value;
    }

    const updated = countries.map((c) => {
      if (c.id === selectedCountry.id) {
        let newForbiddenFor = [...(c.forbiddenFor || [])];
        if (
          victim !== null &&
          victim !== winner &&
          !newForbiddenFor.includes(victim)
        ) {
          newForbiddenFor.push(victim);
        }

        const stolen =
          isAttacking ||
          (c.owner !== null && c.owner !== winner) ||
          (c.lastOwner !== null && c.lastOwner !== winner);

        return {
          ...c,
          owner: winner,
          lastOwner: null,
          wasOwnedBefore: true,
          forbiddenFor: newForbiddenFor,
          isStolen: stolen ? true : c.isStolen,
        };
      }
      return c;
    });

    setCountries(updated);
    setScore1(finalScore1);
    setScore2(finalScore2);

    if (capitalStolen) {
      setStolenCapitalAlert({
        winner,
        loser: winner === 1 ? 2 : 1,
        points: stealAmount,
        countryName: selectedCountry.name,
      });
    }

    checkGameOver(updated);
    endTurn();
  };

  const handleMiss = () => {
    let finalScore1 = score1;
    let finalScore2 = score2;
    const isOpponentCapital =
      selectedCountry.id === (turn === 1 ? capitals.team2 : capitals.team1);

    if (isAttacking) {
      if (isOpponentCapital) {
        const penalty = Math.floor(
          (turn === 1 ? finalScore2 : finalScore1) / 3,
        );
        if (turn === 1) finalScore1 = Math.max(0, finalScore1 - penalty);
        else finalScore2 = Math.max(0, finalScore2 - penalty);
        alert(
          `إجابة خاطئة! تم معاقبة المهاجم بخصم ${penalty} نقطة (ثلث نقاط الخصم) من رصيده.`,
        );
      } else {
        const penalty = Math.floor(selectedCountry.value / 2);
        if (selectedCountry.lastOwner === 1)
          finalScore1 = Math.max(0, finalScore1 - penalty);
        if (selectedCountry.lastOwner === 2)
          finalScore2 = Math.max(0, finalScore2 - penalty);
        alert(
          `فشل الاستحلال! تم معاقبة المدافع بخصم ${penalty} نقطة (نصف قيمة الدولة) من رصيده.`,
        );
      }
    }

    setScore1(finalScore1);
    setScore2(finalScore2);

    const updated = countries.map((c) => {
      if (c.id === selectedCountry.id) {
        let restoredOwner = c.owner;
        if (isAttacking) {
          restoredOwner = c.lastOwner;
        }
        let newForbiddenFor = [...(c.forbiddenFor || [])];
        if (
          c.lastOwner !== null &&
          c.lastOwner !== undefined &&
          !newForbiddenFor.includes(c.lastOwner)
        ) {
          newForbiddenFor.push(c.lastOwner);
        }
        return {
          ...c,
          owner: restoredOwner,
          lastOwner: c.lastOwner,
          forbiddenFor: newForbiddenFor,
        };
      }
      return c;
    });
    setCountries(updated);
    checkGameOver(updated);
    endTurn();
  };

  const checkGameOver = (currentCountries: any[]) => {
    if (currentCountries.filter((c) => c.owner === null).length === 0) {
      setTimeout(() => setGameState("gameOver"), 1500);
    }
  };

  const countriesLeft = countries.filter((c) => c.owner === null).length;
  const team1Owned = countries.filter((c) => c.owner === 1).length;
  const team2Owned = countries.filter((c) => c.owner === 2).length;

  return (
    <main
      className={`min-h-screen p-4 md:p-6 ${cairo.className} bg-slate-50 dark:bg-slate-950 flex flex-col relative z-10`}
      dir="rtl"
    >
      {quickProtectTeam && (
        <div className="fixed inset-0 z-200 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border-2 border-emerald-500 text-center shadow-2xl animate-in zoom-in-95">
            <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-black mb-4 dark:text-white">
              تفعيل حماية سريعة لـ{" "}
              <span className="text-emerald-500">
                {quickProtectTeam === 1 ? team1Name : team2Name}
              </span>
            </h3>
            <p className="text-slate-500 mb-6 text-sm font-bold">
              اختر الدولة المراد تحصينها بالدرع. (لن يؤثر على مجريات السؤال
              الحالي)
            </p>
            <div className="max-h-60 overflow-y-auto flex flex-col gap-2 mb-6">
              {countries
                .filter(
                  (c) =>
                    c.owner === quickProtectTeam && !protectedCountries[c.id],
                )
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (quickProtectTeam === 1)
                        setCards1((p: any) => ({
                          ...p,
                          protect: p.protect - 1,
                        }));
                      else
                        setCards2((p: any) => ({
                          ...p,
                          protect: p.protect - 1,
                        }));
                      setProtectedCountries((p: any) => ({
                        ...p,
                        [c.id]: true,
                      }));
                      setQuickProtectTeam(null);
                    }}
                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-black rounded-xl transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-between px-4"
                  >
                    <span>{c.name}</span>
                    <Shield size={16} />
                  </button>
                ))}
              {countries.filter(
                (c) =>
                  c.owner === quickProtectTeam && !protectedCountries[c.id],
              ).length === 0 && (
                <p className="text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 p-4 rounded-xl">
                  لا يوجد دول مملوكة قابلة للحماية حالياً.
                </p>
              )}
            </div>
            <button
              onClick={() => setQuickProtectTeam(null)}
              className="w-full py-3 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-black rounded-xl transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {stolenCapitalAlert && (
        <div className="fixed inset-0 z-100 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-800 border-4 border-amber-500 rounded-3xl p-10 max-w-2xl w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-in zoom-in-95">
            <Star className="w-32 h-32 text-amber-500 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-wide drop-shadow-md">
              سقوط العاصمة! 🔥
            </h2>
            <p className="text-2xl font-bold text-slate-300 mb-8 leading-relaxed">
              لقد سقطت عاصمة{" "}
              <span className="text-white font-black">
                {stolenCapitalAlert.loser === 1 ? team1Name : team2Name}
              </span>{" "}
              ({stolenCapitalAlert.countryName})
            </p>
            <div className="bg-amber-500/20 border-2 border-amber-500/50 rounded-2xl p-8 mb-10 shadow-inner">
              <p className="text-3xl font-black text-amber-400 mb-2">
                تم غنم ثلث الثروات:
              </p>
              <div className="text-6xl font-black text-white flex items-center justify-center gap-3">
                {stolenCapitalAlert.points}{" "}
                <Coins className="text-yellow-400 w-12 h-12" />
              </div>
              <p className="text-xl font-bold text-amber-300 mt-4">
                لصالح: {stolenCapitalAlert.winner === 1 ? team1Name : team2Name}
              </p>
            </div>
            <button
              onClick={() => setStolenCapitalAlert(null)}
              className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-2xl rounded-2xl transition-all shadow-md active:scale-95"
            >
              متابعة المعركة
            </button>
          </div>
        </div>
      )}

      <div className="max-w-350 mx-auto w-full flex flex-col h-full flex-1">
        <div className="flex justify-between items-center mb-6 shrink-0 z-50">
          <Link
            href="/"
            className="px-4 py-2 bg-rose-500 text-white rounded-xl flex items-center gap-2 font-black text-xs shadow-sm"
          >
            <ArrowRight size={16} /> رجوع
          </Link>

          {gameState === "playing" && (
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500">دول حرة</p>
                <p className="font-black text-blue-600">{countriesLeft}</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500">
                  {team1Name}
                </p>
                <p className="font-black text-cyan-600">{team1Owned}</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500">
                  {team2Name}
                </p>
                <p className="font-black text-rose-600">{team2Owned}</p>
              </div>
            </div>
          )}

          <Link
            href="/games/world-domination/audience"
            target="_blank"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-black text-xs shadow-sm"
          >
            <MonitorPlay size={16} /> شاشة الجمهور
          </Link>
        </div>

        {gameState === "lobby" ? (
          <div className="m-auto p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 text-center shadow-xl w-full max-w-2xl">
            <Globe size={48} className="text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl font-black mb-8 dark:text-white">
              السيطرة على العالم
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-black text-center outline-none focus:border-cyan-500 dark:text-white"
                placeholder="الفريق 1"
              />
              <input
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-black text-center outline-none focus:border-rose-500 dark:text-white"
                placeholder="الفريق 2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-right">
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2">
                  عدد الدول الأساسية:
                </p>
                <div className="flex gap-2">
                  {[20, 30, 40].map((num) => (
                    <button
                      key={num}
                      onClick={() => setCountriesLimit(num)}
                      className={`flex-1 py-2 rounded-xl font-black transition-all border-2 text-sm ${countriesLimit === num ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black text-purple-500 dark:text-purple-400 mb-2">
                  تحديات إضافية (تضاف فوق الأساسي):
                </p>
                <div className="flex gap-2">
                  {[0, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setChallengesCount(num)}
                      className={`flex-1 py-2 rounded-xl font-black transition-all border-2 text-sm ${challengesCount === num ? "bg-purple-600 border-purple-600 text-white shadow-md" : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}
                    >
                      +{num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-2xl shadow-md transition-colors"
            >
              بدء اللعب
            </button>
          </div>
        ) : gameState === "setupMap" ? (
          <div className="m-auto p-6 lg:p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-cyan-500 text-center shadow-2xl w-full max-w-5xl flex flex-col h-[85vh]">
            <Globe className="text-cyan-500 w-16 h-16 mx-auto mb-4 animate-spin-slow shrink-0" />
            <h2 className="text-3xl font-black mb-2 dark:text-white shrink-0">
              تصفية دول الخريطة
            </h2>
            <p className="text-slate-500 mb-4 font-bold text-lg shrink-0">
              الدول المحددة باللون الأزرق هي التي ستدخل المعركة. اضغط على أي
              دولة للتبديل.
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-2xl mb-4 border border-cyan-200 dark:border-cyan-800 shrink-0 gap-4">
              <div className="font-black text-cyan-700 dark:text-cyan-300">
                الدول المفعلة: {countries.filter((c) => c.isActive).length} من{" "}
                {Math.min(
                  countriesLimit + challengesCount + 2,
                  countries.length,
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={randomizeMap}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-black transition-colors flex items-center gap-2"
                >
                  <Shuffle size={18} /> توزيع عشوائي جديد
                </button>
                {countries.filter((c) => c.isActive).length ===
                  Math.min(
                    countriesLimit + challengesCount + 2,
                    countries.length,
                  ) && (
                  <button
                    onClick={confirmMap}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-black shadow-md transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 size={18} /> اعتماد الخريطة
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 flex-1 min-h-0 w-full">
              <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mx-auto w-fit z-10">
                {CONTINENTS.map((cont) => (
                  <button
                    key={cont.name}
                    type="button"
                    onClick={() =>
                      setMapPosition({
                        center: cont.center,
                        zoom: cont.zoom,
                        name: cont.name,
                      })
                    }
                    className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all duration-300 ${
                      mapPosition.name === cont.name
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 -translate-y-0.5"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-md border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {cont.name}
                  </button>
                ))}
              </div>

              <div className="bg-[#7bc3f5] dark:bg-[#287cb5] rounded-[2rem] border-4 border-slate-300 dark:border-slate-800 overflow-hidden shadow-inner w-full h-full relative">
                <ComposableMap
                  projectionConfig={{ scale: 200 }}
                  className="w-full h-full"
                >
                  <ZoomableGroup
                    center={mapPosition.center}
                    zoom={mapPosition.zoom}
                    onMoveEnd={(pos) =>
                      setMapPosition({
                        center: pos.coordinates as [number, number],
                        zoom: pos.zoom,
                        name: mapPosition.name,
                      })
                    }
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const country = countries.find(
                            (c) => c.geoId === geo.id,
                          );
                          let fillColor = "#cbd5e1";
                          if (country && country.isActive) {
                            fillColor = "#0ea5e9";
                          }
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => handleCountryClick(geo.id)}
                              style={{
                                default: {
                                  fill: fillColor,
                                  outline: "none",
                                  stroke: "#334155",
                                  strokeWidth: country?.isActive ? 1.5 : 0.5,
                                },
                                hover: {
                                  fill: country
                                    ? country.isActive
                                      ? "#0284c7"
                                      : "#94a3b8"
                                    : fillColor,
                                  cursor: country ? "pointer" : "default",
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                    {countries.map((c) => {
                      const centroid = geoCentroid({ id: c.geoId } as any);
                      if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1]))
                        return null;
                      return (
                        <Marker key={c.id} coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            y={3}
                            fill={c.isActive ? "#fff" : "#64748b"}
                            style={{
                              fontFamily: "Cairo",
                              fontSize: "8px",
                              fontWeight: "900",
                              pointerEvents: "none",
                              opacity: c.isActive ? 1 : 0.6,
                            }}
                          >
                            {c.name}
                          </text>
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            </div>
          </div>
        ) : gameState === "setupChallenges" ? (
          <div className="m-auto p-6 lg:p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-purple-500 text-center shadow-2xl w-full max-w-5xl flex flex-col h-[85vh]">
            <Star className="text-purple-500 w-16 h-16 mx-auto mb-4 animate-pulse shrink-0" />
            <h2 className="text-3xl font-black mb-2 dark:text-white shrink-0">
              تحديد دول تحدي الحكم
            </h2>
            <p className="text-slate-500 mb-4 font-bold text-lg shrink-0">
              يا حكم، حدد بالخريطة{" "}
              <span className="text-purple-500 font-black">
                {challengesCount}
              </span>{" "}
              دول لتكون تحديات مباشرة (2000 نقطة).
            </p>

            {challengesCount > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl mb-4 border border-purple-200 dark:border-purple-800 shrink-0 gap-4">
                <div className="font-black text-purple-700 dark:text-purple-300">
                  الدول المحددة: {countries.filter((c) => c.isChallenge).length}{" "}
                  من {challengesCount}
                </div>
                {countries.filter((c) => c.isChallenge).length ===
                  challengesCount && (
                  <button
                    onClick={confirmChallenges}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black shadow-md transition-colors"
                  >
                    اعتماد التحديات والمتابعة
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col gap-4 flex-1 min-h-0 w-full">
              <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mx-auto w-fit z-10">
                {CONTINENTS.map((cont) => (
                  <button
                    key={cont.name}
                    type="button"
                    onClick={() =>
                      setMapPosition({
                        center: cont.center,
                        zoom: cont.zoom,
                        name: cont.name,
                      })
                    }
                    className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all duration-300 ${
                      mapPosition.name === cont.name
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 -translate-y-0.5"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-md border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {cont.name}
                  </button>
                ))}
              </div>

              <div className="bg-[#7bc3f5] dark:bg-[#287cb5] rounded-[2rem] border-4 border-slate-300 dark:border-slate-800 overflow-hidden shadow-inner w-full h-full relative">
                <ComposableMap
                  projectionConfig={{ scale: 200 }}
                  className="w-full h-full"
                >
                  <ZoomableGroup
                    center={mapPosition.center}
                    zoom={mapPosition.zoom}
                    onMoveEnd={(pos) =>
                      setMapPosition({
                        center: pos.coordinates as [number, number],
                        zoom: pos.zoom,
                        name: mapPosition.name,
                      })
                    }
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const country = countries.find(
                            (c) => c.geoId === geo.id,
                          );
                          let fillColor = "#f1f5f9";
                          if (country) {
                            fillColor = country.isChallenge
                              ? "#a855f7"
                              : "#cbd5e1";
                          }
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => handleCountryClick(geo.id)}
                              style={{
                                default: {
                                  fill: fillColor,
                                  outline: "none",
                                  stroke: "#334155",
                                  strokeWidth: 0.8,
                                },
                                hover: {
                                  fill: country ? "#9333ea" : fillColor,
                                  cursor: country ? "pointer" : "default",
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                    {countries.map((c) => {
                      const centroid = geoCentroid({ id: c.geoId } as any);
                      if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1]))
                        return null;
                      return (
                        <Marker key={c.id} coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            y={3}
                            fill="#1e293b"
                            style={{
                              fontFamily: "Cairo",
                              fontSize: "8px",
                              fontWeight: "900",
                              pointerEvents: "none",
                            }}
                          >
                            {c.name}
                          </text>
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            </div>
          </div>
        ) : gameState === "setupCapitals" ? (
          <div className="m-auto p-6 lg:p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border-4 border-amber-500 text-center shadow-2xl w-full max-w-5xl flex flex-col h-[85vh]">
            <Crown className="text-amber-500 w-16 h-16 mx-auto mb-4 animate-bounce shrink-0" />
            <h2 className="text-3xl font-black mb-2 dark:text-white shrink-0">
              اختيار العواصم
            </h2>
            <p className="text-slate-500 mb-4 font-bold text-lg shrink-0">
              دور{" "}
              <span
                className={
                  turn === 1
                    ? "text-cyan-500 font-black"
                    : "text-rose-500 font-black"
                }
              >
                {turn === 1 ? team1Name : team2Name}
              </span>{" "}
              يختارون عاصمتهم الأساسية (التاج 👑) على الخريطة
            </p>

            <div className="flex flex-col gap-4 flex-1 min-h-0 w-full">
              <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mx-auto w-fit z-10">
                {CONTINENTS.map((cont) => (
                  <button
                    key={cont.name}
                    type="button"
                    onClick={() =>
                      setMapPosition({
                        center: cont.center,
                        zoom: cont.zoom,
                        name: cont.name,
                      })
                    }
                    className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all duration-300 ${
                      mapPosition.name === cont.name
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 -translate-y-0.5"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-md border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {cont.name}
                  </button>
                ))}
              </div>

              <div className="bg-[#7bc3f5] dark:bg-[#287cb5] rounded-[2rem] border-4 border-slate-300 dark:border-slate-800 overflow-hidden shadow-inner w-full h-full relative">
                <ComposableMap
                  projectionConfig={{ scale: 200 }}
                  className="w-full h-full"
                >
                  <ZoomableGroup
                    center={mapPosition.center}
                    zoom={mapPosition.zoom}
                    onMoveEnd={(pos) =>
                      setMapPosition({
                        center: pos.coordinates as [number, number],
                        zoom: pos.zoom,
                        name: mapPosition.name,
                      })
                    }
                  >
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => {
                          const country = countries.find(
                            (c) => c.geoId === geo.id,
                          );
                          let fillColor = "#f1f5f9";
                          if (country) {
                            if (country.owner === 1) fillColor = "#06b6d4";
                            else if (country.owner === 2) fillColor = "#f43f5e";
                            else
                              fillColor = country.isChallenge
                                ? "#a855f7"
                                : "#facc15";
                          }
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              onClick={() => handleCountryClick(geo.id)}
                              style={{
                                default: {
                                  fill: fillColor,
                                  outline: "none",
                                  stroke: "#334155",
                                  strokeWidth: country?.owner ? 1.5 : 0.8,
                                },
                                hover: {
                                  fill: country ? "#3b82f6" : fillColor,
                                  cursor: country ? "pointer" : "default",
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                    {countries.map((c) => {
                      const centroid = geoCentroid({ id: c.geoId } as any);
                      if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1]))
                        return null;

                      let label = c.name;
                      if (c.id === capitals.team1 || c.id === capitals.team2) {
                        label += " 👑";
                      }

                      return (
                        <Marker key={c.id} coordinates={centroid}>
                          <text
                            textAnchor="middle"
                            y={3}
                            fill={c.owner ? "#fff" : "#1e293b"}
                            style={{
                              fontFamily: "Cairo",
                              fontSize: "8px",
                              fontWeight: "900",
                              pointerEvents: "none",
                            }}
                          >
                            {label}
                          </text>
                        </Marker>
                      );
                    })}
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            </div>
          </div>
        ) : gameState === "playing" ? (
          <div className="flex flex-col gap-6 flex-1">
            <div className="grid grid-cols-2 gap-6 shrink-0 z-50 w-full lg:w-4/5 mx-auto">
              {/* صندوق الفريق الأول */}
              <div
                className={`p-4 rounded-xl border-4 bg-white dark:bg-slate-800 ${turn === 1 ? "border-cyan-500 shadow-md scale-105 transition-transform" : "border-slate-200 dark:border-slate-700"} text-center relative`}
              >
                <div className="font-black text-sm text-slate-800 dark:text-slate-200 mb-1">
                  {team1Name}
                </div>
                <div className="text-3xl font-black dark:text-white">
                  {score1}{" "}
                  <Coins size={22} className="inline text-yellow-500" />
                </div>

                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <button
                    onClick={() => adjustScore(1, 100)}
                    className="text-emerald-500 hover:text-emerald-600"
                    title="إضافة 100"
                  >
                    <PlusCircle size={18} />
                  </button>
                  <button
                    onClick={() => adjustScore(1, -100)}
                    className="text-rose-500 hover:text-rose-600"
                    title="خصم 100"
                  >
                    <MinusCircle size={18} />
                  </button>
                </div>

                <div className="flex justify-center gap-2 mt-3 text-[10px] font-bold">
                  <span className="bg-slate-100 dark:bg-slate-700 dark:text-white px-2 py-1.5 rounded flex items-center gap-1">
                    <TankIcon size={12} /> استحلال: {cards1.capture}
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-1.5 rounded flex items-center gap-1">
                    <Shield size={12} /> حماية: {cards1.protect}
                  </span>
                  <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-1.5 rounded flex items-center gap-1">
                    <Rocket size={12} /> قصف: {cards1.airStrike}
                  </span>
                  <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-1.5 rounded flex items-center gap-1">
                    <Crown size={12} /> غزو العاصمة: {cards1.capitalCapture}
                  </span>
                </div>
                <button
                  onClick={() => setQuickProtectTeam(1)}
                  disabled={cards1.protect === 0}
                  className="mt-3 w-full py-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-300 dark:border-emerald-700"
                >
                  <Shield size={14} /> حماية سريعة لدولة
                </button>
              </div>

              {/* صندوق الفريق الثاني */}
              <div
                className={`p-4 rounded-xl border-4 bg-white dark:bg-slate-800 ${turn === 2 ? "border-rose-500 shadow-md scale-105 transition-transform" : "border-slate-200 dark:border-slate-700"} text-center relative`}
              >
                <div className="font-black text-sm text-slate-800 dark:text-slate-200 mb-1">
                  {team2Name}
                </div>
                <div className="text-3xl font-black dark:text-white">
                  {score2}{" "}
                  <Coins size={22} className="inline text-yellow-500" />
                </div>

                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    onClick={() => adjustScore(2, 100)}
                    className="text-emerald-500 hover:text-emerald-600"
                    title="إضافة 100"
                  >
                    <PlusCircle size={18} />
                  </button>
                  <button
                    onClick={() => adjustScore(2, -100)}
                    className="text-rose-500 hover:text-rose-600"
                    title="خصم 100"
                  >
                    <MinusCircle size={18} />
                  </button>
                </div>

                <div className="flex justify-center gap-2 mt-3 text-[10px] font-bold">
                  <span className="bg-slate-100 dark:bg-slate-700 dark:text-white px-2 py-1.5 rounded flex items-center gap-1">
                    <TankIcon size={12} /> استحلال: {cards2.capture}
                  </span>
                  <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2 py-1.5 rounded flex items-center gap-1">
                    <Shield size={12} /> حماية: {cards2.protect}
                  </span>
                  <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-1.5 rounded flex items-center gap-1">
                    <Rocket size={12} /> قصف: {cards2.airStrike}
                  </span>
                  <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-2 py-1.5 rounded flex items-center gap-1">
                    <Crown size={12} /> غزو العاصمة: {cards2.capitalCapture}
                  </span>
                </div>
                <button
                  onClick={() => setQuickProtectTeam(2)}
                  disabled={cards2.protect === 0}
                  className="mt-3 w-full py-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400 font-black text-xs rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-300 dark:border-emerald-700"
                >
                  <Shield size={14} /> حماية سريعة لدولة
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-2 mb-4 w-full z-50">
              <button
                onClick={() => {
                  setTurn((t) => (t === 1 ? 2 : 1));
                  setSelectedCountry(null);
                  setTeam1Choice(null);
                  setTeam2Choice(null);
                  setShowResult(false);
                  setIsAttacking(false);
                  setIsQuestionRevealed(false);
                  setForcedWinner(null);
                }}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-sm lg:text-base rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 border-2 border-amber-600/50"
              >
                <ArrowLeftRight size={20} />
                تمرير الدور إلى: {turn === 1 ? team2Name : team1Name}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 z-40">
              <div
                className={`flex flex-col gap-4 transition-all duration-500 ${selectedCountry ? "w-full lg:w-1/2" : "w-full lg:w-3/4 mx-auto"}`}
              >
                <div className="flex flex-wrap items-center justify-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm mx-auto w-fit">
                  {CONTINENTS.map((cont) => (
                    <button
                      key={cont.name}
                      onClick={() =>
                        setMapPosition({
                          center: cont.center,
                          zoom: cont.zoom,
                          name: cont.name,
                        })
                      }
                      className={`px-4 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all duration-300 ${
                        mapPosition.name === cont.name
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 -translate-y-0.5"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      {cont.name}
                    </button>
                  ))}
                </div>

                <div
                  className={`relative bg-[#7bc3f5] dark:bg-[#287cb5] rounded-[2rem] border-4 border-slate-300 dark:border-slate-800 overflow-hidden shadow-inner flex flex-col items-center justify-center w-full`}
                >
                  <ComposableMap
                    projectionConfig={{ scale: 200 }}
                    className="w-full h-full min-h-[50vh] max-h-[70vh]"
                  >
                    <ZoomableGroup
                      center={mapPosition.center}
                      zoom={mapPosition.zoom}
                      onMoveEnd={(pos) =>
                        setMapPosition({
                          center: pos.coordinates as [number, number],
                          zoom: pos.zoom,
                          name: mapPosition.name,
                        })
                      }
                    >
                      <Geographies geography={geoUrl}>
                        {({ geographies }: { geographies: any[] }) => (
                          <>
                            {geographies.map((geo: any) => {
                              const country = countries.find(
                                (c) => c.geoId === geo.id,
                              );
                              let fillColor = "#cbd5e1";
                              if (country) {
                                if (country.owner === 1) fillColor = "#06b6d4";
                                else if (country.owner === 2)
                                  fillColor = "#f43f5e";
                                else if (country.isChallenge)
                                  fillColor = "#a855f7";
                                else fillColor = "#facc15";
                              }
                              return (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  onClick={() => handleCountryClick(geo.id)}
                                  style={{
                                    default: {
                                      fill: fillColor,
                                      outline: "none",
                                      stroke: "#334155",
                                      strokeWidth: 0.8,
                                    },
                                    hover: {
                                      fill: country ? "#3b82f6" : fillColor,
                                      cursor: "pointer",
                                      outline: "none",
                                      strokeWidth: 1.5,
                                    },
                                  }}
                                />
                              );
                            })}
                            {geographies.map((geo: any) => {
                              const country = countries.find(
                                (c) => c.geoId === geo.id,
                              );
                              if (!country) return null;
                              const centroid = geoCentroid(geo);
                              if (
                                !centroid ||
                                isNaN(centroid[0]) ||
                                isNaN(centroid[1])
                              )
                                return null;

                              const isProtected =
                                protectedCountries[country.id];

                              let label = country.name;
                              if (
                                country.id === capitals.team1 ||
                                country.id === capitals.team2
                              ) {
                                label += " 👑";
                              }

                              return (
                                <Marker
                                  key={`m-${geo.rsmKey}`}
                                  coordinates={centroid}
                                >
                                  {isProtected && (
                                    <g transform="translate(0, -14)">
                                      <circle
                                        r="8"
                                        fill="#10b981"
                                        stroke="#fff"
                                        strokeWidth="1"
                                      />
                                      <Shield
                                        width="10"
                                        height="10"
                                        x="-5"
                                        y="-5"
                                        color="white"
                                        strokeWidth="2.5"
                                      />
                                    </g>
                                  )}
                                  {country.isStolen && (
                                    <g transform="translate(0, -18)">
                                      <Swords
                                        width="18"
                                        height="18"
                                        x="-9"
                                        y="-9"
                                        color="black"
                                        strokeWidth="3"
                                      />
                                    </g>
                                  )}
                                  <text
                                    textAnchor="middle"
                                    y={3}
                                    fill={country.owner ? "#fff" : "#1e293b"}
                                    style={{
                                      fontFamily: "Cairo",
                                      fontSize: "8px",
                                      fontWeight: "900",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {label}
                                  </text>
                                </Marker>
                              );
                            })}
                          </>
                        )}
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                </div>
              </div>

              {selectedCountry && (
                <div className="w-full lg:w-1/2 bg-white dark:bg-slate-900 rounded-3xl border-4 border-blue-500 p-6 shadow-2xl flex flex-col h-fit animate-in slide-in-from-left-4">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <span className="font-black text-xl dark:text-white flex items-center gap-2">
                      <MapPin
                        size={22}
                        className={
                          selectedCountry.isChallenge
                            ? "text-purple-500"
                            : "text-blue-500"
                        }
                      />{" "}
                      {selectedCountry.name}{" "}
                      {(selectedCountry.id === capitals.team1 ||
                        selectedCountry.id === capitals.team2) && (
                        <Crown className="text-amber-500" size={20} />
                      )}
                      {!(
                        selectedCountry.id === capitals.team1 ||
                        selectedCountry.id === capitals.team2
                      ) && (
                        <span className="text-sm font-bold text-slate-500">
                          ({selectedCountry.value} نقطة)
                        </span>
                      )}
                    </span>
                    <div className="flex gap-2">
                      {selectedCountry.owner === null &&
                        !isAttacking &&
                        !selectedCountry.isChallenge && (
                          <button
                            onClick={handleChangeQuestion}
                            className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                          >
                            <RefreshCw size={14} /> تغيير السؤال (1000)
                          </button>
                        )}
                      <button
                        onClick={() => {
                          setSelectedCountry(null);
                          setTeam1Choice(null);
                          setTeam2Choice(null);
                          setShowResult(false);
                          setIsAttacking(false);
                          setIsQuestionRevealed(false);
                          setForcedWinner(null);
                        }}
                        className="p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg dark:text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  {selectedCountry.owner === null || isAttacking ? (
                    selectedCountry.activeQuestion ? (
                      <div className="space-y-6">
                        {!selectedCountry.activeQuestion && !isAttacking ? (
                          <button
                            onClick={handleConfirmAnswers}
                            className="w-full py-8 bg-blue-600 text-white rounded-2xl font-black text-xl"
                          >
                            سحب سؤال للدولة
                          </button>
                        ) : (
                          <>
                            {!isQuestionRevealed && (
                              <button
                                onClick={() => setIsQuestionRevealed(true)}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-md transition-all mb-4"
                              >
                                إظهار السؤال للجمهور
                              </button>
                            )}

                            <p className="text-lg font-black dark:text-white text-center leading-relaxed">
                              {selectedCountry.activeQuestion.q}
                            </p>

                            {selectedCountry.activeQuestion.options &&
                              selectedCountry.activeQuestion.options.length >
                                0 && (
                                <div className="space-y-4 w-full">
                                  {(!isAttacking || turn === 1) && (
                                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <p className="text-xs font-black text-cyan-600 dark:text-cyan-400 mb-2">
                                        إجابة {team1Name}:
                                      </p>
                                      <div className="flex gap-2">
                                        {selectedCountry.activeQuestion.options.map(
                                          (o: string, i: number) => (
                                            <button
                                              key={i}
                                              disabled={showResult}
                                              onClick={() => setTeam1Choice(o)}
                                              className={`flex-1 p-2 rounded-lg font-bold text-[10px] border-2 transition-all ${team1Choice === o ? "bg-cyan-500 border-cyan-600 text-white shadow-sm" : "bg-white dark:bg-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700"}`}
                                            >
                                              {o}
                                            </button>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {(!isAttacking || turn === 2) && (
                                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                                      <p className="text-xs font-black text-rose-600 dark:text-rose-400 mb-2">
                                        إجابة {team2Name}:
                                      </p>
                                      <div className="flex gap-2">
                                        {selectedCountry.activeQuestion.options.map(
                                          (o: string, i: number) => (
                                            <button
                                              key={i}
                                              disabled={showResult}
                                              onClick={() => setTeam2Choice(o)}
                                              className={`flex-1 p-2 rounded-lg font-bold text-[10px] border-2 transition-all ${team2Choice === o ? "bg-rose-500 border-rose-600 text-white shadow-sm" : "bg-white dark:bg-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700"}`}
                                            >
                                              {o}
                                            </button>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                            {!showResult &&
                              selectedCountry.activeQuestion.options &&
                              selectedCountry.activeQuestion.options.length >
                                0 && (
                                <button
                                  onClick={handleConfirmAnswers}
                                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md transition-all"
                                >
                                  اعتماد الإجابات وإظهار النتيجة
                                </button>
                              )}

                            {showResult &&
                              selectedCountry.activeQuestion.options &&
                              selectedCountry.activeQuestion.options.length >
                                0 && (
                                <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center animate-in fade-in">
                                  {(() => {
                                    let winner: 1 | 2 | null = null;
                                    if (isAttacking) {
                                      const attackerChoice =
                                        turn === 1 ? team1Choice : team2Choice;
                                      if (
                                        attackerChoice ===
                                        selectedCountry.activeQuestion?.a
                                      )
                                        winner = turn;
                                    } else {
                                      const is1Correct =
                                        team1Choice ===
                                        selectedCountry.activeQuestion?.a;
                                      const is2Correct =
                                        team2Choice ===
                                        selectedCountry.activeQuestion?.a;
                                      if (turn === 1) {
                                        if (is1Correct) winner = 1;
                                        else if (is2Correct) winner = 2;
                                      } else {
                                        if (is2Correct) winner = 2;
                                        else if (is1Correct) winner = 1;
                                      }
                                    }

                                    if (winner) {
                                      const currentCards =
                                        winner === 1 ? cards1 : cards2;
                                      const canProtectImmediately =
                                        currentCards.protect > 0 &&
                                        !protectedCountries[selectedCountry.id];

                                      return (
                                        <>
                                          <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400 mb-2">
                                            إجابة صحيحة! 🎉
                                          </h3>
                                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                            تم الاستحلال لـ{" "}
                                            {winner === 1
                                              ? team1Name
                                              : team2Name}
                                          </p>
                                          {selectedCountry.id ===
                                            capitals.team1 ||
                                          selectedCountry.id ===
                                            capitals.team2 ? (
                                            <p className="text-lg font-black text-amber-500 mt-2 mb-4">
                                              مكافأة العاصمة: ثلث نقاط الخصم 💰
                                            </p>
                                          ) : (
                                            <p className="text-lg font-black text-amber-500 mt-2 mb-4">
                                              الموارد المكتسبة:{" "}
                                              {selectedCountry.value} نقطة 💰
                                            </p>
                                          )}

                                          <div className="flex flex-col gap-2">
                                            <button
                                              onClick={() =>
                                                handleCapture(winner!)
                                              }
                                              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md transition-all"
                                            >
                                              تأكيد ومتابعة (بدون حماية)
                                            </button>
                                            {canProtectImmediately && (
                                              <button
                                                onClick={() => {
                                                  if (winner === 1) {
                                                    setCards1((prev: any) => ({
                                                      ...prev,
                                                      protect: prev.protect - 1,
                                                    }));
                                                  } else {
                                                    setCards2((prev: any) => ({
                                                      ...prev,
                                                      protect: prev.protect - 1,
                                                    }));
                                                  }
                                                  setProtectedCountries(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      [selectedCountry.id]: true,
                                                    }),
                                                  );
                                                  handleCapture(winner!);
                                                }}
                                                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-xl shadow-md transition-all"
                                              >
                                                تأكيد ومتابعة + تفعيل حماية
                                                فورية (بطاقة)
                                              </button>
                                            )}
                                          </div>
                                        </>
                                      );
                                    } else {
                                      return (
                                        <>
                                          <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 mb-2">
                                            إجابة خاطئة! ❌
                                          </h3>
                                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                                            فشل الاستحلال والهجوم
                                          </p>
                                          <button
                                            onClick={handleMiss}
                                            className="w-full py-3 bg-slate-500 hover:bg-slate-600 text-white font-black text-sm rounded-xl shadow-md transition-all"
                                          >
                                            تأكيد وتطبيق العقوبة
                                          </button>
                                        </>
                                      );
                                    }
                                  })()}
                                </div>
                              )}

                            {!showResult &&
                              selectedCountry.isChallenge &&
                              (!selectedCountry.activeQuestion.options ||
                                selectedCountry.activeQuestion.options
                                  .length === 0) && (
                                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                  <p className="text-xs font-bold text-purple-600 mb-3">
                                    تحدي حكم مباشر: الحكم يقرر الفائز باستخدام
                                    أدوات الطوارئ بالأسفل
                                  </p>
                                  <button
                                    onClick={() => {
                                      setShowResult(true);
                                    }}
                                    className="py-2 px-6 bg-purple-600 text-white rounded-lg font-black text-xs"
                                  >
                                    بدء تنفيذ التحدي
                                  </button>
                                </div>
                              )}

                            <div className="flex flex-col items-center justify-center pt-2">
                              {!isTimerRunning && timer === 20 ? (
                                <button
                                  onClick={() => setIsTimerRunning(true)}
                                  className="py-3 px-8 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-sm rounded-xl shadow-md inline-flex items-center gap-2"
                                >
                                  <Play size={20} /> بدء المؤقت (للجمهور)
                                </button>
                              ) : (
                                <div className="text-center font-black text-4xl text-amber-500 font-mono tracking-widest">
                                  {timer}
                                </div>
                              )}
                            </div>

                            <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
                              <p className="text-[10px] font-black text-slate-400 mb-3 text-right">
                                أدوات الحكم (إدارة الطوارئ):
                              </p>
                              {forcedWinner ? (
                                <div className="col-span-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-xl text-center animate-in fade-in">
                                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-2">
                                    إجبار فوز لـ{" "}
                                    {forcedWinner === 1 ? team1Name : team2Name}
                                  </p>
                                  <div className="flex flex-col gap-2">
                                    <button
                                      onClick={() => {
                                        if (selectedCountry.isChallenge) {
                                          if (forcedWinner === 1)
                                            setChallengesUsed1(
                                              (p: number) => p + 1,
                                            );
                                          else
                                            setChallengesUsed2(
                                              (p: number) => p + 1,
                                            );
                                        }
                                        handleCapture(forcedWinner, true);
                                      }}
                                      className="py-2 bg-emerald-500 text-white rounded-lg text-[11px] font-black"
                                    >
                                      تأكيد ومتابعة (بدون حماية)
                                    </button>
                                    {(forcedWinner === 1
                                      ? cards1.protect
                                      : cards2.protect) > 0 &&
                                      !protectedCountries[
                                        selectedCountry.id
                                      ] && (
                                        <button
                                          onClick={() => {
                                            if (selectedCountry.isChallenge) {
                                              if (forcedWinner === 1)
                                                setChallengesUsed1(
                                                  (p: number) => p + 1,
                                                );
                                              else
                                                setChallengesUsed2(
                                                  (p: number) => p + 1,
                                                );
                                            }
                                            if (forcedWinner === 1)
                                              setCards1((p: any) => ({
                                                ...p,
                                                protect: p.protect - 1,
                                              }));
                                            else
                                              setCards2((p: any) => ({
                                                ...p,
                                                protect: p.protect - 1,
                                              }));
                                            setProtectedCountries((p: any) => ({
                                              ...p,
                                              [selectedCountry.id]: true,
                                            }));
                                            handleCapture(forcedWinner, true);
                                          }}
                                          className="py-2 bg-teal-600 text-white rounded-lg text-[11px] font-black"
                                        >
                                          تأكيد ومتابعة + تفعيل حماية
                                        </button>
                                      )}
                                    <button
                                      onClick={() => setForcedWinner(null)}
                                      className="py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-[11px] font-black mt-1"
                                    >
                                      إلغاء
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    onClick={handleRefereeChangeQuestion}
                                    className="col-span-2 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold transition-colors"
                                  >
                                    تغيير السؤال/التحدي
                                  </button>
                                  <button
                                    onClick={handleManualFree}
                                    className="py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg text-[11px] font-bold transition-colors"
                                  >
                                    سحب وجعلها حرة
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `هل أنت متأكد من إجبار فوز ${team1Name}؟`,
                                        )
                                      )
                                        setForcedWinner(1);
                                    }}
                                    className="py-2.5 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-[11px] font-bold transition-colors"
                                  >
                                    إجبار فوز {team1Name}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        confirm(
                                          `هل أنت متأكد من إجبار فوز ${team2Name}؟`,
                                        )
                                      )
                                        setForcedWinner(2);
                                    }}
                                    className="py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-[11px] font-bold transition-colors"
                                  >
                                    إجبار فوز {team2Name}
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-4">
                        <p className="text-slate-400 text-base font-bold">
                          لا يوجد أسئلة مسجلة في هذه الدولة.
                        </p>
                        <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 text-right">
                          <p className="text-[10px] font-black text-slate-400 mb-3">
                            أدوات الحكم (إدارة الطوارئ):
                          </p>
                          {forcedWinner ? (
                            <div className="col-span-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-xl text-center animate-in fade-in">
                              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-2">
                                إجبار فوز لـ{" "}
                                {forcedWinner === 1 ? team1Name : team2Name}
                              </p>
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => {
                                    if (selectedCountry.isChallenge) {
                                      if (forcedWinner === 1)
                                        setChallengesUsed1(
                                          (p: number) => p + 1,
                                        );
                                      else
                                        setChallengesUsed2(
                                          (p: number) => p + 1,
                                        );
                                    }
                                    handleCapture(forcedWinner, true);
                                  }}
                                  className="py-2 bg-emerald-500 text-white rounded-lg text-[11px] font-black"
                                >
                                  تأكيد ومتابعة (بدون حماية)
                                </button>
                                {(forcedWinner === 1
                                  ? cards1.protect
                                  : cards2.protect) > 0 &&
                                  !protectedCountries[selectedCountry.id] && (
                                    <button
                                      onClick={() => {
                                        if (selectedCountry.isChallenge) {
                                          if (forcedWinner === 1)
                                            setChallengesUsed1(
                                              (p: number) => p + 1,
                                            );
                                          else
                                            setChallengesUsed2(
                                              (p: number) => p + 1,
                                            );
                                        }
                                        if (forcedWinner === 1)
                                          setCards1((p: any) => ({
                                            ...p,
                                            protect: p.protect - 1,
                                          }));
                                        else
                                          setCards2((p: any) => ({
                                            ...p,
                                            protect: p.protect - 1,
                                          }));
                                        setProtectedCountries((p: any) => ({
                                          ...p,
                                          [selectedCountry.id]: true,
                                        }));
                                        handleCapture(forcedWinner, true);
                                      }}
                                      className="py-2 bg-teal-600 text-white rounded-lg text-[11px] font-black"
                                    >
                                      تأكيد ومتابعة + تفعيل حماية
                                    </button>
                                  )}
                                <button
                                  onClick={() => setForcedWinner(null)}
                                  className="py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-[11px] font-black mt-1"
                                >
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={handleManualFree}
                                className="col-span-2 py-2.5 bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-900/30 text-rose-600 rounded-lg text-xs font-bold transition-colors"
                              >
                                سحب وجعلها حرة
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `هل أنت متأكد من إجبار فوز ${team1Name}؟`,
                                    )
                                  )
                                    setForcedWinner(1);
                                }}
                                className="py-2.5 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-bold transition-colors"
                              >
                                إجبار فوز {team1Name}
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `هل أنت متأكد من إجبار فوز ${team2Name}؟`,
                                    )
                                  )
                                    setForcedWinner(2);
                                }}
                                className="py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors"
                              >
                                إجبار فوز {team2Name}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="py-6 text-center space-y-4">
                      <p className="font-bold text-lg dark:text-white mb-6">
                        مملوكة لـ{" "}
                        {selectedCountry.owner === 1 ? team1Name : team2Name}
                      </p>

                      {(() => {
                        const isProtected =
                          protectedCountries[selectedCountry.id];
                        const isChallengeOwned =
                          selectedCountry.isChallenge &&
                          selectedCountry.owner !== null;
                        const isOpponentCapital =
                          selectedCountry.id ===
                          (turn === 1 ? capitals.team2 : capitals.team1);
                        const canBeAttacked =
                          !isChallengeOwned && !selectedCountry.isStolen;

                        return (
                          <>
                            {selectedCountry.owner !== turn &&
                              canBeAttacked &&
                              !isProtected &&
                              !isOpponentCapital && (
                                <button
                                  onClick={useCaptureCard}
                                  className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black shadow-md w-full flex items-center justify-center gap-2 transition-colors"
                                >
                                  <TankIcon /> بدء الاستحلال الأبدي (خصم بطاقة
                                  دبابة واحدة)
                                </button>
                              )}

                            {selectedCountry.owner !== turn &&
                              canBeAttacked &&
                              !isProtected &&
                              isOpponentCapital && (
                                <button
                                  onClick={useCaptureCard}
                                  className="px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black shadow-md w-full flex items-center justify-center gap-2 transition-colors"
                                >
                                  <Crown /> غزو العاصمة الأبدي (خصم بطاقة غزو
                                  واحدة)
                                </button>
                              )}

                            {selectedCountry.owner !== turn &&
                              canBeAttacked &&
                              !isOpponentCapital && (
                                <button
                                  onClick={useAirStrike}
                                  className="px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-black shadow-md w-full flex items-center justify-center gap-2 transition-colors"
                                >
                                  <Rocket /> قصف مدمر (- نصف قيمة الدولة من
                                  المدافع وبطاقة)
                                </button>
                              )}

                            {isProtected &&
                              selectedCountry.owner !== turn &&
                              !isOpponentCapital && (
                                <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl font-black shadow-inner w-full flex items-center justify-center gap-2">
                                  <Shield /> الدولة محمية بشكل كامل ضد الاستحلال
                                  المباشر بالدبابة
                                </div>
                              )}

                            {isProtected &&
                              selectedCountry.owner !== turn &&
                              isOpponentCapital && (
                                <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl font-black shadow-inner w-full flex items-center justify-center gap-2">
                                  <Shield /> العاصمة محمية بالدرع ولا يمكن غزوها
                                  حالياً
                                </div>
                              )}

                            {isChallengeOwned &&
                              selectedCountry.owner !== turn && (
                                <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-xl font-black shadow-inner w-full flex items-center justify-center gap-2">
                                  <Star /> دولة التحدي غير قابلة للاستحلال أو
                                  القصف
                                </div>
                              )}

                            {selectedCountry.isStolen &&
                              selectedCountry.owner !== turn && (
                                <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-black shadow-inner w-full flex items-center justify-center gap-2">
                                  ⚔️ الدولة مستحلة أبدياً بالبطاقة ولا يمكن
                                  الهجوم عليها
                                </div>
                              )}
                          </>
                        );
                      })()}

                      {selectedCountry.owner === turn &&
                        !protectedCountries[selectedCountry.id] && (
                          <button
                            onClick={useProtectCard}
                            className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-md w-full flex items-center justify-center gap-2 transition-colors"
                          >
                            <Shield /> تفعيل بطاقة الحماية (درع دائم)
                          </button>
                        )}

                      <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-400 mb-3 text-right">
                          أدوات الحكم (إدارة الطوارئ):
                        </p>
                        {forcedWinner ? (
                          <div className="col-span-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-xl text-center animate-in fade-in">
                            <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-2">
                              إجبار فوز لـ{" "}
                              {forcedWinner === 1 ? team1Name : team2Name}
                            </p>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => {
                                  if (selectedCountry.isChallenge) {
                                    if (forcedWinner === 1)
                                      setChallengesUsed1((p: number) => p + 1);
                                    else
                                      setChallengesUsed2((p: number) => p + 1);
                                  }
                                  handleCapture(forcedWinner, true);
                                }}
                                className="py-2 bg-emerald-500 text-white rounded-lg text-[11px] font-black"
                              >
                                تأكيد ومتابعة (بدون حماية)
                              </button>
                              {(forcedWinner === 1
                                ? cards1.protect
                                : cards2.protect) > 0 &&
                                !protectedCountries[selectedCountry.id] && (
                                  <button
                                    onClick={() => {
                                      if (selectedCountry.isChallenge) {
                                        if (forcedWinner === 1)
                                          setChallengesUsed1(
                                            (p: number) => p + 1,
                                          );
                                        else
                                          setChallengesUsed2(
                                            (p: number) => p + 1,
                                          );
                                      }
                                      if (forcedWinner === 1)
                                        setCards1((p: any) => ({
                                          ...p,
                                          protect: p.protect - 1,
                                        }));
                                      else
                                        setCards2((p: any) => ({
                                          ...p,
                                          protect: p.protect - 1,
                                        }));
                                      setProtectedCountries((p: any) => ({
                                        ...p,
                                        [selectedCountry.id]: true,
                                      }));
                                      handleCapture(forcedWinner, true);
                                    }}
                                    className="py-2 bg-teal-600 text-white rounded-lg text-[11px] font-black"
                                  >
                                    تأكيد ومتابعة + تفعيل حماية
                                  </button>
                                )}
                              <button
                                onClick={() => setForcedWinner(null)}
                                className="py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-[11px] font-black mt-1"
                              >
                                إلغاء
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={handleManualFree}
                              className="col-span-2 py-2.5 bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-900/30 text-rose-600 rounded-lg text-xs font-bold transition-colors"
                            >
                              سحب وجعلها حرة
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `هل أنت متأكد من إجبار فوز ${team1Name}؟`,
                                  )
                                )
                                  setForcedWinner(1);
                              }}
                              className="py-2.5 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-xs font-bold transition-colors"
                            >
                              إجبار فوز {team1Name}
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `هل أنت متأكد من إجبار فوز ${team2Name}؟`,
                                  )
                                )
                                  setForcedWinner(2);
                              }}
                              className="py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-bold transition-colors"
                            >
                              إجبار فوز {team2Name}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="m-auto p-12 bg-white dark:bg-slate-900 rounded-3xl text-center shadow-2xl border-2">
            <Trophy className="text-amber-500 w-24 h-24 mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-8 dark:text-white">
              انتهت المعركة
            </h2>
            <button
              onClick={startGame}
              className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-xl text-xl"
            >
              بدء حرب جديدة
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
