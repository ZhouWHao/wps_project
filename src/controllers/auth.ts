import Router from '@koa/router';
import * as dd_api from "../api/dd_api"

/**
 * 获取token 供单点登录插件回调
 * @param router 
 */
export default function auth(router: Router) {
    router.get('/api/auth', async (ctx) => {
        const token = await dd_api.get_user_access_token(ctx.request.query.authCode as string);
        ctx.body = {
            access_token: token.accessToken,
            expires_in: token.expireIn
        }
    });
}
