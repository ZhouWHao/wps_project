import Router from '@koa/router';
import koaBody from 'koa-body';
import { request } from '../utils/requestHttp';
import { HOST } from '../config';

export default function forwardsController(router: Router) {
  router.all('/api/forwards', koaBody(), async (ctx) => {
    const method = ctx.request.method.toUpperCase();
    const body = ['GET', 'HEAD', 'DELETE'].includes(method)
      ? void 0
      : ctx.request.body;

    const path = ctx.query['p'] as string;
    if (!path) throw new Error('Incorrect use');
    console.log(
      `\nroute => [${method}] "${HOST + path}"\nbody: ${JSON.stringify(
        body || 'empty',
        null,
        2
      )}\n`
    );
    ctx.body = await request(method as 'GET' | 'POST', path, undefined, body).then((r) => {
      ctx.status = r.res.statusCode || 200;
      Object.entries(r.res.headers).forEach(([k, v]) => {
        if (v !== void 0) ctx.set(k, v);
      });
      return r.data;
    });
  });
}
