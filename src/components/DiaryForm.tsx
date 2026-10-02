import React, { useState } from 'react';
import { EmotionSelector } from './EmotionSelector';
import type { EmotionType } from '../types';
import { Sparkles, Calendar, PenLine, Loader2, Lightbulb } from 'lucide-react';

interface DiaryFormProps {
  onSubmit: (params: {
    title: string;
    content: string;
    emotion: EmotionType;
    date: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const INSPIRATION_PROMPTS = [
  '오늘 나를 가장 웃음 짓게 한 순간은 언제였나요?',
  '오늘 마음을 지치게 하거나 신경 쓰였던 일이 있었나요?',
  '오늘 하루 열심히 보낸 나 자신에게 건네고 싶은 말은?',
  '오늘 먹은 맛있는 음식이나 스쳐간 작은 행복이 있나요?',
];

export const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit, isLoading }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [emotion, setEmotion] = useState<EmotionType | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!emotion) {
      setValidationError('오늘의 감정을 4가지 중에서 먼저 선택해주세요.');
      return;
    }

    if (!content.trim()) {
      setValidationError('오늘 있었던 일이나 마음에 남은 생각을 적어주세요.');
      return;
    }

    try {
      await onSubmit({
        title: title.trim() || '오늘의 하루 기록',
        content: content.trim(),
        emotion,
        date,
      });
      // Reset form after successful submission
      setTitle('');
      setContent('');
      setEmotion(null);
    } catch (err: any) {
      setValidationError(err.message || '일기를 전송하는 도중 문제가 생겼습니다.');
    }
  };

  const insertPrompt = (prompt: string) => {
    if (content.length > 0) {
      setContent((prev) => `${prev}\n\n[생각 한 조각] ${prompt}\n`);
    } else {
      setContent(`[생각 한 조각] ${prompt}\n`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <PenLine className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif-warm">
              오늘의 일기 쓰기
            </h2>
            <p className="text-xs text-stone-500">
              오늘의 감정과 소소한 이야기들을 솔직하게 들려주세요.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent border-none text-xs text-stone-800 font-medium focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* 1. Emotion selection */}
      <EmotionSelector
        selectedEmotion={emotion}
        onSelect={(em) => {
          setEmotion(em);
          setValidationError(null);
        }}
      />

      {/* 2. Diary Title */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-stone-300 rounded-full inline-block"></span>
          일기 제목 (선택)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 긴 하루 끝의 따뜻한 샤워, 뜻밖의 좋은 소식"
          className="w-full px-4 py-2.5 rounded-2xl bg-stone-50/70 border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white transition-all placeholder:text-stone-400"
          maxLength={60}
        />
      </div>

      {/* 3. Diary Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
            오늘 있었던 일과 마음
            <span className="text-xs text-rose-500">*</span>
          </label>
          <span className="text-xs text-stone-600">
            {content.length}자
          </span>
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setValidationError(null);
            }}
            rows={6}
            placeholder="오늘 하루 어떤 일들이 있었나요? 기뻤던 일, 지쳤던 일, 속상했던 일, 그냥 스쳐간 생각까지 편하게 털어놓아 보세요. 당신의 AI 비서가 다정하게 들어드릴게요."
            className="w-full p-4 rounded-2xl bg-diary-paper border border-stone-200 text-stone-800 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all font-serif-warm placeholder:text-stone-400 resize-y"
          />
        </div>

        {/* Quick Inspiration prompts */}
        <div className="pt-1">
          <p className="text-xs text-stone-500 flex items-center gap-1 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            무슨 말을 쓸지 고민된다면 눌러보세요:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INSPIRATION_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => insertPrompt(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-600 border border-stone-200/60 transition-colors cursor-pointer"
              >
                + {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Validation or Error Message */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-700">
          ⚠️ {validationError}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-md shadow-amber-200 transition-all cursor-pointer ${
            isLoading
              ? 'bg-amber-300 text-stone-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-600 hover:to-amber-500 text-stone-950 hover:shadow-lg hover:shadow-amber-300 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-stone-800" />
              <span>AI 비서가 따뜻한 위로와 제안을 준비 중이에요...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-950 fill-amber-200" />
              <span>AI 비서에게 일기 보여주기</span>
            </>
          )}
        </button>
        <p className="text-center text-[11px] text-stone-600 mt-2">
          Gemini AI가 당신의 이야기를 조용히 듣고 포근한 위로와 내일을 위한 행동 1가지를 답장해 드려요.
        </p>
      </div>
    </form>
  );
};
