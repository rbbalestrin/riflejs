import { Router } from './router';
import { RifleOptions, RifleWindow } from './interfaces';

export default (opts?: RifleOptions): Router => {
  const router = new Router(opts);
  // eslint-disable-next-line no-console
  opts.log && console.log('🔥 rifle engaged');
  if (window) {
    const ammo = window as RifleWindow;
    ammo.rifle = router;
  }
  return router;
};
