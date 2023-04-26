import http from 'http';
import https from 'https';
import crypto from 'crypto';
import { APP_ID, APP_KEY, HOST, WPS_HOST } from '../config';
const querystring = require("querystring");



/**
 * 请求wps接口
 * @param method 
 * @param path 
 * @param params 
 * @param data 
 * @param headers_input 
 * @returns 
 */
export function request_wps(
  method: 'GET' | 'POST',
  path: string,
  params?: Record<string, unknown>,
  data?: Record<string, unknown>,
  headers_input?: Record<string, unknown>,
): Promise<{
  req: http.ClientRequest;
  res: http.IncomingMessage;
  data: string;
}> {
  const dataString = new Date().toUTCString();
  const contentType = 'application/json';
  if (params) {
    path += "?" + querystring.stringify(params)
  }

  const getAuthorization = (
    method: 'GET' | 'POST',
    path: string,
    body: Record<string, unknown> | undefined,
    dataString: string
  ) => {
    // 签名计算
    let authorization = [
      'WPS-4',
      method,
      path,
      'application/json',
      dataString,
      body
        ? crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex')
        : '',
    ].join('');
    authorization = crypto
      .createHmac('sha256', APP_KEY)
      .update(authorization)
      .digest('hex');
    return 'WPS-4 ' + APP_ID + ':' + authorization;
  };
  

  let headers: any = {
    'Content-Type': contentType,
    'Wps-Docs-Date': dataString,
    'Wps-Docs-Authorization': getAuthorization(method, path, data, dataString),
  };

  if (headers_input) {
    for (const k in headers_input) {
      headers[k] = headers_input[k]
    }
  }

  const requestData = data ? JSON.stringify(data) : '';

  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers,
    };
    const req = https.request(`${WPS_HOST}/${path}`, options, (res) => {
      let responseBody = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve({
          req,
          res,
          data: JSON.parse(responseBody),
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}
