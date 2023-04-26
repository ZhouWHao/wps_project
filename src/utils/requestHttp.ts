import http from 'http';
import https from 'https';
import crypto from 'crypto';
import { APP_ID, APP_KEY, HOST } from '../config';
const querystring = require("querystring");

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

export function request(
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
  console.log("start----------------------------")
  console.log("method: ", method)
  console.log("path: ", path)
  console.log("params: ", params)
  console.log("data: ", data)
  console.log("headers_input: ", headers_input)
  console.log("end----------------------------")

  const dataString = new Date().toUTCString();
  const contentType = 'application/json';
  if (params) {
    path += "?" + querystring.stringify(params)
  }
  const method_upper = method.toUpperCase();
  const body = ['GET', 'HEAD', 'DELETE'].includes(method_upper)
    ? void 0
    : data;
  const headers: any = {
    'Content-Type': contentType,
    'Wps-Docs-Date': dataString,
    'Wps-Docs-Authorization': getAuthorization(method, path, body, dataString),
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
    const req = http.request(`${HOST}/i/docmini${path}`, options, (res) => {
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
      console.error(error)
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}

// export function forwards(
//   method: 'GET' | 'POST',
//   path: string,
//   data?: Record<string, unknown>
// ) {
//   return new Promise<{
//     req: http.ClientRequest;
//     res: http.IncomingMessage;
//     data: string;
//   }>((resolve, reject) => {
//     const req = https.request(
//       `https://t4.wpseco.cn/c/Exam1/api/forwards?p=${encodeURIComponent(path)}`,
//       {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//       (res) => {
//         let responseBody = '';
//         res.setEncoding('utf8');
//         res.on('data', (chunk) => {
//           responseBody += chunk;
//         });
//         res.on('end', () => {
//           resolve({
//             req,
//             res,
//             data: responseBody,
//           });
//         });
//       }
//     );
//     req.on('error', (err) => reject(err));
//     if (data) req.write(JSON.stringify(data));
//     req.end();
//   });
// }
