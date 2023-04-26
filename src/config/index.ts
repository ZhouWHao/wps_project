import * as process from 'process';

export const ROOT_DIR = process.cwd();
export const STATIC_DIR = `${ROOT_DIR}/static`;
export const UPLOAD_DIR = `${ROOT_DIR}/upload`;

export const PORT =
    (process.env.HTTP_KPORT && parseInt(process.env.HTTP_KPORT)) || 8080;
export const APP_ID = process.env.AK || '';
export const APP_KEY = process.env.SK || '';
export const HOST = process.env.ECIS_HOST || 'http://127.0.0.1';

export const WPS_HOST = process.env.WPS_HOST || 'https://t4.wpseco.cn'
export const DINGDING_OAPI_HOST = 'https://oapi.dingtalk.com'
export const DINGDING_API_HOST = 'https://api.dingtalk.com'
export const DINGDING_OAPI_CORPID = process.env.DINGDING_OAPI_CORPID || 'dingdul1amnczumx3ehk'
export const DINGDING_OAPI_SECRET = process.env.DINGDING_OAPI_SECRET || '7BIubGuC8PnU3AQOtoNCuxfjOp3mgI9GuXfelePI6FbDIWab1pb4aT8LEX0YBxaz'
export const COMPANY_ID = process.env.COMPANY_ID || 1
export const THIRD_PLATFORM_ID = process.env.THIRD_PLATFORM_ID || 1
export const INIT_PASSWORD = process.env.INIT_PASSWORD || 'WCqfdii6SEt'
export const DEFAULT_DEPT_ID = process.env.DEFAULT_DEPT_ID || 1 // 默认部门ID
// module.exports = {
//     corpId: 'dingdul1amnczumx3ehk',
//     secret: '7BIubGuC8PnU3AQOtoNCuxfjOp3mgI9GuXfelePI6FbDIWab1pb4aT8LEX0YBxaz',
// };