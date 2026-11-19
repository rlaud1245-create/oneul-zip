# 오늘.zip

> 오늘의 고민을 압축하다

오늘 뭐 먹을지, 뭐 할지 고민될 때 몇 번의 클릭으로 결정을 도와주는 모바일 중심 웹서비스입니다.

## 기능

| 경로 | 기능 |
| --- | --- |
| `/` | 메인. 기능 카드 3개, 매일 바뀌는 오늘의 추천(메뉴·활동·밸런스 게임) |
| `/food` | 오늘 뭐 먹지? 메뉴 67개, 음식 종류·상황·가격대 조건 추천 |
| `/activity` | 오늘 뭐 하지? 활동 55개, 동행·기분·시간·예산 조건 추천 |
| `/balance` | 오늘의 선택. 질문 102개, 날짜별 밸런스 게임과 지난 7일 질문 |
| `/saved` | 저장한 결과 (localStorage) |
| `/about`, `/privacy` | 서비스 소개, 개인정보처리방침 |

- 회원가입 없음. 모든 개인 데이터는 브라우저 localStorage에만 저장
- 결과 공유: Web Share API, 미지원 시 링크 복사. `/food?id=...` 링크로 같은 결과 재현
- 최근 추천 5개는 다시 나오지 않도록 제외
- 조건에 맞는 결과가 없으면 어떤 조건을 빼면 되는지 안내
- 날짜 기반 콘텐츠는 한국 시간(Asia/Seoul) 기준. 서버에서 날짜를 계산해 내려주므로 hydration 불일치 없음
- SEO: 페이지별 메타데이터, Open Graph, canonical, sitemap.xml, robots.txt

## 로컬 실행

Node.js 20.9 이상이 필요합니다.

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열고, 휴대폰으로 확인하려면 같은 와이파이에서 `http://PC의IP:3000`으로 접속하세요.

## 검사 및 빌드

```bash
npm run build       # 타입 검사 포함 프로덕션 빌드
npm run lint        # ESLint
npm run typecheck   # tsc (build 또는 dev를 한 번 실행한 뒤)
npm start           # 빌드 결과 실행
```

## 배포 (Cloudflare Workers, 무료)

OpenNext 어댑터(`@opennextjs/cloudflare`)로 Cloudflare Workers에 올립니다. 무료 플랜에서도 광고 등 상업적 사용이 가능합니다.

1. 처음 한 번 패키지 설치: `npm i @opennextjs/cloudflare@latest` 와 `npm i -D wrangler@latest`
2. GitHub에 저장소를 올립니다.
3. Cloudflare 대시보드 → Workers & Pages → Create → Import a repository 로 저장소를 연결합니다.
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx opennextjs-cloudflare deploy`
4. Settings → Build → Variables and secrets 에 `NEXT_PUBLIC_SITE_URL`(예: `https://oneul-zip.<계정>.workers.dev`)을 넣고 다시 배포합니다.
5. 배포 후 Google Search Console과 네이버 서치어드바이저에 `/sitemap.xml`을 등록합니다.

로컬에서 Workers 환경으로 확인: `npm run preview` (Windows는 WSL 권장)

## 폴더 구조

```
src/
├─ app/              라우트 (page, layout, sitemap, robots, icon)
├─ components/       공용 UI (Header, ChipGroup, ResultCard, ShareButton ...)
├─ features/
│  ├─ food/          FoodPicker
│  ├─ activity/      ActivityPicker
│  └─ balance/       BalanceGame, daily(날짜별 질문), voteStore(투표 저장소)
├─ data/             foods, activities, balance (정적 데이터)
├─ hooks/            useLocalStorage, useRecommender, useSaved
├─ lib/              추천 엔진, KST 날짜, 시드 랜덤, 공유, 라벨
└─ types/
```

## 데이터 추가하기

- 메뉴: `src/data/foods.ts`의 `rows`에 한 줄 추가
- 활동: `src/data/activities.ts`의 `rows`에 한 줄 추가
- 밸런스 게임: `src/data/balance.ts` **맨 뒤에만** 추가하세요. 질문 id가 순서로 매겨지기 때문입니다.

## 확장 포인트

- **전체 투표 집계**: `src/features/balance/voteStore.ts`에 Supabase 구현을 만들고 `voteStore`만 교체하면 됩니다. 집계가 없을 때는 `getStats`가 `null`을 반환하며, 임의의 수치를 표시하지 않습니다.
- **광고**: `<AdSlot />` 자리가 메인·결과 하단에 있습니다. 실제 광고 코드를 연결한 뒤 `NEXT_PUBLIC_ADS_ENABLED=true`로 켜세요.
- **스폰서 추천**: 데이터에 `sponsored: { label, url }` 필드를 넣으면 결과 카드에 '광고' 표시가 자동으로 붙습니다.
