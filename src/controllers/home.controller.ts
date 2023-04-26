import fs from 'fs';
import path from 'path';
import { STATIC_DIR } from '../config';
import Router from '@koa/router';

export default function homeController(router: Router) {
  router.get('/index', async (ctx) => {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.body = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(path.join(STATIC_DIR, '/index.html'), (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  });
}
