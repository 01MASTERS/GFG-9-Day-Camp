# Tech Stack & Runtime Environment

## Core Technology Stack
- **Architecture**: Single-page, client-side dynamic Web Application (Vanilla HTML5, Vanilla ES6+ JavaScript, Vanilla Modern CSS3).
- **No Heavy Framework Overhead**: Built with zero bundling step (no Webpack, Vite, or Next.js required for runtime), providing instant load times, seamless offline file execution (`file:///`), and transparent DOM inspection.
- **Styling Architecture**: Custom CSS design system with CSS custom properties (variables), responsive CSS Grid, Flexbox, glassmorphism panel styling, VS Code Dark+ syntax theme, and custom animations.
- **Font Stack**: Google Fonts (`Syne:wght@700;800`, `Plus Jakarta Sans:wght@400;500;600;700`, `JetBrains Mono:wght@400;500;600`).

## External CDN Integrations & Tooling
- **Agentation**: `v3+` visual feedback and AI annotation interface loaded via `https://esm.sh/agentation@3.0.0-beta.9` and React 18 (`https://esm.sh/react@18.3.1`, `https://esm.sh/react-dom@18.3.1/client`).
- **GeeksforGeeks API**: Direct linking and problem integration with GFG Practice Batch API (`dsa-training-siddhartha-academy`).

## Local Development & Runtimes
- **Browser Compatibility**: Modern Evergreen browsers (Chrome, Edge, Firefox, Safari).
- **Execution**: Can run directly by opening `index.html` or through any static HTTP server (e.g., `python -m http.server`, `npx serve`, Live Server).
- **Data Persistence**: Local syllabus schema (`js/days.js`) and curated problem cache (`data/siddhartha_batch_problems.json`).
