# RifleJS 🔫
Status: Meme (WIP)

The most game-changing library for building your own React-like framework with minimal effort.

## Why?

**Problem:** Frontend frameworks like React are powerful but often come with a lot of complexity and size. RifleJS aims to give developers a bare-bones, React-like experience for learning, experimenting, or building small interactive web apps.

Instead of relying on full-fledged frameworks, RifleJS lets you build a "React from scratch," learning about Virtual DOM, fibers, and reconciliation while keeping things lightweight.

## How?

RifleJS follows these principles:

1. Implements a `createElement` function for creating Virtual DOM nodes.
2. Renders the Virtual DOM into the real DOM with a `render` function.
3. Adds stateful components using `useState` and eventually introduces hooks.
4. Gradually builds features like fibers, reconciliation, and concurrent rendering for performance.

The framework is modular and extensible, with a focus on simplicity and learning.

## QuickStart

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/riflejs
cd riflejs
npm install
```

Start hacking:

```js
import { createElement, render, useState } from 'riflejs';

function Counter() {
  const [count, setCount] = useState(0);

  return createElement(
    'button',
    { onClick: () => setCount(count + 1) },
    `You clicked ${count} times`
  );
}

const app = createElement('div', null, createElement(Counter));
render(app, document.getElementById('root'));
```

That’s it! You’re building with RifleJS.

Features:
- Virtual DOM: Write elements with JavaScript objects.
- Rendering: Efficiently update the DOM.
- State Management: Use hooks like useState.
- Concurrent Rendering: Optimize updates for better UX.
- Customizable: Build your own features.

Advanced Usage

Customize RifleJS by adding new hooks, state management, or rendering optimizations. The library is designed to be hackable for educational purposes.

Contributing

Want to improve RifleJS? Contributions are welcome!

Development

Run the project in development mode:

```bash
npm run dev
```

Serve the examples:

```bash
npm run serve
```

Test your changes:

```bash
npm run test
```

Deployment

Deploy RifleJS with Vercel or:

```bash
npm run deploy
```

This uses a simple static server setup for demonstration purposes.

RifleJS is inspired by modern frontend frameworks but keeps things lightweight and fun. Build, learn, and experiment!

---

# RifleJS TODO

## Core Development Plan

### Step I: The `createElement` Function
- [ ] Create a utility to construct Virtual DOM nodes.
- [ ] Support props, events, and child nodes.
- [ ] Write tests for the `createElement` function.

### Step II: The `render` Function
- [ ] Create a function to map Virtual DOM to real DOM.
- [ ] Handle text nodes, attributes, and event listeners.
- [ ] Write tests for rendering logic.

### Step III: Concurrent Mode
- [ ] Use `requestIdleCallback` for asynchronous updates.
- [ ] Build a task scheduler to prioritize rendering.

### Step IV: Fibers
- [ ] Create a fiber tree structure to represent nodes.
- [ ] Allow interruptible updates to the DOM.

### Step V: Render and Commit Phases
- [ ] Separate the render phase (Virtual DOM processing) from the commit phase (real DOM updates).
- [ ] Implement a queue to batch DOM changes.

### Step VI: Reconciliation
- [ ] Build a diffing algorithm to compare Virtual DOM trees.
- [ ] Apply only the minimal set of updates to the DOM.

### Step VII: Function Components
- [ ] Add support for functional components.
- [ ] Pass `props` to components for dynamic rendering.

### Step VIII: Hooks
- [ ] Implement `useState` for local state management.
- [ ] Add `useEffect` for side effects.
- [ ] Build a registry to track hooks.

---

## Project Tasks

### Examples
- [ ] Build a basic counter app.
- [ ] Create a to-do list app with state management.

### Documentation
- [ ] Write detailed examples in the README.
- [ ] Add comments to the codebase for clarity.

### Testing
- [ ] Set up a testing framework (e.g., Jest).
- [ ] Write unit tests for each module.
- [ ] Add integration tests for full workflows.

### Optimization
- [ ] Profile rendering performance.
- [ ] Optimize reconciliation for large trees.
