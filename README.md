# RifleJS 🔫
Status: Meme (WIP)

The most game-changing library for building your own React-like framework with minimal effort.

## Why?

**Problem:** Frontend frameworks like React are powerful but complex, while RifleJS simplifies the experience for building lightweight interactive apps, addressing the challenge of static sites that struggle with slow performance and state sharing between pages.

RifleJS offers a lightweight alternative to full-fledged frameworks, enabling you to build a “React from scratch” while exploring concepts like Virtual DOM, fibers, and reconciliation, with the goal of making route changes on static sites feel as seamless and fast as a SPA without requiring a framework to control the entire DOM.

## How?

RifleJS achieves its lightweight and fast approach by combining innovative techniques for navigation and Virtual DOM management. It prefetches visible links on the current page using IntersectionObserver, intercepts click and popstate events, and updates the HTML5 history seamlessly during route changes. When fetching the next page, it swaps the <body>, merges the <head> (without re-executing scripts unless specified), and ensures JavaScript behaviors persist across navigations—making it especially compatible with native web components.

On the Virtual DOM side, RifleJS follows a modular and extensible design. It starts with a createElement function for generating Virtual DOM nodes, renders them to the real DOM via a render function, and introduces stateful components with useState, gradually expanding to hooks. Over time, it adds advanced features like fibers, reconciliation, and concurrent rendering to enhance performance, all while maintaining simplicity and focusing on learning.

## Features:
- Virtual DOM: Write elements with JavaScript objects.
- Rendering: Efficiently update the DOM.
- State Management: Use hooks like useState.
- Concurrent Rendering: Optimize updates for better UX.
- Customizable: Build your own features.

RifleJS is inspired by modern frontend frameworks but keeps things lightweight and fun. Build, learn, and experiment!

---

## Project Tasks

### Examples
- [ ] Build a basic counter app.
- [ ] Create a to-do list app with state management.

### Documentation
- [X] Write detailed examples in the README.
- [X] Add comments to the codebase for clarity.
