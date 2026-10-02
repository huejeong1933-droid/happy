import React from 'react';
import { EMOTIONS, type EmotionType } from '../types';
import { motion } from 'motion/react';

interface EmotionSelectorProps {
  selectedEmotion: EmotionType | null;
  onSelect: (emotion: EmotionType) => void;
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotion,
  onSelect,
}) => {
  const emotionKeys = Object.keys(EMOTIONS) as EmotionType[];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-800 flex items-center gap-1.5">
          <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
          오늘 나의 마음 상태는 어떤가요?
          <span className="text-xs text-rose-500">*</span>
        </label>
        <span className="text-xs text-stone-500">
          하나를 선택해주세요
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {emotionKeys.map((key) => {
          const item = EMOTIONS[key];
          const isSelected = selectedEmotion === key;

          return (
            <motion.button
              key={key}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(key)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `${item.activeBgColor} ${item.borderColor} shadow-sm ring-2 ring-amber-400/50`
                  : 'bg-white border-stone-200/80 hover:border-amber-200 hover:bg-stone-50/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500"></div>
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl filter drop-shadow-xs" role="img" aria-label={item.label}>
                  {item.emoji}
                </span>
                <span className={`font-bold text-base ${isSelected ? item.textColor : 'text-stone-800'}`}>
                  {item.label}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                {item.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
