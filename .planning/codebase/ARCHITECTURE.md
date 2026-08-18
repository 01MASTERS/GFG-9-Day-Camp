# Architecture & Design Patterns

## Architectural Overview
The codebase follows a **Modular Component & Registry Pattern** designed for scalability across a 9-Day Data Structures & Algorithms curriculum.

```
┌────────────────────────────────────────────────────────┐
│                      index.html                        │
│             (Host Container & Asset Loader)            │
└──────────────────────────┬─────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌───────────────┐                     ┌───────────────┐
│ js/utils.js   │                     │  DAYS Schema  │
│ (UI Engine)   │                     │ (js/days.js)  │
└───────┬───────┘                     └───────┬───────┘
        │                                     │
        │   ┌─────────────────────────────┐   │
        └──►│ Topic Modules (js/topics/*) │◄──┘
            │  - mount(root) Lifecycle    │
            │  - Step Player Animation    │
            │  - Live State Trackers      │
            │  - Tabs (Code, Practice)    │
            └──────────────┬──────────────┘
                           │
                           ▼
            ┌─────────────────────────────┐
            │  Main Application Bootstrap │
            │        (js/app.js)          │
            │  - Sidebar Navigation       │
            │  - Day/Topic Routing        │
            │  - Active State Persistence │
            └─────────────────────────────┘
```

## Core Patterns

### 1. Topic Module Contract (`TOPIC_*`)
Every algorithm visualizer implements a standardized topic contract:
```javascript
{
  id: string,              // Unique identifier (e.g. 'complexity', 'kadane', 'gcd')
  num: string,             // Display index (e.g. '01', '02', '03')
  title: string,           // Human-readable title
  tag: string,             // Category tag (e.g. 'Math', 'Arrays', 'Debugging')
  intuition: string,       // Concise core intuition / one-line explanation
  time: string,            // Big-O Time complexity chip
  space: string,           // Big-O Space complexity chip
  mount(root): void        // Lifecycle hook to render DOM, wire events, and build step player
}
```

### 2. Standardized UI Shell (`baseTopicShell`)
Each topic mounts into a consistent container structure providing:
- Title, intuition paragraph, and complexity tags
- Custom interactive controls container (`#ctrl-{id}`)
- Step animation player mount point (`#player-mount-{id}`)
- Stage canvas / visualization arena (`#stage-{id}`)
- Step description banner (`#desc-{id}`)
- Variable state tracker (`#vars-{id}`)
- Multi-tab deck (`#tabs-{id}`) containing Pseudocode, C++ Solution, and Practice cards.

### 3. Step Player Engine (`createStepPlayer`)
Standardized interactive animator supporting:
- Play / Pause state with dynamic setInterval loop
- Step Forward (►) and Step Backward (◀)
- Reset to initial state (⟲)
- Real-time progress bar and step counter (`x / total`)
- Dynamic playback speed slider (200ms to 2000ms per step)
- `onRender(stepIndex)` callback for stateful canvas updates.

### 4. Custom VS Code Syntax Engine (`highlightCpp`)
- Client-side tokenization of C++ code without external heavy highlight libraries.
- Regex-based lexical classification into syntax tokens: keywords (`syn-kw`), types (`syn-type`), functions (`syn-func`), builtins (`syn-builtin`), numbers (`syn-num`), strings (`syn-string`), operators (`syn-op`), and comments (`syn-comment`).
- Styled using authentic VS Code Dark+ theme tokens.
