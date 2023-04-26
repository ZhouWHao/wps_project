import { Middleware } from 'koa';

export function exceptionHandle(): Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      console.error(e);
      // exceptionFilter(config)(e, ctx)
      ctx.type = 'application/json';
      ctx.status = 500;
      if (e instanceof Error) {
        ctx.body = JSON.stringify({
          code: 500,
          message: e.message,
        });
      } else {
        ctx.body = JSON.stringify({
          code: 500,
          message: 'Internal Server Error',
        });
      }
    }
  };
}
