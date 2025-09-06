# 마음:ON <img src="/public/favicon.svg" width="110" align="left" />

혼자가 아닌, 안전하고 따뜻하게 마음:ON

<br />
<img src="/public/image.png" />

<br />

###

<br/>

## 👨‍👩‍👧 팀원 소개

| [<img src="https://github.com/Dubabbi.png" width="200px">](https://github.com/Dubabbi) | [<img src="https://github.com/choikyungsoo.png" width="200px">](https://github.com/choikyungsoo) | [<img src="https://github.com/JihuN126.png" width="200px">](https://github.com/JihuN126) |
| :------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
|                         [윤소은](https://github.com/Dubabbi)                          |                         [최경수](https://github.com/choikyungsoo)                          |                         [유지훈](https://github.com/JihuN126)                          |

<br>

## 🛠 Tech Stack

| 역할                     | 종류                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Library**              | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)                         |
| **Programming Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)          |
| **Styling**              | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)     |
| **Data Fetching**        | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=react-query&logoColor=white) |
| **Formatting**           | ![Biome](https://img.shields.io/badge/Biome-5A56F7?style=flat&logo=biome&logoColor=white)                         |
| **Package Manager**      | ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)                            |
| **Deployment**           | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)                      |

---

<br>

<details>
<summary><b style="font-size:1.7rem">📁 파일/폴더 컨벤션</b></summary>

- **폴더/파일명**: kebab-case
- **컴포넌트**: PascalCase
- **함수/훅/유틸**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **역할 접미사** 권장: `-page`, `-layout`, `-view`, `-card`, `-modal` …
- **훅 파일명**: `use-*.ts`

> 상세: [`coding.md`](./docs/coding.md), [`file-folder.md`](./docs/file-folder.md)

</details>

<br>

<details>
<summary><b style="font-size:1.7rem">🎨 스타일 가이드</b></summary>

- 전역 기준: `10px = 1rem`
- 전역 스타일 진입점
  - `theme.css` → 컬러/타이포/그라데이션/레이어 토큰
  - `custom-utilities.css` → 자주 쓰는 Tailwind 조합 축약
- Inline style 금지 → 새 유틸 추가 또는 CSS 변수 활용
- **z-index**: 의미 기반 유틸 사용, 임의 숫자 금지
- **단위**: rem 사용 (단, border-radius는 px 유지)

> 상세: [`style-guide.md`](./docs/style-guide.md)

</details>

<br>

<details>
<summary><b style="font-size:1.7rem">📁 절대 경로(alias)</b></summary>

- `@pages` → `src/pages`
- `@styles`, `@components`, `@hooks`, `@libs`, `@constants`, `@utils`, `@apis`, `@assets`, `@types` → `src/shared/*`
- **단일 소스**: `tsconfig.json`의 `paths` 기준, Vite 플러그인으로 동기화

> 상세: [`absolute-paths.md`](./docs/absolute-paths.md)

</details>
