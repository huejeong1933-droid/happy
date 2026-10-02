import React, { useState } from 'react';
import { Sparkles, Heart, CloudCheck, Cloud, HelpCircle } from 'lucide-react';

interface HeaderProps {
  diaryCount: number;
  isCloudSynced: boolean;
  onOpenDeployGuide: () => void;
}

const DAILY_AFFIRMATIONS = [
  "흘러간 하루에 후회 대신 포근한 위로를, 다가올 내일엔 작은 설렘을.",
  "오늘도 수고 많았어요. 당신이 버텨낸 오늘 하루는 그 자체로 눈부셔요.",
  "잠시 쉬어가도 괜찮아요. 천천히 걸어도 우리는 분명 나아가고 있으니까요.",
  "나의 감정은 어떤 모습이든 소중해요. 있는 그대로 안아주세요.",
  "내일은 오늘보다 한 뼘 더 다정한 바람이 당신을 찾아올 거예요.",
];

export const Header: React.FC<HeaderProps> = ({
  diaryCount,
  isCloudSynced,
  onOpenDeployGuide,
}) => {
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const cycleAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % DAILY_AFFIRMATIONS.length);
  };

  return (
    <header className="border-b border-amber-100 bg-[#FFFDF8]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-200 flex items-center justify-center shadow-sm shadow-amber-200/50">
              <Heart className="w-6 h-6 text-white fill-white/80" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif-warm">
                  따뜻한 하루 일기
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium border border-amber-200">
                  AI 응원 비서
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                오늘 하루도 참 고생 많았어요. 당신의 마음을 들려주세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                isCloudSynced
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={
                isCloudSynced
                  ? 'Firebase Firestore에 안전하게 연결되었습니다'
                  : '로컬 스토리지에 저장 중입니다'
              }
            >
              {isCloudSynced ? (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Firebase 동기화됨</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-amber-600" />
                  <span>기기 보관함 연동</span>
                </>
              )}
            </div>

            <button
              onClick={onOpenDeployGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200/70 transition-all hover:shadow-xs cursor-pointer"
              title="Vercel 및 API 키 환경 변수 안내"
            >
              <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline">환경 변수 설정 안내</span>
              <span className="md:hidden">가이드</span>
            </button>
          </div>
        </div>

        {/* Daily Warm Affirmation */}
        <div
          onClick={cycleAffirmation}
          className="mt-3.5 px-4 py-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 cursor-pointer hover:bg-amber-50 transition-all group"
          title="클릭하면 다른 따뜻한 한 줄을 볼 수 있어요"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 group-hover:rotate-12 transition-transform" />
            <p className="font-serif-warm truncate">
              {DAILY_AFFIRMATIONS[affirmationIndex]}
            </p>
          </div>
          <span className="text-[11px] text-amber-700/70 shrink-0 underline decoration-amber-300">
            다른 글귀 보기
          </span>
        </div>
      </div>
    </header>
  );
};
