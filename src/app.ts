import Koa, { Middleware } from 'koa';
import { HOST, PORT } from './config';
import { router, buildRoutes } from './router';
import { exceptionHandle } from './middleware/exception.middleware';
import sourceMapSupport from 'source-map-support';

function logger(format = ':method :url :status :timing'): Middleware {
  return async function (ctx, next) {
    const start = process.hrtime.bigint();
    await next();
    const end = process.hrtime.bigint();
    const str = format
      .replace(':method', ctx.method)
      .replace(':url', decodeURI(ctx.originalUrl))
      .replace(':status', `${ctx.status}`)
      .replace(':timing', `${(end - start) / BigInt(1000000)}ms`);

    console.log(str);
  };
}

sourceMapSupport.install();

async function main() {
  const app = new Koa();
  buildRoutes();
  app
    .use(logger())
    .use(exceptionHandle())
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(PORT);
  console.log(`Server running on ${HOST}:${PORT}`);
}

main().catch((reason) => {
  console.error(reason);
  process.exit(1);
});
