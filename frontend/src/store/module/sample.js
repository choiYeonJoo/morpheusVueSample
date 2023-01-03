import _ from "lodash";

export const commonCode = "commonCode";

export default {
    namespaced: true,
    state : () => ({
        'test' : "",
        [commonCode]: [
            /* {
                "comCd": "string", //공콩코드
                "comCdNm": "string", //공통코드 이름
                "comGrpCd": "string", //공통코드 그룹
                "comGrpCdNm": "string" //공통코드 그룹명
            }*/
        ],
    }),
    // 동기적 setter
    mutations : {
        //this.$store.commit('test/muTest', "1234");
        muTest(state,payload){
            state['test'] = payload;
        },
        [commonCode](state, payload) {
            state[commonCode] = payload;
        },
    },
    // 비동기적 setter
    actions : {
        //this.$store.dispatch('test/acTest', "1234");
        acTest(context,payload){
            context.commit('test', payload);
        },
        async [commonCode](context, payload) {
            try {
            let res = await this._vm.$fetchData({
                url: `${process.env.VUE_APP_URL}/comncd`,
                method: "get",
            }, false);

            context.commit(commonCode, res);

            return res;
            } catch (e) {
            return e;
            }
        },
    },
    // getter
    getters : {
        //this.$store.getters['test/getTest']
        getTest : (st) => {
            return st.test;
        },
        getCommonCodeMap: (st) => {
            const codes = _.cloneDeep(st[commonCode]) || []; // arr
            const rs = {};
            _.forEach(codes, (code) => {
            const { comCd, comCdNm, comGrpCd, comGrpCdNm } = code;
            let exist = rs[comGrpCd];
            if (!exist) {
                exist = rs[comGrpCd] = [];
            }
            exist.push(code);
            });
            return rs;
        },
    }
}
