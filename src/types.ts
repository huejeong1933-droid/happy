export type EmotionType = 'joy' | 'tired' | 'flutter' | 'anxious';

export interface EmotionConfig {
  type: EmotionType;
  label: string;
  emoji: string;
  description: string;
  bgColor: string;
  activeBgColor: string;
  borderColor: string;
  textColor: string;
  badgeClass: string;
  accentColor: string;
}

export const EMOTIONS: Record<EmotionType, EmotionConfig> = {
  joy: {
    type: 'joy',
    label: '기쁨',
    emoji: '😊',
    description: '행복하고 보람찬 하루였어요',
    bgColor: 'bg-amber-50',
    activeBgColor: 'bg-amber-100/80',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-800',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    accentColor: '#F59E0B',
  },
  tired: {
    type: 'tired',
    label: '지침',
    emoji: '🥱',
    description: '몸도 마음도 쉬어가고 싶어요',
    bgColor: 'bg-slate-50',
    activeBgColor: 'bg-slate-200/70',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-800',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    accentColor: '#64748B',
  },
  flutter: {
    type: 'flutter',
    label: '설렘',
    emoji: '💖',
    description: '가슴이 두근거리고 기대돼요',
    bgColor: 'bg-rose-50',
    activeBgColor: 'bg-rose-100/80',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-800',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    accentColor: '#F43F5E',
  },
  anxious: {
    type: 'anxious',
    label: '불안',
    emoji: '🌧️',
    description: '생각이 많고 마음이 무거워요',
    bgColor: 'bg-indigo-50',
    activeBgColor: 'bg-indigo-100/80',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-800',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    accentColor: '#6366F1',
  },
};

export interface AiResponse {
  comfortMessage: string;
  tomorrowAction: string;
  quote: string;
  aiCheerTag: string;
  createdAt: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  emotion: EmotionType;
  date: string;
  createdAt: number;
  aiResponse?: AiResponse;
  completedTomorrowAction?: boolean;
}
