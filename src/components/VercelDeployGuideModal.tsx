import React, { useState } from 'react';
import { X, ShieldCheck, Key, Terminal, ExternalLink, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VercelDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<VercelDeployGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  API 키 보안 & Vercel 배포 가이드
                </h3>
                <p className="text-xs text-stone-500">
                  코드 노출 없는 안전한 환경 변수 관리
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-stone-700 leading-relaxed">
            {/* Security Guarantee Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                보안 안전 설계 완료
              </div>
              <p className="text-xs text-emerald-800">
                Gemini API 키는 소스 코드에 절대 직접 하드코딩되지 않으며, 서버 및 런타임 환경 변수(<code className="bg-emerald-100/80 px-1 py-0.5 rounded font-mono text-[11px]">process.env.GEMINI_API_KEY</code> 또는 <code className="bg-emerald-100/80 px-1 py-0.5 rounded font-mono text-[11px]">VITE_GEMINI_API_KEY</code>)에서만 동적으로 읽어옵니다.
              </p>
            </div>

            {/* 1. Vercel 배포 환경 변수 설정 */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">1</span>
                Vercel 프로젝트 환경 변수 설정 방법
              </h4>
              <p className="text-stone-600 text-xs">
                Vercel 대시보드에서 <strong>Project Settings → Environment Variables</strong>로 이동한 후 아래 변수를 추가하세요:
              </p>
              
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 font-bold">GEMINI_API_KEY</span>
                    <span className="text-stone-400"> = </span>
                    <span className="text-stone-300">내_구글_제미나이_API키</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('GEMINI_API_KEY', 'v1')}
                    className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
                  >
                    {copiedKey === 'v1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 font-bold">VITE_GEMINI_API_KEY</span>
                    <span className="text-stone-400"> = </span>
                    <span className="text-stone-300">내_구글_제미나이_API키</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('VITE_GEMINI_API_KEY', 'v2')}
                    className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white"
                  >
                    {copiedKey === 'v2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. 로컬 테스트 .env.example */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">2</span>
                로컬 개발 시 (.env 설정)
              </h4>
              <p className="text-stone-600 text-xs">
                프로젝트 루트에 <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">.env.example</code> 파일이 준비되어 있습니다. 이를 복사하여 <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">.env</code> 파일을 만들고 본인의 API 키를 입력하면 즉시 로컬에서 동작합니다.
              </p>
              <pre className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-[11px] font-mono text-stone-800 overflow-x-auto">
{`# .env 파일 예시
GEMINI_API_KEY="AIzaSy..."
VITE_GEMINI_API_KEY="AIzaSy..."`}
              </pre>
            </div>

            {/* 3. Firebase Firestore */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 flex items-center gap-1.5 text-sm">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center text-[10px]">3</span>
                Firebase Firestore 데이터베이스 연동
              </h4>
              <p className="text-stone-600 text-xs">
                제공해주신 Firebase 설정(<code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">visit-e95d1</code>)이 <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-[11px]">src/lib/firebase.ts</code>에 안전하게 연동되어 일기가 클라우드에 영구 보관되며, 오프라인이나 네트워크 단절 시에도 로컬 캐시로 자동 백업됩니다.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-stone-200/80 bg-stone-50/70 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
            >
              확인 완료
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
