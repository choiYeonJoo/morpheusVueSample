import axios from "axios";
import router from "@/router";
import Define from "@/utils/define";
import CommonUtil from "@/lib/CommonUtil";
import NativeUtil from '@/lib/NativeUtil';
import EventBus, { $alert, $confirm, $list } from '@/common/EventBus';
import { fetchData } from '@/common/service.api';

// https://kr.vuejs.org/v2/guide/plugins.html#플러그인-작성하기
export default {
  install(Vue) {
    // axios 생성
    const axiosInstance = axios.create({
      baseURL: "/",
      withCredentials: false, // send cookies when cross-domain requests
      timeout: 10000 // request timeout
    });

    // ip값 
    const getClientIp = async () => {
      try {
        let ip = '';
        const res = await fetch('https://api.ipify.org?format=json');
        const obj = await res.json();

        // null check
        if (CommonUtil.isEmpty(obj) || CommonUtil.isEmpty(obj.ip)) {
          ip = '100.100.100.100';
        }
        else {
          ip = obj.ip;
        }
        return ip;
      }
      catch (err) {
        const ip = '100.100.100.100';
        return ip;
      }
    }

    // vue 공통 method 주입
    Vue.prototype.Define = Define;
    Vue.prototype.CommonUtil = CommonUtil;
    Vue.prototype.NativeUtil = NativeUtil;
    Vue.prototype.$axios = axiosInstance;
    Vue.prototype.$getClientIp = getClientIp();

    Vue.prototype.$alert = $alert;
    Vue.prototype.$confirm = $confirm;
    Vue.prototype.$list = $list;
       
    Vue.prototype.$fetchData = fetchData;

    Vue.prototype.$cashtax = (authorization) => {
      console.log("$cashtax", authorization);
      return axios.create({
        withCredentials: true, // send cookies when cross-domain requests
        timeout: 5000,
        headers: {
          // 헤더 세팅
          'Content-Type': 'application/json',
          Accept: '*/*',
          Authorization: authorization,
        },
        proxy: {
          // url 리소스를 추가해주자
          "/proxy": {
            // 해당 리소스가 있는 url일 경우 타겟으로 baseURL을 변경
            target: process.env.VUE_APP_PROXY_URL,
            // 기본 베이스URL을 바꿔줄지 여부
            changeOrigin: true
          },
        }
    })}

    /*
    * 팝업 닫는 것에 대한 헬퍼 함수
    */
    Vue.prototype.$autoClosePop = function (props = []) {
      if(!Array.isArray(props)) throw new Error('props 파라미터는 배열이여야합니다.');
      let exist = false;
      props.forEach((prop) => {
        if(this[prop] === true) {
          this[prop] = false;
          exist = true;
          return false; // 반복문 종료
        }
      })
      return exist;
    }

  }
};
