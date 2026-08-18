# Code Conventions & Design Guidelines

## 1. Naming & File Conventions
- **Topic Objects**: Named uppercase prefixed with `TOPIC_` (e.g., `TOPIC_COMPLEXITY`, `TOPIC_ERRORS`, `TOPIC_GCD`).
- **Topic Files**: Named with lowercase short descriptor matching `id` in `js/topics/dayX/<topicId>.js`.
- **Global Variables / Configs**: Defined with `UPPER_SNAKE_CASE` (e.g. `DAYS`, `BATCH_SLUG`).
- **DOM Element Selectors**: Prefixed with topic ID for scoping (e.g. `#ctrl-gcd`, `#stage-kadane`, `#vars-majority`, `#panel-errors-verdicts`).

## 2. DOM & CSS Architecture
- **CSS Variables**: Global tokens defined in `:root` (e.g., `--bg`, `--panel`, `--stage`, `--yellow`, `--teal`, `--coral`, `--blue`, `--chalk`, `--muted`, `--border`).
- **Scoped Stage Containers**: Every topic renders inside a `.stage` with `#stage-${id}`.
- **Micro-Animations**:
  - Hover states use `translateY(-2px)` and subtle box-shadows (`box-shadow: 0 6px 18px rgba(0,0,0,0.35)`).
  - Transitions standardize on `all 0.2s ease` or `all 0.15s ease`.

## 3. Practice Panel Conventions
- **Batch Exclusive Badging**: Always include `isBatch: true` and specify the exact `track` slug (e.g. `track: 'mathematics-siddhartha'`).
- **Link Builder**: Always use `batchProblem(trackSlug, problemSlug)` or pass `slug` and `track` to `practiceHTML`.
- **Difficulty Tagging**: Use standard ratings (`basic`, `easy`, `medium`, `hard`).

## 4. Code Highlighting Conventions
- All C++ code in tabs must be rendered using `highlightCpp(code)` inside a `<pre class="vscode-theme"><code>...</code></pre>`.
- Header bar above code blocks must use `.code-header` with `.code-lang-tag` and `.copy-btn`.
