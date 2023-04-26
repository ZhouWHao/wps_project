import https from 'https';
import http from 'http';
const querystring = require("querystring");


/**
 * 请求钉钉接口
 * @param host 
 * @param method 
 * @param path 
 * @param params 
 * @param data 
 * @param headers_input 
 * @returns 
 */
export function request_dd(
  host: string,
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
  const contentType = 'application/json';
  let headers: any = {
    'Content-Type': contentType,
  };
  if (params) {
    path += "?" + querystring.stringify(params)
  }
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
    const req = https.request(`${host}/${path}`, options, (res) => {
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
