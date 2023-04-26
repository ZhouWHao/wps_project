const querystring = require('querystring');
// var httpUtil = require('../utils/http');

// module.exports = {
//   getUserInfo: function (accessToken, params, cb) {
//     var path =
//       '/topapi/v2/user/get?' +
//       querystring.stringify({
//         access_token: accessToken,
//       });
//     httpUtil.post(path, params, cb);
//   },
//   getUserAccessToken: function (params, cb, host) {
//     var path = '/v1.0/oauth2/userAccessToken';
//     httpUtil.post(path, params, cb, host);
//   },
//   //根据accessToken获取用户通讯录个人信息
//   getUserInfoByAccessToken: (params, cb, host, header) => {
//     var path = '/v1.0/contact/users/' + params;
//     httpUtil.get(path, cb, host, header);
//   },
//   //根据unionId获取userId
//   getUserIdByUnionId: (accessToken, params, cb) => {
//     var path = '/topapi/user/getbyunionid?access_token=' + accessToken;
//     httpUtil.post(path, params, cb);
//   },
//   //通过免登码获取用户信息
//   getUserNewInfo: (accessToken, params, cb) => {
//     var path = '/topapi/v2/user/getuserinfo?access_token=' + accessToken;
//     httpUtil.post(path, params, cb);
//   },
//   // https://oapi.dingtalk.com/topapi/v2/user/getuserinfo
// };
import { request_dd } from "../utils/request_dd"
import * as config from "../config"


export async function getDDUserInfo(params: Record<string, unknown> | undefined,body: Record<string, unknown> | undefined): Promise<any> {
  try {
    const res: any = await request_dd(config.DINGDING_OAPI_HOST,"POST", "/topapi/v2/user/get",params, body)
    return res.data;
  }
  catch (e) {
    console.error("get_userinfo failed", e)
    throw e
  }
}
