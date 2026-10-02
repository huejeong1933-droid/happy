import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { title, content, emotion, date } = body || {};

    if (!content || !emotion) {
      return res.status(400).json({ error: '일기 내용과 감정을 입력해주세요.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. Vercel 환경 변수 설정을 확인해주세요.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const emotionDescriptions: Record<string, string> = {
      joy: '기쁨 (행복하고 보람차며 에너지가 넘침)',
      tired: '지침 (몸과 마음이 피곤하고 휴식이 절실함)',
      flutter: '설렘 (기대되고 두근거리며 벅찬 감정)',
      anxious: '불안 (걱정되고 초조하며 마음이 무거움)',
    };

    const emotionDesc = emotionDescriptions[emotion] || emotion;

    const prompt = `사용자가 오늘 하루 일기와 감정을 기록했습니다.
- 일기 날짜: ${date || '오늘'}
- 일기 제목: ${title || '오늘의 하루'}
- 사용자의 감정: ${emotionDesc}
- 일기 본문:
${content}

당신은 사용자의 마음을 가장 따뜻하게 감싸안아주는 '마음 비서'입니다.
다음 지침에 맞춰 정성스럽고 진심 어린 한국어 답변을 JSON 형식으로 작성해주세요:

1. comfortMessage (다정한 위로와 공감):
   - 사용자가 작성한 일기 내용의 구체적인 상황을 언급하며 그 마음을 진심으로 알아주고 공감해주세요.
   - 지친 감정이나 불안한 감정에는 "충분히 잘해왔다", "오늘 하루 버텨낸 것만으로도 대단하다"는 깊은 다정함을 전해주세요.
   - 기쁨이나 설레는 감정에는 그 기쁨을 진심으로 함께 축하하고 마음에 오래 간직할 수 있도록 따뜻하게 지지해주세요.
   - 친절하고 포근한 존댓말(해요체, 습니다체)로 3~5문장 분량으로 작성하세요.

2. tomorrowAction (내일을 위한 긍정적인 행동 1가지 제안):
   - 내일 부담 없이 1~5분 이내로 가볍게 실천할 수 있는 구체적이고 긍정적인 행동 1가지를 제안하세요.
   - 예시: "내일 아침 따뜻한 물 한 잔 천천히 마시며 창밖 구름 보기", "출근길 내가 좋아하는 노래 1곡에만 온전히 집중하기", "잠들기 전 오늘 나에게 잘했다고 속삭여주기" 등.

3. quote (마음에 남는 따뜻한 한 줄):
   - 오늘 밤의 마무리를 편안하게 해주는 시적인 따뜻한 문장 또는 명언.

4. aiCheerTag (응원 해시태그):
   - 사용자의 상황에 꼭 맞는 위로의 해시태그 (예: "#수고했어_오늘도", "#너의_속도대로_가도돼", "#눈부신_오늘의_기쁨")
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '당신은 사용자의 일기를 읽고 따뜻한 온기와 지혜로운 격려를 건네는 다정한 AI 마음 비서입니다. 답변은 항상 자연스러운 한국어와 온기 있는 어조로 작성합니다.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            comfortMessage: {
              type: Type.STRING,
              description: '사용자의 감정을 다정하게 위로하고 깊이 공감하는 따뜻한 편지 (3~5문장)',
            },
            tomorrowAction: {
              type: Type.STRING,
              description: '내일을 위한 1가지 구체적이고 실천하기 쉬운 작은 긍정 행동',
            },
            quote: {
              type: Type.STRING,
              description: '마음에 위로를 주는 따뜻한 한 줄 문장',
            },
            aiCheerTag: {
              type: Type.STRING,
              description: '응원 해시태그',
            },
          },
          required: ['comfortMessage', 'tomorrowAction', 'quote', 'aiCheerTag'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini API 응답을 받지 못했습니다.');
    }

    const data = JSON.parse(responseText);
    return res.status(200).json({
      success: true,
      comfortMessage: data.comfortMessage,
      tomorrowAction: data.tomorrowAction,
      quote: data.quote,
      aiCheerTag: data.aiCheerTag,
      createdAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.status(500).json({
      error: error.message || 'AI 응원 메시지 생성 중 오류가 발생했습니다.',
    });
  }
}
