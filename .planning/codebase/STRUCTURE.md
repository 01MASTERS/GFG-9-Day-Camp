# Directory & File Structure Map

```
c:\Users\ravis\Downloads\GFG 9 day camp\
├── index.html                     # Primary application entry point
├── dsa-visualizer.html            # Standalone visualizer entry point
├── DSA_Day1_Instructor_Notes.docx # Day 1 instructor reference notes
│
├── css/
│   └── style.css                  # Global design system, glassmorphic UI, animations, VS Code theme
│
├── data/
│   └── siddhartha_batch_problems.json # 311 problems mapped across 29 tracks from Siddhartha Academy batch
│
├── js/
│   ├── app.js                     # Application bootstrap, navigation controller, sidebar renderer
│   ├── days.js                    # 9-Day course syllabus registry & topic groupings
│   ├── utils.js                   # UI utilities, step player engine, C++ syntax highlighter, tab wiring
│   └── topics/
│       └── day1/
│           ├── complexity.js      # Topic 01: Time Complexity Visualizer (Dual-Mode, Stirling calc, Big-O limits)
│           ├── errors.js          # Topic 02: Types of Errors in C++ & CP (7 Scenarios, Live judge simulator)
│           ├── gcd.js             # Topic 03: GCD Euclidean Algorithm Visualizer & Batch Problems
│           ├── prime.js           # Topic 04: Prime Number Check, Divisors & Sieve of Eratosthenes
│           ├── digits.js          # Topic 05: Digit Manipulation (Sum, Palindrome, Armstrong, Factorial)
│           ├── largest.js         # Topic 06: Largest & Second Largest Element, Array Basics
│           ├── majority.js        # Topic 07: Boyer-Moore Majority Element Voting Visualizer
│           ├── kadane.js          # Topic 08: Kadane's Algorithm — Max Subarray Sum
│           ├── missing.js         # Topic 09: Missing Number (XOR Cancellation & Bit Magic)
│           └── median.js          # Topic 10: Median of Array, In-Place Reordering & Trapping Rain Water
│
└── .planning/
    └── codebase/                  # GSD Codebase Documentation Map
        ├── STACK.md
        ├── INTEGRATIONS.md
        ├── ARCHITECTURE.md
        ├── STRUCTURE.md
        ├── CONVENTIONS.md
        ├── TESTING.md
        └── CONCERNS.md
```

## Key File Responsibilities

| File Path | Lines | Responsibilities |
| :--- | :--- | :--- |
| [`index.html`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/index.html) | 67 | Mounts `#app`, `#sidebar`, `#main`, scripts in sequence, Agentation root. |
| [`css/style.css`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/css/style.css) | 1,495 | Design tokens, sidebar navigation, visualizer stage, step players, VS code theme, practice grid. |
| [`js/utils.js`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/js/utils.js) | 260 | Reusable DOM helpers (`$`, `$$`), `createStepPlayer`, `highlightCpp`, `practiceHTML`, `batchProblem`. |
| [`js/days.js`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/js/days.js) | 35 | Master syllabus array `DAYS` defining Days 1 to 9 and active topic assignments. |
| [`js/app.js`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/js/app.js) | 88 | Initializes app, renders Day selector & topic accordion, manages active topic hash/state. |
| [`data/siddhartha_batch_problems.json`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/data/siddhartha_batch_problems.json) | ~3,000 | Comprehensive problem database extracted from Siddhartha Academy GFG batch. |
