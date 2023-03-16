/**
 * 공통 API SERVER axios 서비스
 */

import axios from "axios";
import store from "@/store";
import router from "@/router";
import { $alert } from "@/common/EventBus";
import CommonUtil from "@/utils/CommonUtil";

let configSet = {};
let fetchDataErrorCodes = []


const service = axios.create({
  baseURL: process.env.VUE_APP_URL,
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60000, // request timeout time ms
});

/* axios 인터셉터 처리 [요청] */
service.interceptors.request.use(
  (config) => {
    configSet = config
    return config;
  },
  (error) => {
    console.error('service.interceptors.request.use', error); // for debug
    return Promise.reject(error);
  }
);

/* axios 인터셉터 처리 [응답] */
service.interceptors.response.use(

  async function (response) {
    const res = response.data;

    try {
    //   /* 상태값에 따른 에러처리 해보기 */
    //   if (response.status !== 200 || (response.request.responseType.toUpperCase() !== "BLOB" && response.data.status !== 'OK')) {
    //     res.success = false
    //   }
    //   else {
    //     res.success = true
    //   }
    //   if (!res.success) {
    //     if (chkCd(res.status)) {
    //       const tmpConfig = configSet;
    //       return await fetchData(tmpConfig)
    //     }

    //     return Promise.reject(new Error(res.message || 'Error'))
    //   }
      
    //   if (response.request.responseType.toUpperCase() === "BLOB") {
        return response;
      // } else {
      //   return res.data;
      // }
    }
    catch (e) {
      return Promise.reject(new Error(res.message || 'Error'))
    }
  },
  async function (error) {

    let message = '오류가 발생했습니다. 관리자에게 문의하여 주시기 바랍니다.'
    const response = error.response || {};
    const { status, config } = response;
    let data;
    try{
      if(response.data) {
        if(response.data.data) {
          data = response.data.data;
        } else {
          data = response.data;
        }
      }
    } catch (e) {
      data = response.data;
    }
    try {
      /* 세션연장처리 */
      // if (!CommonUtil.isEmpty(error) && !CommonUtil.isEmpty(error.response) && chkCd(error.response.status) && configSet.url !== 'auth/refresh') {
      //   const tmpConfig = configSet
      //   return await fetchData(tmpConfig)
      // } else {
        
        console.log('에러메세지생성', error)
        message = CommonUtil.isEmpty(error) || CommonUtil.isEmpty(error.response) || CommonUtil.isEmpty(error.response.data) || CommonUtil.isEmpty(error.response.data.message) ? '오류가 발생했습니다. 관리자에게 문의하여 주시기 바랍니다.' : error.response.data.message;
        
        // if(configSet.url == 'auth/refresh'){
        //   await $alert('토큰 시간이 만료되어 로그인 화면으로 이동합니다.');
        //   router.replace("/login");
        // }
      // }
    }
    catch (e) {
      message = e
      console.log(e)
    }

    // 에러_메세지(http 로그인 인증 jwt 401)
    // WRONG_TYPE_TOKEN    잘못된 토큰
    // EXPIRED_TOKEN       인증 만료
    // UNSUPPORTED_TOKEN   잘못된 토큰
    // WRONG_TOKEN         잘못된 토큰
    // UNKNOWN_ERROR 		정의되지 않은 오류
    // NO_TOKEN			로그인 하지 않음 토큰 없음
    // if (!CommonUtil.isEmpty(error) && !CommonUtil.isEmpty(error.response) && !CommonUtil.isEmpty(error.response.status) && !fetchDataErrorCodes.includes(error.response.status)
    //   && !fetchDataErrorCodes.includes(401)) {

    //   // fetchDataError = true
    //   fetchDataErrorCodes.push(error.response.status)
    //   await $alert(message)
    //   fetchDataErrorCodes = [] // fetchDataError = false
    // }else{
      
      await $alert(message);
    // }
    
    return Promise.reject(data);
  }
);

export default service;

/**
 * fetchData
 * @param {object} options axios options
 * @param {boolean} options.isFormData multipart/form-data 처리시
 * @param {boolean} useJWT jwt header 설정 여부 (기본값 true)
 * @returns {Promise}
 */
export const fetchData = (options, useJWT = true) => {
  if (options.isFormData) {
    const headers = options["headers"] || {};
    headers["Content-type"] = "multipart/form-data";
    options["headers"] = headers;
  }
  // if(useJWT && options.responseType === 'blob'){
  //   const headers = options["headers"] || {};
  //   headers["Content-Type"] = 'application/json;charset=UTF-8';
  //   options["headers"] = headers;
  //   options["responseType"] = options.responseType;
  // }
  return service(options);
};

/**
 * 모피어스 GW 서버 네이티브 HTTP 통신
 * @param options
 * @returns {Promise<unknown>}
 */
export const fetchEksys = (options) => {
  const _options = {
    url: options.url || "",
    method: options.method || "POST",
    param: options.param || {},
    headers : options.headers || {},
  };
  console.log(_options)

  if (!isMorpheus()) {
    return new Promise((resolve, reject) => {
      _options.data = {};
      _options.data.head = _options.bodyHeader;
      _options.data.body = _options.param;

      fetchData(_options)
      .then((result) => {
        resolve(result.data.body);
      })
      .catch((error) => {
        resolve(error);
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      M.net.http.send({
        server: "API_GATEWAY",
        path: _options.url,
        method: _options.method,
        timeout: 30000,
        indicator: {
          show: false,
          message: "Loading..",
          cancelable: true,
        },
        data: _options.param,
        success: function (recevedData, setting) {
          resolve(recevedData); // data 바로 출력됨
        },
        error: function (errorCode, errorMessage, setting) {
          resolve({
            resultCode : errorCode, 
            resultMsg : errorMessage
          });
        },
      });
    });
  }
};