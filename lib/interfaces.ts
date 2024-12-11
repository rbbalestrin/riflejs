export interface RifleOptions {
  log?: boolean;
  prefetch?: 'visibl' | 'hover';
  pageTransitions?: boolean;
}

export interface RouteChangeData {
  type: 'link' | 'popstate' | 'noop' | 'disqualified' | 'scroll' | 'go' | string;
  next?: string;
  prev?: string;
  scrollId?: string;
}

export type FetchProgressEvent = {
  progress: number;
  received: number;
  length: number;
};
