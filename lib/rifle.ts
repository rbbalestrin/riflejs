import { Fiber, RifleElement } from './interfaces';

function createTextElement(text: string): RifleElement {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type: string, props: Record<string, any> | null, ...children: (RifleElement | string)[]): RifleElement {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === 'object' ? child : createTextElement(child))),
    },
  };
}

/**********************
 * DOM MANIPULATION   *
 **********************/

function createDom(fiber: Fiber): Node {
  // For text fibers, create a text node
  if (fiber.type === 'TEXT_ELEMENT') {
    return document.createTextNode(fiber.props.nodeValue ?? '');
  }

  // Otherwise, create a DOM element
  const dom = document.createElement(fiber.type);

  // Assign properties (excluding "children")
  const isProperty = (key: string) => key !== 'children';
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  // Render children of this fiber into the DOM node
  fiber.props.children.forEach((child) => {
    render(child, dom as HTMLElement);
  });

  return dom;
}

const isEvent = (key: string) => key.startsWith('on');
const isProperty = (key: string) => key !== 'children' && !isEvent(key);
const isNew = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => prev[key] !== next[key];
const isGone = (prev: Record<string, any>, next: Record<string, any>) => (key: string) => !(key in next);

function updateDom(dom: Node, prevProps: Record<string, any>, nextProps: Record<string, any>) {
  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      (dom as HTMLElement).removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      (dom as any)[name] = '';
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      (dom as any)[name] = nextProps[name];
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      (dom as HTMLElement).addEventListener(eventType, nextProps[name]);
    });
}

/**********************
 * FIBER RECONCILIATION
 **********************/

let nextUnitOfWork: Fiber | null = null;
let currentRoot: Fiber | null = null;
let wipRoot: Fiber | null = null;
let deletions: Fiber[] = [];

/** Commit the "root" once the entire Fiber tree is built */
function commitRoot(): void {
  deletions.forEach(commitWork);
  commitWork(wipRoot?.child || null);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber: Fiber | null): void {
  if (!fiber) return;

  const domParent = fiber.parent?.dom;
  if (!domParent) return;

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'DELETION' && fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom && fiber.alternate) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export function render(element: RifleElement, container: HTMLElement | null): void {
  if (!container) return;

  wipRoot = {
    type: container.tagName.toLowerCase(), // or some placeholder
    props: {
      children: [element],
    },
    dom: container,
    alternate: currentRoot,
  };

  deletions = [];
  nextUnitOfWork = wipRoot;
}

/** The main work loop - uses requestIdleCallback for scheduling */
function workLoop(deadline: IdleDeadline): void {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber: Fiber): Fiber | null {
  // Create DOM for this fiber if not yet created
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // Reconcile children
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // Return next unit of work (child -> sibling -> parent's sibling, etc.)
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber: Fiber | null = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent || null;
  }
  return null;
}

function reconcileChildren(wipFiber: Fiber, elements: RifleElement[]) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling: Fiber | null = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber: Fiber | null = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    // If same type -> update
    if (sameType && oldFiber) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }

    // If a new element of a different type -> placement
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    // If oldFiber exists but the type does not match -> deletion
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber || null;
    } else if (prevSibling && newFiber) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

/**********************
 * EXAMPLE USAGE BELOW
 **********************/

const Rifle = {
  createElement,
  render,
};

const element = Rifle.createElement('div', { id: 'foo' }, 'Hello ', Rifle.createElement('b', null, 'world'), '!');

const container = document.getElementById('root');
Rifle.render(element, container as HTMLElement);
