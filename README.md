# 🎨 Modern Developer Portfolio

**HeroUI(NextUI)와 Supabase로 구축한 CMS 기능이 포함된 모던 포트폴리오 사이트입니다.**  
Next.js 15의 최신 기능(App Router)을 활용하여 빠르고 반응형에 최적화된 웹사이트를 구현했습니다.

![Project Preview](https://github.com/shadcn.png) <!-- 나중에 실제 스크린샷으로 교체하세요 -->

---

## 🚀 주요 기능 (Key Features)

### 1. 🎨 **사용자 경험 중심의 디자인 (UI/UX)**
- **HeroUI (NextUI) v2:** 애플(Apple) 스타일의 Glassmorphism 효과와 부드러운 애니메이션 적용.
- **반응형 디자인:** 모바일, 태블릿, 데스크탑 등 모든 디바이스 완벽 지원.
- **인터랙티브 컴포넌트:** 호버 효과, 모달 팝업, 스티키 네비게이션 바.

### 2. 🛠️ **관리자 대시보드 (CMS)**
- **사이트 설정 관리:** 코드 수정 없이 관리자 페이지에서 `메인 타이틀`, `소개글`, `프로필 사진` 등을 실시간 변경 가능.
- **프로젝트 관리:** 포트폴리오 프로젝트 추가/수정/삭제 기능.
- **파일 매니저:** 각 프로젝트에 PPT, PDF, 소스코드 등 관련 파일을 드래그 앤 드롭으로 업로드 및 관리.

### 3. 🔐 **보안 및 인증**
- **Supabase Auth:** 관리자 전용 로그인 시스템 구축.
- **RLS (Row Level Security):** 데이터베이스 수준에서 권한 관리 (관리자만 쓰기 가능).

---

## 🛠️ 기술 스택 (Tech Stack)

| 분류 | 기술 |
| :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Library** | [HeroUI (NextUI)](https://heroui.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [Supabase (PostgreSQL)](https://supabase.com/) |
| **Storage** | Supabase Storage (File Upload) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📂 프로젝트 구조 (Directory Structure)

```bash
├── app/
│   ├── dashboard/       # 관리자 대시보드 (CMS)
│   ├── login/           # 관리자 로그인 페이지
│   ├── projects/[id]/   # 프로젝트 상세 페이지 (Dynamic Route)
│   ├── layout.tsx       # 전체 레이아웃 (Providers 포함)
│   └── page.tsx         # 메인 페이지 (랜딩 페이지)
├── components/          # 재사용 가능한 UI 컴포넌트
├── lib/
│   └── supabase.ts      # Supabase 클라이언트 설정
├── public/              # 정적 파일 (이미지, 아이콘)
└── tailwind.config.ts   # Tailwind & HeroUI 설정
```

---

## 🚀 설치 및 실행 (Getting Started)

### 1. 레포지토리 클론
```bash
git clone https://github.com/DoobaiCookie/my-portfolio.git
cd my-portfolio
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
최상위 경로에 `.env.local` 파일을 생성하고 Supabase 정보를 입력하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 로컬 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

---

## 📝 라이선스 (License)

This project is open source and available under the [MIT License](LICENSE).

---

Designed & Developed by **JHJ**
