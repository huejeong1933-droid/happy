import type { EmotionType, AiResponse } from '../types';

export interface RequestCheerParams {
  title: string;
  content: string;
  emotion: EmotionType;
  date: string;
}

export async function requestAiCheer(params: RequestCheerParams): Promise<AiResponse> {
  // 1. First attempt: call the secure server-side /api/cheer endpoint
  try {
    const res = await fetch('/api/cheer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        comfortMessage: data.comfortMessage,
        tomorrowAction: data.tomorrowAction,
        quote: data.quote,
        aiCheerTag: data.aiCheerTag,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    } else {
      const errJson = await res.json().catch(() => null);
      if (errJson && errJson.error) {
        // If server responded with an error, check if client fallback is possible
        if (!import.meta.env.VITE_GEMINI_API_KEY) {
          throw new Error(errJson.error);
        }
      }
    }
  } catch (err: any) {
    // If not client fallback available, throw the error
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error(
        err.message || '서버 통신 중 문제가 발생했습니다. GEMINI_API_KEY 환경 변수가 설정되어 있는지 확인해주세요.'
      );
    }
  }

  // 2. Client fallback (e.g. static Vite hosting on Vercel with VITE_GEMINI_API_KEY)
  const clientKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!clientKey) {
    throw new Error(
      'Gemini API 키가 설정되지 않았습니다. Vercel 환경 변수나 .env 파일에 GEMINI_API_KEY 또는 VITE_GEMINI_API_KEY를 입력해주세요.'
    );
  }

  const { GoogleGenAI, Type } = await import('@google/genai');
  const ai = new GoogleGenAI({
    apiKey: clientKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const emotionDescriptions: Record<EmotionType, string> = {
    joy: '기쁨 (행복하고 보람차며 에너지가 넘침)',
    tired: '지침 (몸과 마음이 피곤하고 휴식이 절실함)',
    flutter: '설렘 (기대되고 두근거리며 벅찬 감정)',
    anxious: '불안 (걱정되고 초조하며 마음이 무거움)',
  };

  const prompt = `사용자가 오늘 하루 일기와 감정을 기록했습니다.
- 일기 날짜: ${params.date || '오늘'}
- 일기 제목: ${params.title || '오늘의 하루'}
- 사용자의 감정: ${emotionDescriptions[params.emotion]}
- 일기 본문:
${params.content}

당신은 사용자의 마음을 가장 따뜻하게 감싸안아주는 '마음 비서'입니다.
다음 지침에 맞춰 한국어 정성 어린 답변을 작성해주세요:
1. comfortMessage: 일기 내용을 바탕으로 한 다정한 위로와 공감 (3~5문장의 따뜻한 존댓말 편지)
2. tomorrowAction: 내일을 위한 1가지 가볍고 구체적인 작은 긍정 행동 제안
3. quote: 마음을 포근하게 해주는 따뜻한 한 줄 문장
4. aiCheerTag: 감정을 토닥여주는 따뜻한 해시태그
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: '당신은 사용자의 일기를 읽고 따뜻한 위로와 지혜로운 격려를 건네는 다정한 한국어 AI 마음 비서입니다.',
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          comfortMessage: { type: Type.STRING },
          tomorrowAction: { type: Type.STRING },
          quote: { type: Type.STRING },
          aiCheerTag: { type: Type.STRING },
        },
        required: ['comfortMessage', 'tomorrowAction', 'quote', 'aiCheerTag'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error('Gemini API로부터 응답을 받지 못했습니다.');
  }

  const parsed = JSON.parse(text);
  return {
    comfortMessage: parsed.comfortMessage,
    tomorrowAction: parsed.tomorrowAction,
    quote: parsed.quote,
    aiCheerTag: parsed.aiCheerTag,
    createdAt: new Date().toISOString(),
  };
}
