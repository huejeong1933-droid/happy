import React from 'react';
import type { DiaryEntry } from '../types';
import { EMOTIONS } from '../types';
import { AiCheerCard } from './AiCheerCard';
import { X, Calendar, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiaryDetailModalProps {
  diary: DiaryEntry | null;
  onClose: () => void;
  onToggleAction: (id: string, completed: boolean) => void;
}

export const DiaryDetailModal: React.FC<DiaryDetailModalProps> = ({
  diary,
  onClose,
  onToggleAction,
}) => {
  if (!diary) return null;

  const emotionCfg = EMOTIONS[diary.emotion] || EMOTIONS.joy;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/40 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#FFFDF8] rounded-3xl border border-amber-200/80 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200/70 flex items-center justify-between bg-white/80">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${emotionCfg.badgeClass}`}>
                {emotionCfg.emoji} {emotionCfg.label}
              </span>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {diary.date}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {/* User Diary Section */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                내가 쓴 일기
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif-warm">
                {diary.title}
              </h2>
              <div className="p-3.5 rounded-xl bg-diary-paper border border-stone-100 font-serif-warm text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {diary.content}
              </div>
            </div>

            {/* AI Cheer Letter */}
            {diary.aiResponse && (
              <div className="space-y-2">
                <AiCheerCard
                  aiResponse={diary.aiResponse}
                  dateStr={diary.date}
                  tomorrowActionCompleted={diary.completedTomorrowAction}
                  onToggleAction={(completed) => onToggleAction(diary.id, completed)}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200/70 bg-stone-50/80 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
