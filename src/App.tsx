import React, { useState, useEffect } from 'react';
import type { DiaryEntry, EmotionType, AiResponse } from './types';
import {
  fetchAllDiaries,
  saveDiaryEntry,
  removeDiaryEntry,
  updateActionCompletion,
} from './lib/firebase';
import { requestAiCheer } from './services/geminiService';
import { Header } from './components/Header';
import { DiaryForm } from './components/DiaryForm';
import { AiCheerCard } from './components/AiCheerCard';
import { DiaryList } from './components/DiaryList';
import { DiaryDetailModal } from './components/DiaryDetailModal';
import { VercelDeployGuideModal } from './components/VercelDeployGuideModal';
import { Heart, Sparkles, Coffee, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Default comforting sample entry so new users immediately see the experience
const SAMPLE_ENTRY: DiaryEntry = {
  id: 'sample-welcome-entry',
  title: '새로운 다이어리를 시작하며',
  content: '오늘 하루도 분주하게 지나갔다. 일도 많았고 신경 쓸 것도 많았지만, 이렇게 조용히 앉아 내 마음을 돌아보는 시간을 가질 수 있어서 다행이다.',
  emotion: 'tired',
  date: new Date().toISOString().split('T')[0],
  createdAt: Date.now() - 3600000,
  aiResponse: {
    comfortMessage: '오늘 하루 정말 애쓰셨어요. 온종일 이리저리 뛰어다니며 당신이 쏟아낸 정성과 노력은 결코 사라지지 않아요. 지금 이 순간만큼은 모든 긴장을 풀고, 따뜻한 이불 속에서 당신만을 위한 포근한 쉼을 누리셨으면 좋겠습니다.',
    tomorrowAction: '내일 아침 눈을 뜨자마자 따뜻한 차나 물 한 잔을 마시며 창밖 풍경 1분간 가만히 바라보기',
    quote: '쉬어가는 것도 걸음의 일부입니다. 당신은 지금 충분히 잘하고 있어요.',
    aiCheerTag: '#오늘도_수고한_너에게',
    createdAt: new Date().toISOString(),
  },
  completedTomorrowAction: false,
};

export default function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [latestResponseInfo, setLatestResponseInfo] = useState<{
    entry: DiaryEntry;
    response: AiResponse;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load diaries on mount
  useEffect(() => {
    async function loadData() {
      try {
        const { diaries: loaded, isFromCloud } = await fetchAllDiaries();
        setIsCloudSynced(isFromCloud);
        if (loaded.length === 0) {
          // Put sample entry so user immediately sees a warm example
          setDiaries([SAMPLE_ENTRY]);
        } else {
          setDiaries(loaded);
        }
      } catch (err) {
        console.warn('Initial load error:', err);
        setDiaries([SAMPLE_ENTRY]);
      }
    }
    loadData();
  }, []);

  // Handle new diary submission
  const handleDiarySubmit = async ({
    title,
    content,
    emotion,
    date,
  }: {
    title: string;
    content: string;
    emotion: EmotionType;
    date: string;
  }) => {
    setIsLoadingAi(true);
    setErrorMessage(null);

    try {
      // 1. Call Gemini AI via server API or client fallback
      const aiResponse = await requestAiCheer({
        title,
        content,
        emotion,
        date,
      });

      // 2. Build new diary entry
      const newEntry: DiaryEntry = {
        id: `diary_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        title,
        content,
        emotion,
        date,
        createdAt: Date.now(),
        aiResponse,
        completedTomorrowAction: false,
      };

      // 3. Save to Firebase and update local state
      await saveDiaryEntry(newEntry);
      setDiaries((prev) => [newEntry, ...prev.filter((d) => d.id !== 'sample-welcome-entry')]);
      setLatestResponseInfo({ entry: newEntry, response: aiResponse });

      // Scroll smoothly to the AI response
      setTimeout(() => {
        const el = document.getElementById('latest-ai-reply');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (err: any) {
      console.error('Error submitting diary:', err);
      setErrorMessage(
        err.message ||
          'AI 응원 메시지를 불러오는 중 문제가 발생했습니다. API 키 설정 상태를 확인해주세요.'
      );
      throw err;
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Delete diary
  const handleDeleteDiary = async (id: string) => {
    await removeDiaryEntry(id);
    setDiaries((prev) => prev.filter((d) => d.id !== id));
    if (latestResponseInfo?.entry.id === id) {
      setLatestResponseInfo(null);
    }
    if (selectedDiary?.id === id) {
      setSelectedDiary(null);
    }
  };

  // Toggle action completion
  const handleToggleAction = async (id: string, completed: boolean) => {
    await updateActionCompletion(id, completed);
    setDiaries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completedTomorrowAction: completed } : d))
    );
    if (latestResponseInfo?.entry.id === id) {
      setLatestResponseInfo((prev) =>
        prev
          ? {
              ...prev,
              entry: { ...prev.entry, completedTomorrowAction: completed },
            }
          : null
      );
    }
    if (selectedDiary?.id === id) {
      setSelectedDiary((prev) =>
        prev ? { ...prev, completedTomorrowAction: completed } : null
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-stone-800 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        diaryCount={diaries.length}
        isCloudSynced={isCloudSynced}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Error notification if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">요청을 처리하지 못했습니다</p>
                <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="text-xs px-2.5 py-1 bg-white border border-rose-300 rounded-lg text-rose-700 hover:bg-rose-100/50 shrink-0 cursor-pointer"
            >
              설정 가이드 보기
            </button>
          </div>
        )}

        {/* Diary Writing Form */}
        <section>
          <DiaryForm onSubmit={handleDiarySubmit} isLoading={isLoadingAi} />
        </section>

        {/* Newly Received AI Response Banner (Smooth entrance) */}
        <AnimatePresence>
          {latestResponseInfo && (
            <motion.section
              id="latest-ai-reply"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-2 pt-2"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  방금 도착한 AI 비서의 응원 편지
                </span>
                <button
                  type="button"
                  onClick={() => setLatestResponseInfo(null)}
                  className="text-xs text-stone-500 hover:text-stone-700 underline"
                >
                  닫기
                </button>
              </div>

              <AiCheerCard
                aiResponse={latestResponseInfo.response}
                dateStr={latestResponseInfo.entry.date}
                tomorrowActionCompleted={latestResponseInfo.entry.completedTomorrowAction}
                onToggleAction={(completed) =>
                  handleToggleAction(latestResponseInfo.entry.id, completed)
                }
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Past Diaries Archive */}
        <section className="pt-4 border-t border-stone-200/80">
          <DiaryList
            diaries={diaries}
            onSelectDiary={(d) => setSelectedDiary(d)}
            onDeleteDiary={handleDeleteDiary}
            onToggleAction={handleToggleAction}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/70 py-8 px-4 mt-12 text-center text-xs text-stone-600 space-y-2">
        <div className="flex items-center justify-center gap-2 text-stone-600 font-serif-warm">
          <Coffee className="w-4 h-4 text-amber-600" />
          <span>따뜻한 하루 일기 & AI 응원 웹앱</span>
        </div>
        <p>
          Google AI Studio & Gemini API 기반의 감성 일기 서비스입니다.
        </p>
        <p className="text-[11px] text-stone-600">
          모든 감정은 존중받아 마땅합니다. 당신의 내일이 오늘보다 조금 더 평온하기를 소망합니다.
        </p>
      </footer>

      {/* Diary Detail Modal */}
      <DiaryDetailModal
        diary={selectedDiary}
        onClose={() => setSelectedDiary(null)}
        onToggleAction={handleToggleAction}
      />

      {/* Vercel & API Key Deployment Guide Modal */}
      <VercelDeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
