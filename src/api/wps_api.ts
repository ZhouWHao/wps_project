import { UserInfo, DeptInfo } from "./dd_api"
import * as config from "../config"
import { request } from "../utils/requestHttp"


/**
 * 获取员工
 * @param unionid 
 * @returns 
 */
export async function get_members(unionid: string): Promise<any> {
    try {
        const res: any = await request("POST", `/org/dev/v1/batch/companies/${config.COMPANY_ID}/thirdusers`, undefined, {
            platform_id: config.THIRD_PLATFORM_ID,
            union_ids: [unionid]
        })
        console.log("get_members: ", res.data)
        return res.data.data
    }
    catch (e) {
        console.error("get_members failed", e)
        throw e
    }
}

/**
 * 创建员工
 * @param userinfo 用户信息
 * @returns 
 */
export async function create_member(userinfo: UserInfo, deptids: number[]): Promise<void> {
    try {
        console.log("deptids: ", deptids)
        const dids = Array.from(new Set(deptids))
        let ds = []
        for (const x of dids) {
            ds.push({ dept_id: x, weight: 0 })
        }
        if (ds.length == 0) {
            ds = [{ dept_id: 1, weight: 0 }]
        }
        console.log("ds: ", ds)
        let data = {
            account: userinfo.userid,
            avatar: userinfo.avatar,
            def_dept_id: dids[0],
            dept_ids: ds,
            email: userinfo.email,
            mobile_phone: userinfo.mobile,
            nick_name: userinfo.name,
            password: config.INIT_PASSWORD,
            source: "sync",
            telephone: userinfo.telephone,
            third_platform_id: config.THIRD_PLATFORM_ID,
            third_union_id: userinfo.userid,
            title: userinfo.title,
            // employment_status: 'probationary',
        }

        const res: any = await request("POST", `/org/dev/v1/companies/${config.COMPANY_ID}/members`, undefined, data)
        console.log("create_member: ", res.data)
        return res.data
    }
    catch (e) {
        console.error("create_member failed", e)
        throw e
    }
}

/**
 * 删除员工
 * @param unionids 
 */
export async function delete_member(unionids: string[]): Promise<void> {
    try {
        const res: any = await request("POST", `/org/dev/v1/delete/batch/companies/${config.COMPANY_ID}/thirdusers`, undefined, {
            platform_id: config.THIRD_PLATFORM_ID,
            union_ids: unionids
        })
    }
    catch (e) {
        console.error("delete_member failed", e)
        throw e
    }
}

/**
 * 获取部门
 * @param unionid 
 * @returns 
 */
export async function get_depts(unionid: number): Promise<any> {
    try {
        const res: any = await request("POST", `/org/dev/v1/companies/${config.COMPANY_ID}/thirddepts`, undefined, {
            platform_id: config.THIRD_PLATFORM_ID,
            union_ids: [unionid]
        })
        console.log(`get_depts by ${unionid}: `, res.data.data)
        return res.data.data
    }
    catch (e) {
        console.error("get_depts failed", e)
        throw e
    }
}

/**
 * 创建部门
 * @param deptinfo 
 * @param parent_id 
 * @returns 
 */
export async function create_dept(deptinfo: DeptInfo, parent_id: number): Promise<any> {
    try {
        const res: any = await request("POST", `/org/dev/v1/companies/${config.COMPANY_ID}/depts/${parent_id}`, undefined, {
            name: deptinfo.name,
            source: "sync",
            third_platform_id: config.THIRD_PLATFORM_ID,
            third_union_id: deptinfo.dept_id,
            weight: 0
        })
        console.log("create_dept: ", res.data)
        return res.data.data
    }
    catch (e) {
        console.error("create_dept failed", e)
        throw e
    }
}

/**
 * 删除部门
 * @param unionids 
 * @returns 
 */
export async function delete_depts(unionids: number[]): Promise<any> {
    try {
        const res: any = await request("POST", `/org/dev/v1/delete/batch/companies/${config.COMPANY_ID}/thirddepts`, undefined, {
            platform_id: config.THIRD_PLATFORM_ID,
            union_ids: unionids
        })
        return res.data.data
    }
    catch (e) {
        console.error("delete_depts failed", e)
        throw e
    }
}

