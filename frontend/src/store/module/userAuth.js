export const allClear = 'allClear';

export const state = () => ({
  userId : "",
});
export const actions = {
  
}
export const mutations = {
  [allClear](state,payload){
  },
  setCachedUser(st, id) {
    st.userId = id;
  },
  removeCachedUser(st) {
    st.userId = '';
  },
};

export const getters = {
  getCachedUser: (st) => {
    return st.userId;
  },
};

export default {
  namespaced: true,
  state,
  // 동기적 setter
  mutations,
  // 비동기적 setter
  actions,
  // getter
  getters
};
