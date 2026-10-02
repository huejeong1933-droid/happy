# 💌 따뜻한 하루 일기 & AI 응원 (Warm Diary)

> Google Gemini API와 Firebase Firestore를 연동한 따뜻한 하루 일기 & AI 마음 비서 웹앱입니다.  
> 오늘 있었던 일과 감정을 기록하면, 다정한 위로의 편지와 내일을 위한 긍정 행동 1가지를 답장해 드립니다.

---

## 🌟 주요 기능
- **4가지 감정 선택**: 기쁨(😊), 지침(🥱), 설렘(💖), 불안(🌧️)
- **Gemini AI 마음 비서**:
  - 다정한 위로와 깊은 공감의 편지 (`comfortMessage`)
  - 내일을 위한 구체적인 작은 긍정 행동 1가지 (`tomorrowAction`) 및 실천 체크 기능
  - 마음을 감싸는 따뜻한 한 줄 명언 (`quote`) & 응원 태그 (`aiCheerTag`)
  - **다정한 목소리로 듣기 (TTS)**: Web Speech API 지원
- **데이터 영구 저장**: Firebase Firestore 및 로컬 캐시 자동 동기화
- **안전한 보안 설계**: API 키 코드 노출 없는 환경 변수 관리

---

## 🚀 Vercel 배포 가이드 (GitHub 연동)

### 1. 깃허브(GitHub)에 업로드하기
터미널에서 아래 명령어로 리포지토리에 푸시합니다:
```bash
git init
git add .
git commit -m "feat: 따뜻한 하루 일기 & AI 응원 웹앱 초기 구성"
git branch -M main
git remote add origin https://github.com/사용자아이디/리포지토리이름.git
git push -u origin main
```
> ※ `.gitignore`에 `.env*`가 포함되어 있어 민감한 비밀키는 깃허브에 커밋되지 않으니 안심하세요.

---

### 2. Vercel에서 배포하기
1. [Vercel](https://vercel.com) 로그인 후 **"Add New..." → "Project"** 클릭
2. 방금 푸시한 깃허브 리포지토리 **Import**
3. 설정 확인:
   - **Framework Preset**: `Vite` (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (기본값)
   - **Output Directory**: `dist` (기본값)

---

### 3. Vercel 환경 변수(Environment Variables) 등록 (★ 필수)
프로젝트 생성 화면의 **Environment Variables** (또는 배포 후 **Settings → Environment Variables**)에서 다음 변수를 추가해주세요:

| Key (환경 변수 이름) | Value (값) | 필수 여부 | 설명 |
|---|---|---|---|
| `GEMINI_API_KEY` | `AIzaSy...` | **필수** | Google AI Studio에서 발급받은 Gemini API 키 |
| `VITE_GEMINI_API_KEY` | `AIzaSy...` | 선택 (권장) | 클라이언트 번들 호출 시 사용할 동일한 API 키 |

> **Firebase 설정**: 기본 설정값(`visit-e95d1`)이 코드 내에 안전하게 폴백으로 연동되어 있어 별도 입력 없이도 동작하지만, 커스텀 설정을 사용하실 경우 `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID` 등을 Vercel 환경 변수로 등록하실 수 있습니다.

4. **[Deploy]** 버튼 클릭! 1~2분 내로 배포가 완료됩니다.

---

## 💻 로컬 개발 환경 실행

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 환경 변수 파일 생성
cp .env.example .env
# .env 파일에 본인의 GEMINI_API_KEY를 입력하세요.

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하시면 됩니다.
