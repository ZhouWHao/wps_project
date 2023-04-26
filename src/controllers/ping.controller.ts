import Router from '@koa/router';
import * as config from '../config';

export default function pingController(router: Router) {
  router.get('/api/ping', (ctx) => {
    ctx.body = ['ok!', Date.now(), JSON.stringify(config, null, 2)].join('\n');
  });
}
