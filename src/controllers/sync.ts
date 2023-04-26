import { ParameterizedContext, DefaultState, DefaultContext } from 'koa';
import Router from '@koa/router';
import * as config from '../config';
const DingTalkEncryptor = require('dingtalk-encrypt');
const utils = require('dingtalk-encrypt/Utils');
import { getDDdeptInfo, getAllDDdeptParent } from '../api/department';
import { getDDUserInfo } from '../api/user';
import * as dd_api from '../api/dd_api';
import * as wps_api from '../api/wps_api';
import {
  wpsGetUserList,
  wpsBatchCreateDept,
  wpsGetDeptInfo,
  wpsCreateUser,
  wpsRemoveUser,
  wpsUpdateUser,
  wpsBatchRemoveDept,
  wpsUpdateDept,
  wpsUpdateUserDept,
  wpsGetUserInfo,
  wpsGetDeptByAccount
} from '../api/sync_api';

//获取系统级token
import { get_token } from '../api/dd_api';
/**
 * recursive 添加部门
 * @param dept_id 
 * @returns 
 */
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
      let res = await wps_api.create_dept(dd_depts, await create_dept_r(dd_depts.parent_id))
      if (res) {
          return res.id
      }
      return 1
  } else {
      return wps_depts.depts[0].id
  }
}
const updateUserInfoAction = (updateParams: Record<string, unknown> | undefined,updateBody: Record<string, unknown> | undefined)=>{
  wpsUpdateUser(updateParams, updateBody).then((editInfo: any) => {
  });
}
//接收并响应事件
const responseEvent = async (
  ctx: ParameterizedContext<
    DefaultState,
    DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>,
    unknown
  >
) => {
  const signature = ctx.query.signature;
  const timestamp = ctx.query.timestamp;
  const nonce = ctx.query.nonce;
  const encryptObj = ctx.request.body;
  /** 加解密需要，可以随机填写。如 "12345" */
  const TOKEN = '19xzLM';
  /** 加密密钥，用于回调数据的加密，固定为43个字符，从[a-z, A-Z, 0-9]共62个字符中随机生成, 见 getRandomEncodingAesKey */
  const ENCODING_AES_KEY = 'ZGs2a3I2MnNuRzk4NFhWbXV2YmN3dVF4S21DMXFsSUM';


  /** 实例化加密类 */

  const encryptor = new DingTalkEncryptor(
    TOKEN,
    ENCODING_AES_KEY,
    config.DINGDING_OAPI_CORPID
  );

  // 解密钉钉回调数据
  const plainText = encryptor.getDecryptMsg(
    signature,
    timestamp,
    nonce,
    encryptObj.encrypt
  );

  const subscribeData = JSON.parse(plainText);
  const eventType = subscribeData.EventType;

  // 回调事件类型，根据事件类型和业务数据处理相应业务
  if ('user_add_org' === eventType) {
    // 处理通讯录用户增加事件
    const userId = subscribeData.UserId[0] || '';

    //获取钉钉用户详细信息
    const getListParmas = {
      platform_id: config.THIRD_PLATFORM_ID,
      union_ids: [userId],
    };
    wpsGetUserList(getListParmas).then(async (data: any) => {

      //如果用户成员在金山系统不存在则去获取钉钉用户详细信息
      if (
        !data.data ||
        !data.data.company_members ||
        data.data.company_members.length === 0
      ) {
        const user_res = (await dd_api.get_userinfo(userId))
        const user = user_res.result
        const res = await wps_api.get_members(userId)
   
        if (!res || !res.total || res.total == 0) {
            let depts = []
            for (const dept_id of user.dept_id_list) {
                depts.push(await create_dept_r(dept_id))
            }
            await wps_api.create_member(user, depts)
        }
      }
    });
  } else if ('user_leave_org' === eventType) {
    // 处理通讯录用户离职事件
    const userIds = subscribeData.UserId || '';
    const getListParmas = {
      platform_id: config.THIRD_PLATFORM_ID,
      union_ids: userIds,
    };
    wpsGetUserList(getListParmas).then(async (data: any) => {
    
      if (
        data &&
        data.data &&
        data.data.company_members &&
        data.data.company_members.length !== 0
      ) {
        const removeParams = {
          platform_id: config.THIRD_PLATFORM_ID,
          union_ids: userIds,
        };
        wpsRemoveUser(removeParams).then(() => {
          console.log('钉钉 订阅删除 success', data);
        });
      }
    });
  } else if ('user_modify_org' === eventType) {
    console.log('asdasdasdasdasdasdsada');
    // 处理通讯录用户修改事件
    const userId = subscribeData.UserId[0] || '';
    const getListParmas = {
      platform_id: config.THIRD_PLATFORM_ID,
      union_ids: [userId],
    };
    wpsGetUserList(getListParmas).then(async (data: any) => {
      if (
        data &&
        data.data &&
        data.data.company_members &&
        data.data.company_members.length !== 0
      ) {
        //获取钉钉用户详细信息
        getDDUserInfo(
          { access_token: await get_token() },
          { userid: userId, language: 'zh_CN' }
        ).then(async (detailInfo: any) => {
          if (detailInfo && detailInfo.result) {
            console.log('钉钉用户详情', detailInfo);
            const updateParams = {
              third_platform_id: config.THIRD_PLATFORM_ID,
              third_union_id: userId,
            };
            const updateBody = {
              email: detailInfo.result.email || 'xxxxx@email.com',
              employee_id: detailInfo.result.employee_id || 'unknow',
              employment_status:detailInfo.result.employment_status || 'unknow',
              employment_type: detailInfo.result.employment_type || 'unknow',
              gender: detailInfo.result.gender || 'secrecy',
              mobile_phone: detailInfo.result.mobile || 'unknow',
              nick_name: detailInfo.result.name,
              telephone: detailInfo.result.telephone || '0000000000',
              title: detailInfo.result.title || 'unknow',
            };
            //获取wps用户详情
            wpsGetUserInfo(updateParams).then((wpsUserInfo: any) => {
              const account_id = wpsUserInfo.data.account_id;
              const def_dept_id = wpsUserInfo.data.def_dept_id;
              //获取旧的wps的部门详细数据
              wpsGetDeptByAccount(account_id).then(async(wpsHistoryDeptInfo: any) => {
                if(wpsHistoryDeptInfo.data && wpsHistoryDeptInfo.data.depts && wpsHistoryDeptInfo.data.depts.length){
                  //const new_dept_ids = detailInfo.result.dept_order_list.map((item: { dept_id: number; order: number; })=>({dept_id:item.dept_id,weight:item.order}))
                  const old_dept_ids = wpsHistoryDeptInfo.data.depts.map((item: { id: number; })=>(item.id))
                  const isEqual = (old_dept_ids.length === detailInfo.result.dept_id_list.length && old_dept_ids.filter((t: any) => !detailInfo.result.dept_id_list.includes(t))).length === 0;
                  if(isEqual){
                    //历史部门id和新部门id相同就直接修改用户
                    updateUserInfoAction(updateParams,updateBody)
                  }else{
                    const new_dept_ids: any[] = []
                    for (const dept of detailInfo.result.dept_order_list) {
                      new_dept_ids.push({dept_id:await create_dept_r(dept.dept_id),weight:0})
                    }
                    //const new_dept_ids = detailInfo.result.dept_order_list.map((item: { dept_id: number; order: number; })=>({dept_id:item.dept_id,weight:item.order}))
                   console.log('new_dept_ids',new_dept_ids);
                   const isIdEquals = (new_dept_ids.length === old_dept_ids.length && new_dept_ids.filter((t: any) => !old_dept_ids.includes(t)).length !=0);
                   if(!isIdEquals){
                    const updateUserDeptBody = {
                      "account_id": account_id,
                      "def_dept_id": new_dept_ids[0].dept_id,
                      "new_dept_ids": new_dept_ids,
                      "old_dept_ids":old_dept_ids
                    }
                    console.log('打印updateUserDeptBody',updateUserDeptBody);
                    //创建完了开始修改部门
                    await wpsUpdateUserDept(updateUserDeptBody).then((updateUserDept:any)=>{
                      if(updateUserDept){
                        //再修改用户
                        updateUserInfoAction(updateParams,updateBody)
                      }
                    })
                   }
                  }
                }
              })
            })
          }
        });
      }
    });
  } else if ('org_dept_create' === eventType) {
    //部门创建
    const deptIds = subscribeData.DeptId || [];
    for (const dept_id of deptIds) {
        await create_dept_r(dept_id)
    }
    // wpsGetDeptInfo({
    //   platform_id: config.THIRD_PLATFORM_ID,
    //   union_ids: deptIds,
    // }).then(async (wpsDeptInfo: any) => {
    //   if (!Boolean(wpsDeptInfo.data.total)) {
    //     getDDdeptInfo(
    //       {
    //         access_token: await get_token(),
    //       },
    //       { dept_id: deptIds[0], language: 'zh_CN' }
    //     ).then((ddInfo) => {
    //       //如果存在则将所有部门的详细数据存到一个数组里
    //       const deptParams = {
    //         detps: [
    //           {
    //             name: ddInfo.result.name,
    //             source: 'sync',
    //             third_platform_id: config.THIRD_PLATFORM_ID,
    //             third_union_id: ddInfo.result.dept_id,
    //             weight: ddInfo.result.order,
    //           },
    //         ],
    //       };
    //       console.log('创建部门请求参数', deptParams);
    //       //创建部门
    //       wpsBatchCreateDept(ddInfo.result.parent_id, deptParams).then(
    //         (data) => {
    //           if (data) {
    //             console.log('部门创建成功', data);
    //           }
    //         }
    //       );
    //     });
    //   }
    // });
  } else if ('org_dept_remove' === eventType) {
    const deptIds = subscribeData.DeptId || [];
    //部门删除
    wpsGetDeptInfo({
      platform_id: config.THIRD_PLATFORM_ID,
      union_ids: deptIds,
    }).then((wpsDeptInfo: any) => {
      console.log('org_dept_remove单个用户详情查询', wpsDeptInfo);
      if (wpsDeptInfo.data.total) {
        const deptParams = {
          platform_id: config.THIRD_PLATFORM_ID,
          union_ids: deptIds,
        };
        wpsBatchRemoveDept(deptParams).then((data) => {
          if (data) {
            console.log('部门删除成功', data);
          }
        });
      }
    });
  } else if ('org_dept_modify' === eventType) {
    //部门修改
    const deptIds = subscribeData.DeptId || [];
    wpsGetDeptInfo({
      platform_id: config.THIRD_PLATFORM_ID,
      union_ids: deptIds,
    }).then(async (wpsDeptInfo: any) => {
      if (wpsDeptInfo.data.total) {
        getDDdeptInfo(
          {
            access_token: await get_token(),
          },
          { dept_id: deptIds[0], language: 'zh_CN' }
        ).then((deptInfo) => {
          console.log('org_dept_modify单个用户详情查询', deptInfo);
          if (deptInfo.result) {
            const deptBody = {
              name: deptInfo.result.name,
              third_platform_id: config.THIRD_PLATFORM_ID,
              third_union_id: deptIds[0],
            };
            wpsUpdateDept(deptBody).then((data) => {
              if (data) {
                console.log('部门修改成功', data);
              }
            });
          }
        });
      }
    });
  }

  // 响应数据：加密'success'，签名等等
  return encryptor.getEncryptedMap('success', timestamp, utils.getRandomStr(8));
};

export function userChange(router: Router) {
  router.post('/api/user_change', async (ctx) => {
    ctx.body = await responseEvent(ctx);
  });
}
