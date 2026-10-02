import React, { useState, useMemo } from 'react';
import type { DiaryEntry, EmotionType } from '../types';
import { EMOTIONS } from '../types';
import {
  Calendar,
  Sparkles,
  Trash2,
  ChevronRight,
  Search,
  CheckCircle2,
  Circle,
  Inbox,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiaryListProps {
  diaries: DiaryEntry[];
  onSelectDiary: (diary: DiaryEntry) => void;
  onDeleteDiary: (id: string) => void;
  onToggleAction: (id: string, completed: boolean) => void;
}

export const DiaryList: React.FC<DiaryListProps> = ({
  diaries,
  onSelectDiary,
  onDeleteDiary,
  onToggleAction,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<EmotionType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDiaries = useMemo(() => {
    return diaries.filter((d) => {
      const matchEmotion = selectedFilter === 'all' || d.emotion === selectedFilter;
      const matchSearch =
        searchQuery.trim() === '' ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.aiResponse?.comfortMessage.toLowerCase().includes(searchQuery.toLowerCase());
      return matchEmotion && matchSearch;
    });
  }, [diaries, selectedFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900 font-serif-warm flex items-center gap-2">
            <span>나의 마음 기록장</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-sans font-semibold">
              {diaries.length}편
            </span>
          </h2>
          <p className="text-xs text-stone-500">
            그동안 차곡차곡 쌓인 마음과 AI 비서의 편지들이에요.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="일기 및 위로 검색..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Emotion filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
          }`}
        >
          전체 보기 ({diaries.length})
        </button>

        {(Object.keys(EMOTIONS) as EmotionType[]).map((type) => {
          const cfg = EMOTIONS[type];
          const count = diaries.filter((d) => d.emotion === type).length;
          const isSelected = selectedFilter === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isSelected
                  ? `${cfg.activeBgColor} ${cfg.textColor} border border-amber-300 font-bold shadow-xs`
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{cfg.emoji}</span>
              <span>{cfg.label}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* List content */}
      {filteredDiaries.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-3xl bg-white border border-dashed border-stone-300/80">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-stone-700 font-serif-warm">
            {diaries.length === 0
              ? '아직 기록된 마음이 없어요.'
              : '조건에 맞는 일기를 찾을 수 없어요.'}
          </p>
          <p className="text-xs text-stone-600 mt-1">
            {diaries.length === 0
              ? '오늘 하루 있었던 일과 감정을 위쪽 입력창에 적어보세요!'
              : '다른 감정 필터나 검색어를 입력해보세요.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredDiaries.map((entry) => {
              const emotionCfg = EMOTIONS[entry.emotion] || EMOTIONS.joy;

              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-amber-200 shadow-xs hover:shadow-sm transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div
                      onClick={() => onSelectDiary(entry)}
                      className="flex-1 cursor-pointer space-y-2"
                    >
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold border ${emotionCfg.badgeClass}`}
                        >
                          <span>{emotionCfg.emoji}</span>
                          <span>{emotionCfg.label}</span>
                        </span>
                        <span className="text-stone-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          {entry.date}
                        </span>
                        {entry.aiResponse?.aiCheerTag && (
                          <span className="text-amber-800 text-[11px] font-medium hidden sm:inline">
                            {entry.aiResponse.aiCheerTag}
                          </span>
                        )}
                      </div>

                      {/* Title & Preview */}
                      <h3 className="font-bold text-stone-900 text-base font-serif-warm group-hover:text-amber-900 transition-colors">
                        {entry.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                        {entry.content}
                      </p>

                      {/* AI Cheer Snippet Preview */}
                      {entry.aiResponse && (
                        <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/50 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-950 font-serif-warm line-clamp-2">
                            "{entry.aiResponse.comfortMessage}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions and Toggle */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      {entry.aiResponse?.tomorrowAction && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAction(entry.id, !entry.completedTomorrowAction);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                            entry.completedTomorrowAction
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-50 text-stone-600 hover:bg-amber-50 border border-stone-200'
                          }`}
                          title="내일 긍정 행동 달성 체크"
                        >
                          {entry.completedTomorrowAction ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-semibold">행동 완료</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5 text-stone-400" />
                              <span>내일 행동</span>
                            </>
                          )}
                        </button>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectDiary(entry)}
                          className="px-2.5 py-1 text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>편지 읽기</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('이 일기를 정말 삭제하시겠어요?')) {
                              onDeleteDiary(entry.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="일기 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
