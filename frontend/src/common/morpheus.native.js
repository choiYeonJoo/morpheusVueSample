/**
 * 모피어스 API 정의 모듈
 * 
 */

const NO_MORPHEUS_MSG = 'runtiem env is not morpheus app, unknown browser'

export const isMorpheus = (function () {
  const useragent = navigator.userAgent.toLowerCase()
  const IS_MORPHEUS = /morpheus|browseremulator/.test(useragent)
  return function isMorpheus() {
    if (!IS_MORPHEUS) {
      console.warn(NO_MORPHEUS_MSG)
    }
    return IS_MORPHEUS
  }
})();

export default isMorpheus;