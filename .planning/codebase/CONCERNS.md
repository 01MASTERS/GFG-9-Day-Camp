# Concerns, Technical Debt & Roadmap Considerations

## 1. Current State & Technical Debt
- **Duplicated Entrypoint**: `index.html` and `dsa-visualizer.html` are nearly identical clones. Any future script tag or structure update must currently be applied to both files. *(Recommendation: Consolidate or keep `dsa-visualizer.html` as an automated copy).*
- **Topic Script Loading**: As the syllabus grows across Days 2 to 9, manually adding `<script>` tags for dozens of topic files into `index.html` may become unwieldy. Dynamic script loading by Day selection or ES modules could streamline multi-day scaling.
- **Global Scope Footprint**: All `TOPIC_*` objects are declared in the global scope to be consumed by `js/days.js`. While lightweight, maintaining unique topic ID conventions is critical to avoid collisions.

## 2. Days 2 to 9 Roadmap Readiness
- The entire 311-problem batch database is cached at [`data/siddhartha_batch_problems.json`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/data/siddhartha_batch_problems.json).
- The syllabus in [`js/days.js`](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/js/days.js) is pre-structured with placeholder entries for:
  - Day 2 — Sorting I (Bubble, Selection, Insertion)
  - Day 3 — Sorting II & Searching (Quick Sort, Merge Sort, Binary Search)
  - Day 4 — Two Pointers & Sliding Window
  - Day 5 — Strings & Hashing
  - Day 6 — Linked Lists
  - Day 7 — Stacks & Queues
  - Day 8 — Trees I (Binary Trees, Traversals)
  - Day 9 — Trees II (BST, Heap, Recap)
- As subsequent days are implemented, the component architecture and practice panel engine are already primed for drop-in activation.
