---
name: agentation
description: Visual feedback and annotation tool for AI coding agents (benjitaylor/agentation). Use when adding, configuring, or troubleshooting Agentation in any web application (React, Next.js, Vite, Vue, Svelte, Astro, or Vanilla HTML/JS).
---

# Agentation Skill Guide

[Agentation](https://github.com/benjitaylor/agentation) is an agent-agnostic visual feedback tool created by Benji Taylor. It lets users click elements on a web page, add notes, and copy structured markdown containing CSS selectors, component hierarchies, and element coordinates for AI coding agents.

---

## Integration by Framework / Stack

### 1. React / Next.js (App & Pages Router)
```bash
npm install agentation -D
```

```tsx
import { Agentation } from 'agentation';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && <Agentation />}
    </>
  );
}
```

### 2. Vite + React / Remix
```tsx
import { Agentation } from 'agentation';

export function App() {
  return (
    <>
      <MainApp />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
```

### 3. Vanilla JS / Static HTML (No Bundler)
Mount the official React component dynamically using browser ESM from `esm.sh`:

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

### 4. Vue / Nuxt / Svelte / Astro
Mount via dynamic client-side ESM script or use framework-specific adapters (`@liuovo/agentation-vue-ui` for Vue) or the ESM loader in a dev-only client script:

```html
<script type="module">
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    import('https://esm.sh/react@18.3.1').then(async (ReactModule) => {
      const React = ReactModule.default || ReactModule;
      const { createRoot } = await import('https://esm.sh/react-dom@18.3.1/client');
      const { Agentation } = await import('https://esm.sh/agentation@3?deps=react@18.3.1,react-dom@18.3.1');
      
      let host = document.getElementById('agentation-root');
      if (!host) {
        host = document.createElement('div');
        host.id = 'agentation-root';
        document.body.appendChild(host);
      }
      createRoot(host).render(React.createElement(Agentation));
    });
  }
</script>
```

---

## Agentation Component Props & Configuration

| Prop | Type | Description |
| :--- | :--- | :--- |
| `endpoint` | `string` | URL for Agentation MCP server (e.g., `http://localhost:4747`) for real-time bidirectional agent sync |
| `copyToClipboard` | `boolean` | Whether to automatically copy generated markdown to clipboard (default: `true`) |
| `onCopy` | `(markdown: string) => void` | Callback triggered when markdown output is copied |
| `onSubmit` | `(output: string, annotations: any[]) => void` | Callback when "Send Annotations" button is clicked |
| `onAnnotationAdd` | `(annotation: any) => void` | Callback on new annotation |

---

## MCP Server Integration (Real-Time Agent Sync)

To let AI agents read and resolve annotations in real-time:
```bash
npx add-mcp "npx -y agentation-mcp server"
```
Or configure in `mcp_config.json`:
```json
{
  "mcpServers": {
    "agentation": {
      "command": "npx",
      "args": ["-y", "agentation-mcp", "server"]
    }
  }
}
```
And pass `endpoint="http://localhost:4747"` to `<Agentation />`.
