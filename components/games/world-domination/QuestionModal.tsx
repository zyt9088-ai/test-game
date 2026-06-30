"use client";

import React from "react";
import { MapPin, Crown, RefreshCw, X, Play, Shield, Swords, Rocket, Star } from "lucide-react";

const TankIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 11V9a2 2 0 0 1 2-2h4" />
    <path d="M14 7h6" />
    <rect x="2" y="13" width="20" height="6" rx="3" />
    <path d="M5 13v-1.5a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5V13" />
    <circle cx="6" cy="16" r="1" />
    <circle cx="12" cy="16" r="1" />
    <circle cx="18" cy="16" r="1" />
  </svg>
);

// إخفاء السكرول بشكل كامل مع إبقاء إمكانية السحب
const modernScrollbar =
  "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

interface QuestionModalProps {
  selectedCountry: any;
  capitals: { team1: string | null; team2: string | null };
  team1Name: string;
  team2Name: string;
  turn: 1 | 2;
  isAttacking: boolean;
  isQuestionRevealed: boolean;
  setIsQuestionRevealed: (val: boolean) => void;
  team1Choice: string | null;
  team2Choice: string | null;
  setTeam1Choice: (val: string | null) => void;
  setTeam2Choice: (val: string | null) => void;
  showResult: boolean;
  setShowResult: (val: boolean) => void;
  timer: number;
  isTimerRunning: boolean;
  setIsTimerRunning: (val: boolean) => void;
  forcedWinner: 1 | 2 | null;
  setForcedWinner: (val: 1 | 2 | null) => void;
  cards1: any;
  cards2: any;
  setCards1: any;
  setCards2: any;
  protectedCountries: any;
  setProtectedCountries: any;
  setChallengesUsed1: any;
  setChallengesUsed2: any;
  handleConfirmAnswers: () => void;
  handleCapture: (winner: 1 | 2, isForced?: boolean) => void;
  handleMiss: () => void;
  handleRefereeChangeQuestion: () => void;
  handleManualFree: () => void;
  handleChangeQuestion: () => void;
  useCaptureCard: () => void;
  useAirStrike: () => void;
  useProtectCard: () => void;
  closeModal: () => void;
}

