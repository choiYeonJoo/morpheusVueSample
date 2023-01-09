import CommonUtil from "@/utils/CommonUtil";

var lodash = require('lodash');

export default class NativeUtil {

  static callCellPhone(item:string){
    let phoneNumber = item;
    let regex = /[^0-9]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
    phoneNumber = phoneNumber.replace(regex, "");	// 원래 문자열에서 숫자가 아닌 모든 문자열을 빈 문자로 변경
    if(isMorpheus()){
      if (!CommonUtil.isEmpty(phoneNumber)) {
        M.sys.call(phoneNumber);
      } else {
        M.pop.instance('통화 가능한 연락처가 없습니다.');
      }
    }else {
      if (!CommonUtil.isEmpty(phoneNumber)) {
        alert('웹이라 통화가 안됨 실제 전화걸 폰번호 : ' + phoneNumber)
      } else {
        alert('통화 가능한 연락처가 없습니다.')
      }
      
      console.log('웹이라 통화가 안됨', item, phoneNumber);
    }
  }
}



