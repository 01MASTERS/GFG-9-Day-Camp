/* ============================================================
   DAY REGISTRY & COURSE SYLLABUS
   Add Day 2..Day 9 here later using the same shape:
   { id: 'day2', label: 'Day 2 — <title>', status: 'active', topics: [ ... ] }
   Keep status: 'locked' with topics: [] as a placeholder until ready.
   ============================================================ */

const DAYS = [
  {
    id: 'day1',
    label: 'Day 1 — Basics, Complexity & Arrays',
    status: 'active',
    topics: [
      TOPIC_COMPLEXITY,
      TOPIC_ERRORS,
      TOPIC_GCD,
      TOPIC_PRIME,
      TOPIC_DIGITS,
      TOPIC_LARGEST,
      TOPIC_MAJORITY,
      TOPIC_KADANE,
      TOPIC_MISSING,
      TOPIC_MEDIAN
    ]
  },
  {
    id: 'day2',
    label: 'Day 2 — Arrays & Strings',
    status: 'active',
    topics: [
      TOPIC_ROTATE_ARRAY,
      TOPIC_REVERSE_ARRAY,
      TOPIC_PALINDROME,
      TOPIC_ANAGRAM,
      TOPIC_PANAGRAM,
      TOPIC_ISOMORPHIC,
      TOPIC_SUBARRAYS,
      TOPIC_TRANSPOSE_MATRIX,
      TOPIC_SET_MATRIX_ZERO
    ]
  },
  { id: 'day3', label: 'Day 3 — Sorting II & Searching', status: 'locked', topics: [] },
  { id: 'day4', label: 'Day 4 — Two Pointers & Sliding Window', status: 'locked', topics: [] },
  { id: 'day5', label: 'Day 5 — Strings & Hashing', status: 'locked', topics: [] },
  { id: 'day6', label: 'Day 6 — Linked Lists', status: 'locked', topics: [] },
  { id: 'day7', label: 'Day 7 — Stacks & Queues', status: 'locked', topics: [] },
  { id: 'day8', label: 'Day 8 — Trees I', status: 'locked', topics: [] },
  { id: 'day9', label: 'Day 9 — Trees II & Recap', status: 'locked', topics: [] },
];
