import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { DingDingPageRouter, JWT_TOKEN_KEY } from './const';
import { getCurrWatershedId, getCurrWatershedObj, getParamObj } from '.';
import { history } from 'umi';
import GlobalStore from '@/store';

export const url = window.location.origin; //'http://10.0.201.191:7788'; //location.origin; // ;
axios.defaults.timeout = 1000 * 60 * 10; //380000;
const http = axios.create({
  baseURL: `${url}/api/`
});
const httpPdf = axios.create({
  baseURL: `${url}/api/`
});
message.config({
  maxCount: 1
});

const getToken = (): string | null => {
  return localStorage.getItem(JWT_TOKEN_KEY);
};

// 需要登录的状态码
//key:后端返回状态码
//value:是否使用后端返回message信息
const needLoginStatus = new Map([
  [11002, true],
  [11003, true], //ip变化，使用后端返回mes信息
  [11009, true], //登录失效
  [10003, true],
  [10002, true] // token校验失败
]);

httpPdf.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (DingDingPageRouter.includes(history.location.pathname)) {
    return config;
  } else {
    const token = getToken();
    if (token) {
      config.headers!['Authorization'] = `${token}`;
    } else {
      let paramObj = getParamObj(window.location.href);
      let path = '/?';
      for (let i in paramObj) {
        path = path + i + '=' + paramObj[i] + '&';
      }
      history.push(path);
    }
    return config;
  }
});

http.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (DingDingPageRouter.includes(history.location.pathname)) {
    return config;
  } else {
    const token = getToken();
    if (token) {
      config.headers!['Authorization'] = `${token}`;
    } else {
      let paramObj = getParamObj(window.location.href);
      let path = '/?';
      for (let i in paramObj) {
        path = path + i + '=' + paramObj[i] + '&';
      }
      history.push(path);
    }
    let watershedId = getCurrWatershedId();
    if (watershedId) {
      config.headers!['Watershed-ID'] = watershedId;
    }
    return config;
  }
});

http.interceptors.response.use(
  res => {
    // 如果没有 code 字段，或者 code == 0，直接返回数据
    if (!res.data.code || res.data.code == 0) {
      return res.data;
    }

    // 判断用户登录是否失效
    if (needLoginStatus.has(res.data.code)) {
      message.error(res.data.msg || '需要重新登录');
      localStorage.removeItem(JWT_TOKEN_KEY);
      localStorage.removeItem('isShowMode');
      setTimeout(() => {
        // window.open('https://sgpt.zjwater.com/#/qrLogin', '_self');
        window.open('https://jlldzs.slt.zj.gov.cn/#/qrLogin', '_self');
      }, 2000);
      return Promise.reject(res.data.msg);
    }
    message.error(res.data.msg);
    return Promise.reject(res.data.msg);
  },
  err => {
    if (err.response && err.response.status) {
      if (err.response.status === 401) {
        message.error('登录失效，需要重新登录');
        localStorage.removeItem(JWT_TOKEN_KEY);
        localStorage.removeItem('isShowMode'); //根据产品建议，如果用户重新登录，则清空当前模式
        setTimeout(() => {
          // window.open('https://sgpt.zjwater.com/#/qrLogin', '_self');
          window.open('https://jlldzs.slt.zj.gov.cn/#/qrLogin', '_self');
        }, 2000);
      }
      if (err.response.status === 500) {
        message.error('服务器异常');
      }
    }
    return Promise.reject(err);
  }
);

export default http;
export { httpPdf };
