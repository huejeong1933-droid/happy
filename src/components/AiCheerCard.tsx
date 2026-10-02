import React, { useState, useEffect } from 'react';
import type { AiResponse } from '../types';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Calendar,
  Gift,
  Quote,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiCheerCardProps {
  aiResponse: AiResponse;
  dateStr?: string;
  tomorrowActionCompleted?: boolean;
  onToggleAction?: (completed: boolean) => void;
  compact?: boolean;
}

export const AiCheerCard: React.FC<AiCheerCardProps> = ({
  aiResponse,
  dateStr,
  tomorrowActionCompleted = false,
  onToggleAction,
  compact = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCompleted, setIsCompleted] = useState(tomorrowActionCompleted);

  useEffect(() => {
    setIsCompleted(tomorrowActionCompleted);
  }, [tomorrowActionCompleted]);

  // Korean Text-to-Speech (TTS) using Web Speech API
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('현재 브라우저에서는 음성 읽기 기능을 지원하지 않습니다.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${aiResponse.comfortMessage}. 내일을 위한 제안: ${aiResponse.tomorrowAction}. 오늘의 한 줄: ${aiResponse.quote}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.92; // Calm, gentle pace
    utterance.pitch = 1.05; // Friendly tone

    // Try finding Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koreanVoice = voices.find((v) => v.lang.startsWith('ko'));
    if (koreanVoice) {
      utterance.voice = koreanVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopy = async () => {
    const text = `💌 [따뜻한 하루 일기 & AI 응원]\n\n"${aiResponse.comfortMessage}"\n\n🎁 내일을 위한 작은 행동:\n${aiResponse.tomorrowAction}\n\n🌟 따뜻한 한 줄:\n"${aiResponse.quote}"\n\n${aiResponse.aiCheerTag}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handleCheckboxToggle = () => {
    const nextVal = !isCompleted;
    setIsCompleted(nextVal);
    onToggleAction?.(nextVal);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-3xl border border-amber-200/90 bg-gradient-to-b from-[#FFFDF7] via-[#FFFBF2] to-[#FFF9EC] shadow-sm relative overflow-hidden ${
        compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'
      }`}
    >
      {/* Top ambient glow decoration */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-200/30 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-rose-200/30 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header bar of the letter */}
      <div className="flex items-center justify-between gap-3 pb-3.5 mb-4 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Sparkles className="w-4 h-4 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-base sm:text-lg font-serif-warm">
                다정한 AI 비서의 편지
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100/90 text-amber-900 font-semibold border border-amber-200">
                {aiResponse.aiCheerTag}
              </span>
            </div>
            {dateStr && (
              <span className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                {dateStr}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons: Audio & Copy */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs animate-pulse'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-amber-50 hover:border-amber-300'
            }`}
            title={isPlayingAudio ? '낭독 정지' : '다정한 음성으로 듣기'}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">멈춤</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">소리로 듣기</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer flex items-center gap-1 text-xs"
            title="편지 복사하기"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline text-emerald-600">복사됨!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span className="hidden sm:inline">복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Comfort Message */}
      <div className="space-y-4">
        <div className="relative pl-3 border-l-2 border-amber-400">
          <p className="text-stone-800 text-base sm:text-lg leading-relaxed font-serif-warm whitespace-pre-wrap">
            {aiResponse.comfortMessage}
          </p>
        </div>

        {/* Tomorrow's Action Card */}
        <div className="p-4 rounded-2xl bg-white/90 border border-amber-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              내일을 위한 긍정 행동 1가지
            </span>
            <span className="text-[11px] text-stone-500">
              {isCompleted ? '달성 완료 🎉' : '내일 실천해보기'}
            </span>
          </div>

          <div
            onClick={handleCheckboxToggle}
            className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
              isCompleted
                ? 'bg-emerald-50/70 border border-emerald-200 text-stone-600'
                : 'hover:bg-amber-50/60 border border-transparent'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-600 text-white'
                  : 'bg-white border-stone-300 hover:border-amber-400'
              }`}
            >
              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <p
              className={`text-sm sm:text-base font-medium leading-snug ${
                isCompleted
                  ? 'line-through text-stone-500'
                  : 'text-stone-800'
              }`}
            >
              {aiResponse.tomorrowAction}
            </p>
          </div>
        </div>

        {/* Warm Quote Ribbon */}
        {aiResponse.quote && (
          <div className="p-3.5 rounded-2xl bg-amber-100/50 border border-amber-200/60 flex items-start gap-2.5">
            <Quote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 opacity-80" />
            <p className="text-xs sm:text-sm font-serif-warm text-amber-950 italic">
              "{aiResponse.quote}"
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
