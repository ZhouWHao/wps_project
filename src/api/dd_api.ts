
import { request_dd } from "../utils/request_dd"
import * as config from "../config"

var _ACCESS_TOKEN: string | undefined = undefined
var _EXPIRES_AT: number | undefined = undefined


/**
 * 获取token
 * @returns token
 */
export async function get_token(): Promise<string> {
    if (_ACCESS_TOKEN && _EXPIRES_AT && new Date().getTime() / 1000 < _EXPIRES_AT) {
        return _ACCESS_TOKEN
    }
    try {
        const res: any = await request_dd(config.DINGDING_OAPI_HOST, "GET", "gettoken", {
            corpid: config.DINGDING_OAPI_CORPID,
            corpsecret: config.DINGDING_OAPI_SECRET,
        })
        _ACCESS_TOKEN = res.data.access_token
        let now = new Date()
        _EXPIRES_AT = now.getTime() / 1000 + res.data.expires_at
        return _ACCESS_TOKEN as string

    }
    catch (e) {
        console.error("get_token failed", e)
        throw e
    }
}



/**
 * 用户token
 */
interface UserToken {
    accessToken: string
    refreshToken: string
    expireIn: number
}
/**
 * 通过code获取token
 * @param code code
 * @returns 
 */
export async function get_user_access_token(code: string): Promise<UserToken> {
    try {
        const res: any = await request_dd(config.DINGDING_API_HOST, "POST", "v1.0/oauth2/userAccessToken", undefined, {
            clientId: config.DINGDING_OAPI_CORPID,
            clientSecret: config.DINGDING_OAPI_SECRET,
            code: code,
            "grantType": "authorization_code"
        })
        return res.data as UserToken
    }
    catch (e) {
        console.error("get_user_access_token failed", e)
        throw e
    }
}

interface UserInfoByAccessToken {
    nick: string,
    unionId: string,
    avatarUrl: string,
    openId: string,
    mobile: string,
    stateCode: string
}
/**
 * 通过user_access_token获取用户信息
 */
export async function get_userinfo_by_user_access_token(token: string): Promise<UserInfoByAccessToken> {
    try {
        const res: any = await request_dd(config.DINGDING_API_HOST, "GET", "v1.0/contact/users/me", undefined, undefined, { 'x-acs-dingtalk-access-token': token })
        return res.data as UserInfoByAccessToken
    }
    catch (e) {
        console.error("get_userinfo_by_user_access_token failed", e)
        throw e
    }
}



interface DDResult<T> {
    errcode: number
    errmsg: string
    result: T //result
    request_id: string
}


interface UserIDByUninID {
    contact_type: number,
    userid: string,
}
/**
 * 通过unionid获取userid
 */
export async function get_userId_by_unioId(unionid: string): Promise<DDResult<UserIDByUninID>> {
    try {
        const res: any = await request_dd(config.DINGDING_OAPI_HOST, "POST", "topapi/user/getbyunionid", {
            access_token: await get_token()
        }, { unionid: unionid })
        return res.data
    }
    catch (e) {
        console.error("get_userId_by_unioId failed", e)
        throw e
    }
}



export interface UserInfo {
    active: boolean //是否激活
    admin: boolean //是否管理员
    avatar: string  // 图标 'https://static-legacy.dingtalk.com/media/lADPDgQ9qXDvFCfNAgjNAhw_540_520.jpg',
    boss: boolean //false
    dept_id_list: Array<any>
    dept_order_list: Array<any>
    email: string
    exclusive_account: boolean
    hide_mobile: boolean
    job_number: string
    leader_in_dept: Array<any>
    manager_userid: string
    mobile: string
    name: string
    real_authed: boolean
    remark: string
    role_list: Array<any>
    senior: boolean
    state_code: string
    telephone: string
    title: string
    union_emp_ext: any
    unionid: string
    userid: string
    work_place: string
}


/**
 * 获取用户信息
 * @param userid 用户id
 * @returns 
 */
export async function get_userinfo(userid: string): Promise<DDResult<UserInfo>> {
    try {
        const res: any = await request_dd(config.DINGDING_OAPI_HOST, "POST", "topapi/v2/user/get", {
            access_token: await get_token(),
        }, { userid, language: 'zh_CN' })

        if (res.res.statusCode != 200 || !res.data || res.data.errcode != 0) {
            return { result: { userid: "xxxxxxxxxx" } } as DDResult<UserInfo>
        }
        return res.data
    }
    catch (e) {
        console.error("get_userinfo failed", e)
        // throw e
        return { result: { userid: "xxxxxxxxxx" } } as DDResult<UserInfo>
    }
}

export interface DeptInfo {
    dept_id: number,
    name: string,
    parent_id: number,
}

/**
 * 获取用户信息
 * @param userid 用户id
 * @returns 
 */
export async function get_deptinfo(dept_id: number): Promise<DDResult<DeptInfo>> {
    try {
        const res: any = await request_dd(config.DINGDING_OAPI_HOST, "POST", "topapi/v2/department/get", {
            access_token: await get_token(),
        }, { dept_id, language: 'zh_CN' })

        return res.data
    }
    catch (e) {
        console.error("get_deptinfo failed", e)
        throw e
    }
}



