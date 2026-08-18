# Testing & Verification Strategies

## 1. Testing Modes & Capabilities
- **Browser Automation Subagent**: The project leverages `browser_subagent` and native browser execution to test visual layout, interactive step playback, tab navigation, and responsive reflows.
- **Console Error Auditing**: Verification involves auditing the browser console logs on initial load and during topic switching to guarantee zero runtime JavaScript errors or unhandled exceptions.
- **Direct File Protocol Verification**: Ensures all assets, fonts, icons, and scripts load correctly under direct `file:///` paths without CORS or network blocking.

## 2. Interactive Feature Test Cases

### Time Complexity Visualizer
- Verify Dual-Mode toggle (`Fixed Input (Same n)` vs `Real-World Limits (Practical n)`).
- Verify preset buttons ($N=10, 1000, 10^5, 10^8$) compute ops without JavaScript numeric overflow (`Infinity`).
- Verify Stirling's approximation renders for large $N$ on $O(2^n)$ and $O(n!)$.
- Verify individual $n$ badges and CPU time estimates.

### Types of Errors in C++ & CP
- Verify category filters (`All`, `Runtime`, `Wrong Answer`, `Time Limit`, `Memory Limit`, `Compilation`).
- Verify error card selection updates description, golden fix rules, and side-by-side buggy vs fixed code.
- Verify `▶ Simulate Buggy Submission` and `✅ Test Corrected Fix` buttons update judge terminal output.

### Algorithm Step Players
- Verify `Reset`, `Step Forward`, `Step Backward`, `Play/Pause`, and speed slider across:
  - GCD Euclidean Algorithm
  - Prime Factorization & Sieve
  - Digit Extraction & Palindrome
  - Largest & Second Largest Tracking
  - Boyer-Moore Majority Voting
  - Kadane's Max Subarray
  - Missing Number XOR Cancellation
  - Median of Array

### Practice Problem Routing
- Verify practice links open in new tab (`target="_blank" rel="noopener"`).
- Verify batch problem links point to `https://www.geeksforgeeks.org/batch/dsa-training-siddhartha-academy/track/...`.
