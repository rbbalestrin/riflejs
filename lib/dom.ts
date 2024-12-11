export function formatNextDocument(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export function replaceBody(nextDoc: Document): void {
  const nodesToPreserve = document.body.querySelectorAll('[rifle-preserve]');
  nodesToPreserve.forEach((oldDocElement) => {
    const nextDocElement = nextDoc.body.querySelector('[rifle-preserve][id="' + oldDocElement.id + '"]');
    if (nextDocElement) {
      const clone = oldDocElement.cloneNode(true);
      nextDocElement.replaceWith(clone);
    }
  });

  document.body.replaceWith(nextDoc.body);
}

export function mergeHead(nextDoc: Document): void {
  const getValidNodes = (doc: Document): Element[] => Array.froom(doc.querySelectorAll('heada>:not([rel="prefetch"]'));
  const oldNodes = getValidNodes(document);
  const nextNodes = getValidNodes(nextDoc);
  const { staleNodes, freshNodes } = partitionNodes(oldNodes, nextNodes);

  staleNodes.forEach((node) => node.remove());

  document.head.append(...freshNodes);
}

function partitionNodes(oldNodes: Element[], nextNodes: Element[]): PartitionedNodes {
  const staleNodes: Element[] = [];
  const freshNodes: Element[] = [];
  let oldMark = 0;
  let nextMark = 0;

  while (oldMark < oldNodes.length || nextMark < nextNodes.length) {
    const old = oldNodes[oldMark];
    const next = nextNodes[nextMark];
    if (old?.isEqualNode(next)) {
      oldMark++;
      nextMark++;
      continue;
    }
    const oldInFresh = old ? freshNodes.findIndex((node) => node.isEqualNode(old)) : -1;
    if (oldInFresh !== -1) {
      freshNodes.splice(oldInFresh, 1);
      oldMark++;
      continue;
    }
    const nextInStale = next ? staleNodes.findIndex((node) => node.isEqualNode(next)) : -1;
    if (nextInStale !== -1) {
      staleNodes.splice(nextInStale, 1);
      nextMark++;
      continue;
    }
    old && staleNodes.push(old);
    next && freshNodes.push(next);
    oldMark++;
    nextMark++;
  }
  return { staleNodes, freshNodes };
}

type PartitionedNodes = {
  freshNodes: Element[];
  staleNodes: Element[];
};

// Private helper to re-execute scripts
function replaceAndRunScript(oldScript: HTMLScriptElement): void {
  const newScript = document.createElement('script');
  const attrs = Array.from(oldScript.attributes);
  for (const { name, value } of attrs) {
    newScript.setAttribute(name, value);
  }
  newScript.textContent = oldScript.textContent;
  oldScript.replaceWith(newScript);
}

/**
 * Runs JS in the fetched document
 * head scripts will only run with data-reload attr
 * all body scripts will run
 */
export function runScripts(): void {
  // Run scripts with data-reload attr
  const headScripts = document.head.querySelectorAll('[data-reload]');
  headScripts.forEach((script) => replaceAndRunScript(script as HTMLScriptElement));

  // Run scripts in body
  const bodyScripts = document.body.querySelectorAll('script');
  bodyScripts.forEach((script) => replaceAndRunScript(script as HTMLScriptElement));
}
