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
  {
    id: 'day3',
    label: 'Day 3 — Searching & Sorting',
    status: 'active',
    topics: [
      TOPIC_LINEAR_SEARCH,
      TOPIC_BINARY_SEARCH,
      TOPIC_PEAK_ELEMENT,
      TOPIC_COUNT_OCCURRENCE,
      TOPIC_FIRST_OCCURRENCE,
      TOPIC_LAST_OCCURRENCE,
      TOPIC_ROTATED_SEARCH,
      TOPIC_BUBBLE_SORT,
      TOPIC_SELECTION_SORT,
      TOPIC_INSERTION_SORT
    ]
  },
  {
    id: 'day4',
    label: 'Day 4 — Sliding Window & Two Pointers',
    status: 'active',
    topics: [
      TOPIC_MAX_SUBARRAY_K,
      TOPIC_LONGEST_DISTINCT,
      TOPIC_COUNT_DISTINCT_WINDOW,
      TOPIC_FRUIT_BASKET,
      TOPIC_CONTAINER_WATER,
      TOPIC_SORT_01,
      TOPIC_TWO_SUM_SORTED
    ]
  },
  {
    id: 'day5',
    label: 'Day 5 — Hashing & Prefix Sum',
    status: 'active',
    topics: [
      TOPIC_PREFIX_SUM,
      TOPIC_MAX_FREQ_CHAR,
      TOPIC_TWO_SUM,
      TOPIC_FIRST_DUPLICATE,
      TOPIC_SUBARRAY_SUM_K,
      TOPIC_SUBARRAY_DIV_K,
      TOPIC_COUNT_NICE_SUBARRAYS
    ]
  },
  { id: 'day6', label: 'Day 6 — Linked Lists', status: 'locked', topics: [] },
  { id: 'day7', label: 'Day 7 — Stacks & Queues', status: 'locked', topics: [] },
  { id: 'day8', label: 'Day 8 — Trees I', status: 'locked', topics: [] },
  { id: 'day9', label: 'Day 9 — Trees II & Recap', status: 'locked', topics: [] },
];
