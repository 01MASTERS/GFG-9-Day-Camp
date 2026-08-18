# Agentation Integration Rule

When requested to integrate **Agentation** (from [benjitaylor/agentation](https://github.com/benjitaylor/agentation)), always use the official package and component rather than third-party forks.

## Integration Patterns

### 1. React / Next.js Projects
```bash
npm install agentation -D
```
```tsx
import { Agentation } from 'agentation';

export default function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  );
}
```

### 2. Vanilla JS / Static HTML Projects (No Bundler)
Mount the official component dynamically using standard browser ESM without requiring a build step:

```html
<div id="agentation-root"></div>
<script type="module">
  import React from 'https://esm.sh/react@18.3.1';
  import { createRoot } from 'https://esm.sh/react-dom@18.3.1/client';
  import { Agentation } from 'https://esm.sh/agentation@3?deps=react@18.3.1,react-dom@18.3.1';

  const container = document.getElementById('agentation-root');
  if (container) {
    const root = createRoot(container);
    root.render(React.createElement(Agentation));
  }
</script>
```

## Key Invariants
- Always use the official `agentation` package by Benji Taylor.
- Preserve full functionality: click-to-annotate, text selection, multi-select, area selection, animation pause, structured markdown export, and MCP server endpoint configuration.
