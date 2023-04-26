import Router from '@koa/router';
import * as dd_api from "../api/dd_api"
import * as wps_api from "../api/wps_api"



/**
 * 获取用户信息 供单点登录插件回调
 * @param router 
 */
export default function userinfo(router: Router) {
    router.get('/api/userinfo', async (ctx) => {
        try {
            const userinfo = await dd_api.get_userinfo_by_user_access_token(ctx.request.query.access_token as string);
            const userid = await dd_api.get_userId_by_unioId(userinfo.unionId)
            if (!userid || !userid.result) {
                console.error("get user id failed")
                ctx.body = { userid: 'xxxx' }
                return
            }
            const user_res = (await dd_api.get_userinfo(userid.result.userid))
            const user = user_res.result
            console.log("ding ding user: ", user_res)
            // console.log(user)
            // await wps_api.delete_member([user.userid])
            const res = await wps_api.get_members(user.userid)
            if (!res || !res.total || res.total == 0) {
                let depts = []
                for (const dept_id of user.dept_id_list) {
                    const res = await create_dept_r(dept_id)
                    console.log("res dept_id: ", res)
                    depts.push(res)
                }
                await wps_api.create_member(user, depts)
            }


            ctx.body = { userid: user.userid, avatar: user.avatar, gender: '', nickname: user.name }
        }
        catch (e) {
            console.log("get userinfo failed: ", e)
            ctx.body = { userid: 'xxxx' }
        }
    });
}

/**
 * recursive 添加部门
 * @param dept_id 
 * @returns 
 */
async function create_dept_r(dept_id: number | undefined): Promise<number> {
    console.log(`------input dept_id: ${dept_id}`)
    if (!dept_id) {
        return 1
    }
    const wps_depts = await wps_api.get_depts(dept_id)

    console.log(`${dept_id}------wps_depts: ${wps_depts}`)

    const dd_depts = (await dd_api.get_deptinfo(dept_id)).result

    console.log(`${dept_id}------dd_depts: ${dd_depts}`)
    if (!dd_depts.parent_id) {
        return 1
    }
    if (!wps_depts || !wps_depts.total || wps_depts.total == 0) {
        let res = await wps_api.create_dept(dd_depts, await create_dept_r(dd_depts.parent_id))
        console.log(`${dept_id}------create_dept: ${res}`)
        if (res) {
            return res.id
        }
        return 1
    } else {
        console.log(`${dept_id}------exist: ${wps_depts.depts[0].id}`)
        return wps_depts.depts[0].id
    }
}