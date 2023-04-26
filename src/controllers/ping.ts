import Router from '@koa/router';
import * as config from '../config';
import * as dd_api from "../api/dd_api"
import * as wps_api from "../api/wps_api"
/**
 * ping
 * @param router 
 */
export function ping(router: Router) {
    router.get('/api/ping', (ctx) => {
        ctx.body = ['ok!', Date.now(), JSON.stringify(config, null, 2)].join('\n');
    });
}


export function test(router: Router) {
    router.get('/api/test', async (ctx) => {
        const userinfo = await dd_api.get_userinfo_by_user_access_token('6287110ad3ad3a35ba5b40e84b902fe5');
        const userid = await dd_api.get_userId_by_unioId(userinfo.unionId)
        const user_res = (await dd_api.get_userinfo(userid.result.userid))
        const user = user_res.result
        await wps_api.delete_member([user.userid])


        const res = await wps_api.get_members(user.userid)
        if (!res || !res.total || res.total == 0) {
            let depts = []
            for (const dept_id of user.dept_id_list) {
                depts.push(await create_dept_r(dept_id))
            }
            await wps_api.create_member(user, depts)
        }


        ctx.body = "ok"
    });
}


async function create_dept_r(dept_id: number | undefined): Promise<number> {
    if (!dept_id) {
        return 1
    }
    const wps_depts = await wps_api.get_depts(dept_id)
    const dd_depts = (await dd_api.get_deptinfo(dept_id)).result
    if (!dd_depts.parent_id) {
        return 1
    }
    if (!wps_depts || !wps_depts.total || wps_depts.total == 0) {
        await create_dept_r(dd_depts.parent_id)
        // let res = await wps_api.create_dept(dd_depts, await create_dept_r(dd_depts.parent_id))
        // if (res) {
        //     return res.id
        // }
        return 1
    } else {
        return wps_depts.depts[0].id
    }
}