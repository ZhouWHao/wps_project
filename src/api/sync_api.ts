// import { request_wps } from "../utils/request_wps"
import { request } from "../utils/requestHttp"
const querystring = require('querystring');
import * as config from "../config"
export async function get_members(): Promise<void> {
    try {
        const res: any = await request("GET",  '/org/dev/v1/companies/1/members?offset=0&limit=10&status=active',undefined)
        console.log(res.data)

    }
    catch (e) {
        console.error("get_members failed", e)
        throw e
    }
}

export async function wpsGetUserList(body: Record<string, unknown> | undefined): Promise<any> {
    try {
      const res: any = await request("POST",  `/org/dev/v1/batch/companies/${config.COMPANY_ID}/thirdusers`,undefined,body)
      return res.data;
    }
    catch (e) {
      console.error("wpsGetUserList failed", e)
      throw e
    }
}
//根据三方union-id批量获取部门信息
export async function wpsGetDeptInfo(body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const res: any = await request("POST",  `/org/dev/v1/companies/${config.COMPANY_ID}/thirddepts`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsGetDeptInfo failed", e)
        throw e
    }
}
//wps批量创建部门
export async function wpsBatchCreateDept(parent_id:string,body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const res: any = await request("POST",  `/org/dev/v1/batch/companies/${config.COMPANY_ID}/depts/${parent_id}`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsBatchCreateDept failed", e)
        throw e
    }
}



//wps修改部门
export async function wpsUpdateDept(body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const res: any = await request("POST",  `/org/dev/v1/companies/${config.COMPANY_ID}/thirddepts/rename`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsUpdateDept failed", e)
        throw e
    }
}

//wps批量删除部门
export async function wpsBatchRemoveDept(body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const res: any = await request("POST",  `/org/dev/v1/delete/batch/companies/${config.COMPANY_ID}/thirddepts`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsBatchRemoveDept failed", e)
        throw e
    }
}



  //wps创建用户
export async function wpsCreateUser(body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const res: any = await request("POST",  `/org/dev/v1/companies/${config.COMPANY_ID}/members`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsCreateUser failed", e)
        throw e
    }
}
//wps删除用户
export async function wpsRemoveUser(body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const res: any = await request("POST",  `/org/dev/v1/delete/batch/companies/${config.COMPANY_ID}/thirdusers`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsRemoveUser failed", e)
        throw e
    }
}
//wps修改用户
export async function wpsUpdateUser(params: Record<string, unknown> | undefined,body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const paramsStr = querystring.stringify(params);
        const res: any = await request("POST", `/org/dev/v1/companies/${config.COMPANY_ID}/thirdusers?${paramsStr}`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsUpdateUser failed", e)
        throw e
    }
}
//调整企业账户的归属部门
export async function wpsUpdateUserDept(body: Record<string, unknown> | undefined): Promise<any> {
    try {
        const res: any = await request("POST", `/org/dev/v1/companies/${config.COMPANY_ID}/change_account_dept`,undefined,body)
        return res.data;
    }
    catch (e) {
        console.error("wpsUpdateUserDept failed", e)
        throw e
    }
}
//wps根据uniondId获取用户详情
export async function wpsGetUserInfo(params: Record<string, unknown> | undefined): Promise<any> {
    try {
        const paramsStr = querystring.stringify(params);
        const res: any = await request("GET", `/org/dev/v1/companies/${config.COMPANY_ID}/thirdusers?${paramsStr}`,undefined)
        return res.data;
    }
    catch (e) {
        console.error("wpsGetUserInfo failed", e)
        throw e
    }
}
//根据企业账户查询所属部门
export async function wpsGetDeptByAccount(account_id:number): Promise<any> {
    try {
        const res: any = await request("GET", `/org/dev/v1/companies/${config.COMPANY_ID}/members/${account_id}/depts`,undefined)
        return res.data;
    }
    catch (e) {
        console.error("wpsGetDeptByAccount failed", e)
        throw e
    }
}