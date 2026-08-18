# External Integrations & API Contracts

## 1. GeeksforGeeks Batch System (`dsa-training-siddhartha-academy`)
- **Batch Identifier**: `dsa-training-siddhartha-academy`
- **Internal API Endpoints**:
  - Batch Tracks: `https://practiceapi.geeksforgeeks.org/api/v1/batches/dsa-training-siddhartha-academy/`
  - Track Problems: `https://practiceapi.geeksforgeeks.org/api/v1/tracks/{track_slug}/batch/dsa-training-siddhartha-academy/`
- **Web App Routing Contract**:
  - `https://www.geeksforgeeks.org/batch/dsa-training-siddhartha-academy/track/{track_slug}/problem/{problem_slug}`
- **Fallback URL Resolution**:
  - `https://www.geeksforgeeks.org/problems/{problem_slug}/1`
- **Cached Dataset**: [data/siddhartha_batch_problems.json](file:///c:/Users/ravis/Downloads/GFG%209%20day%20camp/data/siddhartha_batch_problems.json) containing 311 problems mapped across 29 tracks and 12 syllabus clusters.

## 2. Agentation Visual Feedback System
- **Library**: `agentation` v3.0.0-beta.9
- **Host Element**: `<div id="agentation-root"></div>`
- **Configuration**:
  - React 18 Dynamic Root Mount via `esm.sh`
  - Mounts feedback toolbar on client runtime for capturing visual notes, coordinates, and CSS selector feedback for AI-assisted refinement.
