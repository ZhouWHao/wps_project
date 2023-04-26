import { request_dd } from "../utils/request_dd"
import * as config from "../config"
//获取部门详情
export async function getDDdeptInfo(params: Record<string, unknown> | undefined,body: Record<string, unknown> | undefined): Promise<any> {
  try {
    const res: any = await request_dd(config.DINGDING_OAPI_HOST,"POST", "/topapi/v2/department/get", params,body)
    return res.data;
  }
  catch (e) {
    console.error("get_DDdept failed", e)
    throw e
  }
}
//获取指定用户的所有父部门列表
export async function getAllDDdeptParent(params: Record<string, unknown> | undefined,body: Record<string, unknown> | undefined): Promise<any> {
  try {
    const res: any = await request_dd(config.DINGDING_OAPI_HOST,"POST", "/topapi/v2/department/listparentbyuser", params,body)
    return res.data;
  }
  catch (e) {
    console.error("get_DDdept failed", e)
    throw e
  }
}