export default function QuestionModal({
  selectedCountry,
  capitals,
  team1Name,
  team2Name,
  turn,
  isAttacking,
  isQuestionRevealed,
  setIsQuestionRevealed,
  team1Choice,
  team2Choice,
  setTeam1Choice,
  setTeam2Choice,
  showResult,
  setShowResult,
  timer,
  isTimerRunning,
  setIsTimerRunning,
  forcedWinner,
  setForcedWinner,
  cards1,
  cards2,
  setCards1,
  setCards2,
  protectedCountries,
  setProtectedCountries,
  setChallengesUsed1,
  setChallengesUsed2,
  handleConfirmAnswers,
  handleCapture,
  handleMiss,
  handleRefereeChangeQuestion,
  handleManualFree,
  handleChangeQuestion,
  useCaptureCard,
  useAirStrike,
  useProtectCard,
  closeModal,
}: QuestionModalProps) {
  if (!selectedCountry) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-900/30">
      <div
        className={`w-full max-w-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl lg:rounded-[2rem] border-4 border-blue-500 p-4 lg:p-6 shadow-2xl flex flex-col h-fit max-h-[90vh] overflow-y-auto ${modernScrollbar} animate-in zoom-in-95`}
      >
        <div className="flex justify-between items-center mb-4 lg:mb-6 border-b pb-3 lg:pb-4 sticky top-0 bg-transparent z-10">
          <span className="font-black text-lg lg:text-2xl dark:text-white flex items-center gap-1.5 lg:gap-3">
            <MapPin
              size={18}
              className={`lg:w-[28px] lg:h-[28px] ${
                selectedCountry.isChallenge
                  ? "text-purple-500"
                  : "text-blue-500"
              }`}
            />{" "}
            {selectedCountry.name}{" "}
            {(selectedCountry.id === capitals.team1 ||
              selectedCountry.id === capitals.team2) && (
              <Crown className="text-amber-500 w-4 h-4 lg:w-6 lg:h-6" />
            )}
            {!(
              selectedCountry.id === capitals.team1 ||
              selectedCountry.id === capitals.team2
            ) && (
              <span className="text-xs lg:text-lg font-bold text-slate-500">
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
                  className="px-2 lg:px-4 py-1 lg:py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300 font-bold text-[10px] lg:text-sm rounded-lg lg:rounded-xl transition-colors flex items-center gap-1 lg:gap-2 border-b-4 border-amber-300 dark:border-amber-700 active:border-b-0 active:translate-y-[4px]"
                >
                  <RefreshCw size={12} className="lg:w-[16px] lg:h-[16px]" />{" "}
                  <span className="hidden sm:inline">تغيير السؤال (1000)</span>
                  <span className="sm:hidden">تغيير (1000)</span>
                </button>
              )}
            <button
              onClick={closeModal}
              className="p-1 lg:p-2 hover:bg-slate-100 dark:bg-slate-800 rounded-lg lg:rounded-xl dark:text-white"
            >
              <X size={20} className="lg:w-[28px] lg:h-[28px]" />
            </button>
          </div>
        </div>

        {selectedCountry.owner === null || isAttacking ? (
          selectedCountry.activeQuestion ? (
            <div className="space-y-4 lg:space-y-6">
              {!selectedCountry.activeQuestion && !isAttacking ? (
                <button
                  onClick={handleConfirmAnswers}
                  className="w-full py-6 lg:py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg lg:text-2xl border-b-4 border-blue-800 active:border-b-0 active:translate-y-[4px] transition-all"
                >
                  سحب سؤال للدولة
                </button>
              ) : (
                <>
                  {!isQuestionRevealed && (
                    <button
                      onClick={() => setIsQuestionRevealed(true)}
                      className="w-full py-2.5 lg:py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs lg:text-lg rounded-xl shadow-md transition-all mb-2 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-[4px]"
                    >
                      إظهار السؤال للجمهور
                    </button>
                  )}

                  <p className="text-base lg:text-2xl font-black dark:text-white text-center leading-relaxed">
                    {selectedCountry.activeQuestion.q}
                  </p>

                  {selectedCountry.activeQuestion.options &&
                    selectedCountry.activeQuestion.options.length > 0 && (
                      <div className="space-y-3 lg:space-y-4 w-full">
                        {(!isAttacking || turn === 1) && (
                          <div className="bg-slate-50 dark:bg-slate-800 p-2 lg:p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] lg:text-base font-black text-cyan-600 dark:text-cyan-400 mb-2">
                              إجابة {team1Name}:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {selectedCountry.activeQuestion.options.map(
                                (o: string, i: number) => (
                                  <button
                                    key={i}
                                    disabled={showResult}
                                    onClick={() => setTeam1Choice(o)}
                                    className={`flex-1 p-2 lg:p-3 rounded-lg font-bold text-[10px] lg:text-sm border-2 transition-all ${
                                      team1Choice === o
                                        ? "bg-cyan-500 border-cyan-600 text-white shadow-sm"
                                        : "bg-white dark:bg-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    {o}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {(!isAttacking || turn === 2) && (
                          <div className="bg-slate-50 dark:bg-slate-800 p-2 lg:p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] lg:text-base font-black text-rose-600 dark:text-rose-400 mb-2">
                              إجابة {team2Name}:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {selectedCountry.activeQuestion.options.map(
                                (o: string, i: number) => (
                                  <button
                                    key={i}
                                    disabled={showResult}
                                    onClick={() => setTeam2Choice(o)}
                                    className={`flex-1 p-2 lg:p-3 rounded-lg font-bold text-[10px] lg:text-sm border-2 transition-all ${
                                      team2Choice === o
                                        ? "bg-rose-500 border-rose-600 text-white shadow-sm"
                                        : "bg-white dark:bg-slate-900 dark:text-white border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700"
                                    }`}
                                  >
                                    {o}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {selectedCountry.activeQuestion.options &&
                    selectedCountry.activeQuestion.options.length > 0 &&
                    !showResult && (
                      <button
                        onClick={handleConfirmAnswers}
                        className="w-full py-2.5 lg:py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs lg:text-lg rounded-xl shadow-md transition-all mt-2 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px]"
                      >
                        اعتماد الإجابات وإظهار النتيجة
                      </button>
                    )}

                  {showResult &&
                    selectedCountry.activeQuestion.options &&
                    selectedCountry.activeQuestion.options.length > 0 && (
                      <div className="mt-2 p-3 lg:p-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-center animate-in fade-in">
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
                              team1Choice === selectedCountry.activeQuestion?.a;
                            const is2Correct =
                              team2Choice === selectedCountry.activeQuestion?.a;
                            if (turn === 1) {
                              if (is1Correct) winner = 1;
                              else if (is2Correct) winner = 2;
                            } else {
                              if (is2Correct) winner = 2;
                              else if (is1Correct) winner = 1;
                            }
                          }

                          if (winner) {
                            const currentCards = winner === 1 ? cards1 : cards2;
                            const canProtectImmediately =
                              currentCards.protect > 0 &&
                              !protectedCountries[selectedCountry.id];

                            return (
                              <>
                                <h3 className="text-lg lg:text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                                  إجابة صحيحة! 🎉
                                </h3>
                                <p className="text-xs lg:text-lg font-bold text-slate-700 dark:text-slate-300">
                                  تم الاستحلال لـ{" "}
                                  {winner === 1 ? team1Name : team2Name}
                                </p>
                                {selectedCountry.id === capitals.team1 ||
                                selectedCountry.id === capitals.team2 ? (
                                  <p className="text-sm lg:text-xl font-black text-amber-500 mt-2 mb-3">
                                    مكافأة العاصمة: ثلث نقاط الخصم 💰
                                  </p>
                                ) : (
                                  <p className="text-sm lg:text-xl font-black text-amber-500 mt-2 mb-3">
                                    الموارد المكتسبة: {selectedCountry.value}{" "}
                                    نقطة 💰
                                  </p>
                                )}

                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={() => handleCapture(winner!)}
                                    className="w-full py-2.5 lg:py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs lg:text-base rounded-xl shadow-md transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-[4px]"
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
                                        setProtectedCountries((prev: any) => ({
                                          ...prev,
                                          [selectedCountry.id]: true,
                                        }));
                                        handleCapture(winner!);
                                      }}
                                      className="w-full py-2.5 lg:py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs lg:text-base rounded-xl shadow-md transition-all border-b-4 border-teal-800 active:border-b-0 active:translate-y-[4px]"
                                    >
                                      تأكيد ومتابعة + تفعيل حماية فورية (بطاقة)
                                    </button>
                                  )}
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <h3 className="text-lg lg:text-2xl font-black text-rose-600 dark:text-rose-400 mb-1">
                                  إجابة خاطئة! ❌
                                </h3>
                                <p className="text-xs lg:text-lg font-bold text-slate-700 dark:text-slate-300 mb-3">
                                  فشل الاستحلال والهجوم
                                </p>
                                <button
                                  onClick={handleMiss}
                                  className="w-full py-2.5 lg:py-3 bg-slate-500 hover:bg-slate-400 text-white font-black text-xs lg:text-base rounded-xl shadow-md transition-all border-b-4 border-slate-700 active:border-b-0 active:translate-y-[4px]"
                                >
                                  تأكيد وتطبيق العقوبة
                                </button>
                              </>
                            );
                          }
                        })()}
                      </div>
                    )}

                  {selectedCountry.isChallenge &&
                    (!selectedCountry.activeQuestion.options ||
                      selectedCountry.activeQuestion.options.length === 0) &&
                    !showResult && (
                      <div className="text-center p-3 lg:p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                        <p className="text-[10px] lg:text-xs font-bold text-purple-600 mb-2">
                          تحدي حكم مباشر: الحكم يقرر الفائز باستخدام أدوات
                          الطوارئ بالأسفل
                        </p>
                        <button
                          onClick={() => {
                            setShowResult(true);
                          }}
                          className="py-1.5 lg:py-2.5 px-4 lg:px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-black text-[10px] lg:text-sm border-b-4 border-purple-800 active:border-b-0 active:translate-y-[4px] transition-all"
                        >
                          بدء تنفيذ التحدي
                        </button>
                      </div>
                    )}

                  <div className="flex flex-col items-center justify-center pt-2">
                    {!isTimerRunning && timer === 20 ? (
                      <button
                        onClick={() => setIsTimerRunning(true)}
                        className="py-2 lg:py-3 px-6 lg:px-8 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs lg:text-base rounded-xl shadow-md inline-flex items-center gap-2 border-b-4 border-amber-700 active:border-b-0 active:translate-y-[4px] transition-all"
                      >
                        <Play size={16} /> بدء المؤقت (للجمهور)
                      </button>
                    ) : (
                      <div className="text-center font-black text-3xl lg:text-5xl text-amber-500 font-mono tracking-widest">
                        {timer}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-[9px] lg:text-xs font-black text-slate-400 mb-2 text-right">
                      أدوات الحكم (إدارة الطوارئ):
                    </p>
                    {forcedWinner ? (
                      <div className="col-span-1 sm:col-span-2 p-2 lg:p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-xl text-center animate-in fade-in">
                        <p className="text-[10px] lg:text-sm font-black text-emerald-600 dark:text-emerald-400 mb-2">
                          إجبار فوز لـ{" "}
                          {forcedWinner === 1 ? team1Name : team2Name}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => {
                              if (selectedCountry.isChallenge) {
                                if (forcedWinner === 1)
                                  setChallengesUsed1((p: number) => p + 1);
                                else setChallengesUsed2((p: number) => p + 1);
                              }
                              handleCapture(forcedWinner, true);
                            }}
                            className="py-1.5 lg:py-2 px-2 flex-1 bg-emerald-500 text-white rounded-lg text-[9px] lg:text-xs font-black"
                          >
                            تأكيد ومتابعة
                          </button>
                          {(forcedWinner === 1
                            ? cards1.protect
                            : cards2.protect) > 0 &&
                            !protectedCountries[selectedCountry.id] && (
                              <button
                                onClick={() => {
                                  if (selectedCountry.isChallenge) {
                                    if (forcedWinner === 1)
                                      setChallengesUsed1((p: number) => p + 1);
                                    else
                                      setChallengesUsed2((p: number) => p + 1);
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
                                className="py-1.5 lg:py-2 px-2 flex-1 bg-teal-600 text-white rounded-lg text-[9px] lg:text-xs font-black"
                              >
                                تأكيد + حماية فورية
                              </button>
                            )}
                          <button
                            onClick={() => setForcedWinner(null)}
                            className="py-1.5 lg:py-2 px-4 flex-none bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-[9px] lg:text-xs font-black mt-1 sm:mt-0"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={handleRefereeChangeQuestion}
                          className="col-span-1 sm:col-span-2 py-2 lg:py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                        >
                          تغيير السؤال/التحدي
                        </button>
                        <button
                          onClick={handleManualFree}
                          className="col-span-1 sm:col-span-2 py-2 lg:py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-900/30 text-rose-600 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                        >
                          سحب وجعلها حرة
                        </button>
                        <button
                          onClick={() => setForcedWinner(1)}
                          className="py-2 lg:py-2.5 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                        >
                          إجبار فوز {team1Name}
                        </button>
                        <button
                          onClick={() => setForcedWinner(2)}
                          className="py-2 lg:py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
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
            <div className="py-6 lg:py-8 text-center space-y-3 lg:space-y-4">
              <p className="text-slate-400 text-sm lg:text-base font-bold">
                لا يوجد أسئلة مسجلة في هذه الدولة.
              </p>
              <div className="pt-4 lg:pt-6 mt-3 lg:mt-4 border-t border-slate-200 dark:border-slate-800 text-right">
                <p className="text-[9px] lg:text-xs font-black text-slate-400 mb-2">
                  أدوات الحكم (إدارة الطوارئ):
                </p>
                {forcedWinner ? (
                  <div className="col-span-1 sm:col-span-2 p-2 lg:p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-xl text-center animate-in fade-in">
                    <p className="text-[10px] lg:text-sm font-black text-emerald-600 dark:text-emerald-400 mb-2">
                      إجبار فوز لـ {forcedWinner === 1 ? team1Name : team2Name}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => {
                          if (selectedCountry.isChallenge) {
                            if (forcedWinner === 1)
                              setChallengesUsed1((p: number) => p + 1);
                            else setChallengesUsed2((p: number) => p + 1);
                          }
                          handleCapture(forcedWinner, true);
                        }}
                        className="py-1.5 lg:py-2 px-2 flex-1 bg-emerald-500 text-white rounded-lg text-[9px] lg:text-xs font-black"
                      >
                        تأكيد ومتابعة
                      </button>
                      {(forcedWinner === 1 ? cards1.protect : cards2.protect) >
                        0 &&
                        !protectedCountries[selectedCountry.id] && (
                          <button
                            onClick={() => {
                              if (selectedCountry.isChallenge) {
                                if (forcedWinner === 1)
                                  setChallengesUsed1((p: number) => p + 1);
                                else setChallengesUsed2((p: number) => p + 1);
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
                            className="py-1.5 lg:py-2 px-2 flex-1 bg-teal-600 text-white rounded-lg text-[9px] lg:text-xs font-black"
                          >
                            تأكيد + حماية فورية
                          </button>
                        )}
                      <button
                        onClick={() => setForcedWinner(null)}
                        className="py-1.5 lg:py-2 px-4 flex-none bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-[9px] lg:text-xs font-black mt-1 sm:mt-0"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleManualFree}
                      className="col-span-1 sm:col-span-2 py-2 lg:py-2.5 bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-900/30 text-rose-600 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                    >
                      سحب وجعلها حرة
                    </button>
                    <button
                      onClick={() => setForcedWinner(1)}
                      className="py-2 lg:py-2.5 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                    >
                      إجبار فوز {team1Name}
                    </button>
                    <button
                      onClick={() => setForcedWinner(2)}
                      className="py-2 lg:py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                    >
                      إجبار فوز {team2Name}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="py-4 lg:py-8 text-center space-y-3 lg:space-y-5">
            <p className="font-bold text-base lg:text-xl dark:text-white mb-4 lg:mb-6">
              مملوكة لـ {selectedCountry.owner === 1 ? team1Name : team2Name}
            </p>

            {(() => {
              const isProtected = protectedCountries[selectedCountry.id];
              const isChallengeOwned =
                selectedCountry.isChallenge && selectedCountry.owner !== null;
              const isOpponentCapital =
                selectedCountry.id ===
                (turn === 1 ? capitals.team2 : capitals.team1);
              
              // فصلنا شرط الهجوم العادي عن العاصمة عشان ما يتصادمون
              const canBeAttacked = !isChallengeOwned && !selectedCountry.isStolen;

              return (
                <>
                  {/* 1. زر الاستحلال العادي (للدول العادية فقط) */}
                  {selectedCountry.owner !== turn &&
                    canBeAttacked &&
                    !isProtected &&
                    !isOpponentCapital && (
                      <button
                        onClick={useCaptureCard}
                        className="px-4 py-3 lg:px-6 lg:py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl lg:rounded-2xl font-black shadow-md w-full flex items-center justify-center gap-2 border-b-4 border-purple-800 active:border-b-0 active:translate-y-[4px] transition-all text-xs lg:text-lg"
                      >
                        <TankIcon size={18} /> بدء الاستحلال الأبدي
                      </button>
                    )}

                  {/* 2. زر غزو العاصمة (مفصول بشروطه الخاصة عشان يظهر دائماً) */}
                  {selectedCountry.owner !== turn &&
                    !isProtected &&
                    isOpponentCapital && (
                      <button
                        onClick={useCaptureCard}
                        className="px-4 py-3 lg:px-6 lg:py-5 bg-slate-800 hover:bg-slate-700 text-yellow-400 rounded-xl lg:rounded-2xl font-black shadow-md w-full flex items-center justify-center gap-2 border-b-4 border-slate-950 active:border-b-0 active:translate-y-[4px] transition-all text-xs lg:text-lg mt-2"
                      >
                        <Crown size={18} /> غزو العاصمة
                      </button>
                    )}

                  {/* 3. زر القصف المدمر (للدول العادية فقط) */}
                  {selectedCountry.owner !== turn &&
                    canBeAttacked &&
                    !isOpponentCapital && (
                      <button
                        onClick={useAirStrike}
                        className="px-4 py-3 lg:px-6 lg:py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl lg:rounded-2xl font-black shadow-md w-full flex items-center justify-center gap-2 border-b-4 border-rose-800 active:border-b-0 active:translate-y-[4px] transition-all text-xs lg:text-lg mt-3"
                      >
                        <Rocket size={18} /> قصف مدمر (- نصف الدولة)
                      </button>
                    )}

                  {/* 4. رسالة الحماية ضد الدبابات */}
                  {isProtected &&
                    selectedCountry.owner !== turn &&
                    !isOpponentCapital && (
                      <div className="px-4 py-3 lg:px-6 lg:py-5 bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl lg:rounded-2xl font-black shadow-inner w-full flex items-center justify-center gap-2 text-xs lg:text-base text-center mt-2">
                        <Shield size={18} className="shrink-0" /> الدولة محمية بشكل كامل ضد
                        الاستحلال المباشر بالدبابة
                      </div>
                    )}

                  {/* 5. رسالة حماية العاصمة */}
                  {isProtected &&
                    selectedCountry.owner !== turn &&
                    isOpponentCapital && (
                      <div className="px-4 py-3 lg:px-6 lg:py-5 bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 rounded-xl lg:rounded-2xl font-black shadow-inner w-full flex items-center justify-center gap-2 text-xs lg:text-base text-center mt-2">
                        <Shield size={18} className="shrink-0" /> العاصمة محمية بالدرع ولا
                        يمكن غزوها حالياً
                      </div>
                    )}

                  {/* 6. رسائل دول التحدي والدول المستحلة */}
                  {isChallengeOwned && selectedCountry.owner !== turn && (
                    <div className="px-4 py-3 lg:px-6 lg:py-5 bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-xl lg:rounded-2xl font-black shadow-inner w-full flex items-center justify-center gap-2 text-xs lg:text-base text-center mt-2">
                      <Star size={18} className="shrink-0" /> دولة التحدي غير قابلة للاستحلال
                      أو القصف
                    </div>
                  )}

                  {selectedCountry.isStolen &&
                    selectedCountry.owner !== turn &&
                    !isOpponentCapital && (
                      <div className="px-4 py-3 lg:px-6 lg:py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl lg:rounded-2xl font-black shadow-inner w-full flex items-center justify-center gap-2 text-xs lg:text-base text-center mt-2">
                        <Swords size={18} className="shrink-0" /> الدولة مستحلة أبدياً بالبطاقة
                        ولا يمكن الهجوم عليها
                      </div>
                    )}
                </>
              );
            })()}

            {selectedCountry.owner === turn &&
              !protectedCountries[selectedCountry.id] && (
                <button
                  onClick={useProtectCard}
                  className="px-4 py-3 lg:px-6 lg:py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl lg:rounded-2xl font-black shadow-md w-full flex items-center justify-center gap-2 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-[4px] transition-all text-xs lg:text-lg"
                >
                  <Shield size={18} /> تفعيل بطاقة الحماية (درع دائم)
                </button>
              )}

            <div className="pt-4 lg:pt-6 mt-3 lg:mt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[9px] lg:text-xs font-black text-slate-400 mb-2 lg:mb-3 text-right">
                أدوات الحكم (إدارة الطوارئ):
              </p>
              {forcedWinner ? (
                <div className="col-span-1 sm:col-span-2 p-2 lg:p-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 rounded-xl text-center animate-in fade-in">
                  <p className="text-[10px] lg:text-sm font-black text-emerald-600 dark:text-emerald-400 mb-2">
                    إجبار فوز لـ {forcedWinner === 1 ? team1Name : team2Name}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        if (selectedCountry.isChallenge) {
                          if (forcedWinner === 1)
                            setChallengesUsed1((p: number) => p + 1);
                          else setChallengesUsed2((p: number) => p + 1);
                        }
                        handleCapture(forcedWinner, true);
                      }}
                      className="py-1.5 lg:py-2.5 px-2 flex-1 bg-emerald-500 text-white rounded-lg text-[9px] lg:text-xs font-black"
                    >
                      تأكيد ومتابعة
                    </button>
                    {(() => {
                      const protectCards =
                        forcedWinner === 1 ? cards1.protect : cards2.protect;
                      if (
                        protectCards === 0 ||
                        protectedCountries[selectedCountry.id]
                      )
                        return null;
                      return (
                        <button
                          onClick={() => {
                            if (selectedCountry.isChallenge) {
                              if (forcedWinner === 1)
                                setChallengesUsed1((p: number) => p + 1);
                              else setChallengesUsed2((p: number) => p + 1);
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
                          className="py-1.5 lg:py-2.5 px-2 flex-1 bg-teal-600 text-white rounded-lg text-[9px] lg:text-xs font-black"
                        >
                          تأكيد + حماية
                        </button>
                      );
                    })()}
                    <button
                      onClick={() => setForcedWinner(null)}
                      className="py-1.5 lg:py-2.5 px-4 flex-none bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-[9px] lg:text-xs font-black mt-1 sm:mt-0"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleManualFree}
                    className="col-span-1 sm:col-span-2 py-2 lg:py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                  >
                    سحب وجعلها حرة
                  </button>
                  <button
                    onClick={() => {
                      setForcedWinner(1);
                    }}
                    className="py-2 lg:py-2.5 bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                  >
                    إجبار فوز {team1Name}
                  </button>
                  <button
                    onClick={() => {
                      setForcedWinner(2);
                    }}
                    className="py-2 lg:py-2.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-[10px] lg:text-xs font-bold transition-colors"
                  >
                    إجبار فوز {team2Name}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}