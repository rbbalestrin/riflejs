import { Router } from './router';

export interface RifleOptions {
  log?: boolean;
  prefetch?: 'visible' | 'hover';
  pageTransitions?: boolean;
}

export interface RouteChangeData {
  type: 'link' | 'popstate' | 'noop' | 'disqualified' | 'scroll' | 'go' | string;
  next?: string;
  prev?: string;
  scrollId?: string;
}

export type RifleWindow = Window & typeof globalThis & { rifle: Router };

export type FetchProgressEvent = {
  progress: number;
  received: number;
  length: number;
};

export interface RifleElement {
  type: string | 'TEXT_ELEMENT';
  props: {
    [key: string]: any;
    children: RifleElement[];
  };
}

export interface Fiber {
  type: string | 'TEXT_ELEMENT';
  props: {
    [key: string]: any;
    children: RifleElement[];
  };
  dom?: Node | null;
  parent?: Fiber | null;
  child?: Fiber | null;
  sibling?: Fiber | null;
  alternate?: Fiber | null;
  effectTag?: 'PLACEMENT' | 'UPDATE' | 'DELETION';
}
