import Vue from "vue";
import Vuex from "vuex";

import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

import userAuth from '@/store/module/userAuth';

//store 모듈 샘플 형태, 추후 삭제
import sample from "@/store/module/sample";

//@ts-ignore

const ls = new SecureLS({ isCompression: false });
var timeout = null;
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userAuth,
    sample,
  },
  plugins: [
    // https://github.com/robinvdvleuten/vuex-persistedstate#api
    createPersistedState({
      storage: {
        getItem: key => ls.get(key),
        setItem: (key, value) => {
          if(key === 'vuex' && isMorpheus()){
            M.data.storage("Vuex", value);
          }
          if (timeout != null) clearTimeout(timeout);
          timeout = null;
          timeout = setTimeout(function() {
            timeout = null;
            ls.set(key, value);
            } , 1);
        },
        removeItem: key => ls.remove(key)
      }
    })
  ]
});
