import moment from "moment-timezone";
const store = require("@/store");

var empty = require('is-empty');

var lodash = require('lodash');

export default class CommonUtil {

  //공통 코드값 관리
  public static getCmCd(comGrpCd : string){
    let totalCmCd = store.default.state.common.commonCode;
    let list = totalCmCd.filter((v:any)=>{return v.comGrpCd == comGrpCd});
    let rtnList:any = [];
    list.forEach((v:any)=>{
      let obj = {vl : '', lb : ''};
      obj.vl = v.comCd;
      obj.lb = v.comCdNm;
      rtnList.push(obj);
    })
    return rtnList;
  }

  //객체 merge (딥 카피, 병합된 객체의 값을 바꿔도 원본의 값은 변경되지 않음)
  public static merge(obj1: any, obj2: any){
    return lodash.merge(obj1,obj2);
  }

  //Array merge (중복 허용)
  public static mergeArray(arr1: any[], arr2: any[]) {
    if(arr1 == null){
      arr1 = [];
    }
    if(arr2 == null){
      arr2 = [];
    }
    return arr1.concat(arr2)
  }

  //현재 시간으로부터 얼마 전인지 계산 (1시간 전 과 같이 반환)
  public static passedDaysFromNow(date:number){
    if(date == null){
      return null;
    }

    return moment(date, 'YYYYMMDDHHmmss').fromNow()
  }

  /**
   * 원하는 길이 만큼 0으로 채운 문자 반환 
   * Ex) CommonUtil.zeroPad("22", "5") => "00022"
   * @param str
   * @param length
   * @return String
   */
  public static zeroPad(str:string, length:number): string{
    str += '';
    return str.length < length ? CommonUtil.zeroPad("0"+str, length) : str;	
  }

  //객채 딥카피(병합된 객체의 값을 바꿔도 원본의 값은 변경되지 않음)
  static clone(data: any): any {
    return lodash.cloneDeep(data);
  }

  //빈값 체크, npm 라이브러리 사용(https://www.npmjs.com/package/is-empty)
  static isEmpty(data: any) : boolean{
    return empty(data);
  }

  //앱 버전 정보 반환
  static getBuildVersion(){
    return isMorpheus() ? 
    M.info.app('app.version') + " / "
    + M.info.app('manifest.resource.target').charAt(0) + M.info.app('manifest.network.http.RES_UPDATE.address').charAt(13) + ""
    + M.info.app('resource.current_version')
    :
    "웹 테스트 버전"
  }

  /**
   * 특정 키로 정렬 (키 하나만 있을 때)
   * Ex) CommonUtil.orderByKey([{age:10, name:'Kim'},{age:9, name:'Lee'}], 'age', true) => [{age:9, name:'Lee'},{age:10, name:'Kim'}]
   * @param arr
   * @param key
   * @param isAscOrDesc
   * @return array
   */
  static orderByKey(arr: any[] = [], key: string, isAscOrDesc: boolean): any[] {
    return lodash.orderBy(arr, [key], [isAscOrDesc ? 'asc' : 'desc']);
  }

  /**
   * string array를 참고하여 특정 키에 대해서 string array와 같은 값을 제외/필터링한 object array를 반환
   * Ex) CommonUtil.filterByKey([{age:10, name:'Kim'},{age:9, name:'Lee'}], ['Lee'], 'name', false) => [{age:10, name:'Kim'}]
   * @param aRes 원본 object array
   * @param dataToFiltered 제외/필터링할 값 목록
   * @param key aRes 에서 제외/필터링할 기준 키
   * @param isIncludeOrExclude dataToFiltered 와 값이 일치하는 aRes의 key를 포함한 array만 반환할 지, 제외한 목록을 반환할 지
   * @return array
   */
  static filterByKey(aRes: any[] = [], dataToFiltered: string[] = [] , key: string, isIncludeOrExclude:boolean): any[] {
    dataToFiltered.forEach( eachData =>{
      aRes = aRes.filter( eachRes =>{
        if(isIncludeOrExclude == true){
          return eachRes[key] == eachData
        }else{
          return eachRes[key] != eachData
        }
      })
    })
    return aRes;
  }

  /**
   * 비어있는 값을 특정 값으로 치환
   * Ex) CommonUtil.nvl(null, '빈 값') => '빈 값'
   */
   static nvl(value:any, alt:any) {
    if (this.isEmpty(value)) {
      return alt;
    }

    return value;
  }

  /**
   * 엔터 BR 변환
   */
  static enterToBr(value:string) {
    if (typeof value === "string") {
      return value.replace(/(?:\r\n|\r|\n)/g, "<br />");
    }

    return "";
  }

  /**
   * object에서 빈값 제거하기
   * Ex) CommonUtil.toEmptyRemove({age:null, name:'Kim', birth : '1999'}) => {name:'Kim', birth : '1999'}
   */
  static toEmptyRemove(obj:any) {
    const result:any = {};

    if (obj !== null && typeof obj === "object") {
      for (const key in obj) {
        if (obj[key]) {
          result[key] = obj[key];
        }
      }
    }

    return result;
  }

  /**
   * return 20220118201122
   */
  static nowStr(format ="YYYYMMDDHHmmss") :string{
    return moment().format(format);
  }
  static getTodayDateStr( format = "YYYYMMDDHHmmss"): string {
    return moment(new Date()).format(format);
  }
  static getTodayDate( format = "YYYYMMDD"): string {
    return moment(new Date()).format(format);
  }

  /**
   * return 2022-01-18 or 2022-01 or 01-18
   */
  static dateFormat(str:string){
    if(!this.isEmpty(str)){
      if(str.length == 8){
        return moment(str,'YYYYMMDD').format('YYYY-MM-DD');
      }else if(str.length == 6){
        return moment(str,'YYYYMM').format('YYYY-MM');
      }else if(str.length == 4){
        return moment(str,'MMDD').format('MM-DD');
      }else{
        return str;
      }
    }else{
      return "";
    }
  }

  /**
   * return 2022-01-18 20:11:22 or 2022-01-18 20:11
   */
  static dateTimeFormat(str:string){
    if(!this.isEmpty(str)){
      if(str.length == 14){
        return moment(str,"YYYYMMDDHHmmss").format('YYYY-MM-DD HH:mm:ss');
      }else if(str.length == 12){
        return moment(str,"YYYYMMDDHHmm").format('YYYY-MM-DD HH:mm');
      }
    }else{
      return moment().format('YYYY-MM-DD HH:mm');
    }
  }

  /**
   * return 20:11:22 or 20:11
   */
  static timeFormat(str:string){
    if(!this.isEmpty(str)){
      if(str.length == 6){
        return moment(str,'HHmmss').format('HH:mm:ss');
      }else if(str.length == 4){
        return moment(str,'HHmm').format('HH:mm');
      }else{
        return str;
      }
    }else{
      return moment().format('HH:mm:ss');
    }
  }

  //오늘 and 해당 날짜의 요일을 반환 
  // 오늘 or 월요일
  static getDayFormat(str:string){
    let today = moment();
    let getDate = moment(str,"YYYYMMDD");
    if(str.length == 14){
      getDate = moment(str,"YYYYMMDDHHmmss");
    }
    if(today.format('YYYYMMDD') == getDate.format('YYYYMMDD')){
      return "오늘";
    }else{
      return getDate.format('ddd')+"요일"
    }
  }

  //Date -> String 변환, 표시 포멧 지정 가능
  static getDateToString = (date:Date, format:string="") => {
    let month = CommonUtil.zeroPad(String(date.getMonth() + 1),2);
    let day = CommonUtil.zeroPad(String(date.getDate()),2);
    return `${date.getFullYear()}${format}${month}${format}${day}`
  }

  //CommonUtil.convert12H('23') -> 오후 11
  static convert12H(getTime:string) {
    var intTime = parseInt(getTime); // int형으로 변환 
    if (intTime < 12 ) { // intTime이 12보다 작으면 
      var str = '오전 '; // '오전' 출력 
    } else { // 12보다 크면 
      var str = '오후 '; // '오후 출력' 
    } // intTime이 12면 변환 후 그대로 12 
    if (intTime == 12) {
      var cvHour = intTime;
    } // 나머지경우엔 intTime을 12로 나눈 나머지값이 변환 후 시간이 된다 
    else {
      var cvHour = intTime%12;
    }
    var res = str + (cvHour);
    return res; 
  }

  // 값에 대한 바이트사이즈
  static GetLengB(sValue:string) {
    if (this.isEmpty(sValue)) {
      console.log("isEmpty!!")
      return 0;
    }
    const vChkStr = sValue.toString();
    let vcnt = 0;
    for (let i = 0; i < vChkStr.length; i++) {
      if (vChkStr.charCodeAt(i) > 127) {
        vcnt += 2;
      }
      else {
        vcnt += 1;
      }
    }

    return vcnt;
  }

  //HHmmAM형식 변환 함수
  //CommonUtil.convert12H60M(22:30) -> 1030PM
  static convert12H60M(getTime:string) { 

    const timeArr = getTime.split(":")
    const hour = parseInt(timeArr[0])
    const min = timeArr[1]

    let str = ''
    let cvHour

    if(hour < 12){
      str = 'AM'
    }else{
      str = 'PM'
    }

    if(hour==12){
      // 시간이 12면 변환 후 그대로 12 
      cvHour = hour
    } else {
      // 그외의 케이스는 12로 나눈 나머지값을 시간값으로 저장
      cvHour = hour%12
    }
    //시간 자릿수가 1자리수일 경우 0추가
    cvHour = CommonUtil.zeroPad(String(cvHour),2)
    
    // HHmmAM 형식 변환
    const res = (cvHour) + min + str
    return res
  }

  // HHmm시간 형식으로 변환
  static convertHHmm(timeObj: { HH: string, mm: string, part : string }) { 

    let hours

    if(timeObj.part == "AM" && timeObj.HH =="12"){
      hours = 0
    }else if(timeObj.part == "PM" && timeObj.HH !== "12"){
      hours = parseInt(timeObj.HH)+12
    }else {
      hours = parseInt(timeObj.HH)
    }
    
    if(hours<10){
      hours = "0"+String(hours)
    }

    const res = (hours)+timeObj.mm

    return res
  }

  //숫자만 추출
  static extractNumber(str:string){
    try {
      return str.replace(/[^0-9]/g, '');
    } catch (e) {
      return str;
    }
  }

  //3자리 단위 콤마 표시
  static addComma(str : string){
    if(!Number(str)){	//숫자가 아닐때에만
      str = this.extractNumber(String(str));
    }else{
      str = String(str);
    }
    try {
      return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    } catch (e) {
      return str;
    }
  }

  // latlng 좌표간 거리계산 
  static distance(lat1 :any, lon1:any, lat2:any, lon2:any, unit:string) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      let radlat1 = Math.PI * lat1/180;
      let radlat2 = Math.PI * lat2/180;
      let theta = lon1-lon2;
      let radtheta = Math.PI * theta/180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      return dist;
    }
  }
  
  /**
   * 휴대폰번호 유효성 체크
   * 01,05로 시작하는 숫자9자리이상은 정상 번호로 체크
   */
   static isValidMoblNum(value: string) {
    if(value == '01000000000'){
      return false;
    }
    //전화번호가 15로 시작하는 경우를 제외하고는 앞에 0을 붙여서 확인 ex, 1022334455 이면 통과 (앞에 0만 빠진 휴대폰 번호)
    if(typeof value == 'string' && value.charAt(0) == "1"){
      if(value.charAt(0) == "1" && value.charAt(1) != "5"){
        value = '0'+value;
      }
    }
    return /^0([1|5])[0-9]{7,}/.test(value);
  }

  //기본 휴대폰 번호 포멧 체크
  static isValidPhoneNumber(phoneNumber: string){
    let regPhone = /^0([1|5])?([0|1|6|7|8|9])?([0-9])?([0-9]{3,4})?([0-9]{4})$/;

    if(this.isEmpty(phoneNumber)){
      return false;
    }

    return regPhone.test(phoneNumber);

  }

  //전화번호 포멧팅 & 마스킹 처리
  static phoneFormatter(num: string, type: any) {
    var formatNum = '';
    try {
      if (num.length == 11) {
        if (type == 0) {
          formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
        } else {
          formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
      } else if (num.length == 8) {
        formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
      } else if (num.length == 12) {
        formatNum = num.replace(/(\d{3})(\d{5})(\d{4})/, '$1-$2-$3');
      } else {
        if (num.indexOf('02') == 0) {
          if(num.length == 9){
            formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
          }else{
            if (type == 0) {
              formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
            } else {
              formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
            }
          }
        } else {
          if (type == 0) {
            formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
          } else {
            formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
          }
        }
      }
    } catch (e) {
      formatNum = num;
      console.log(e);
    }
    return formatNum;
  }

  //특수문자 제외 처리
  static addrDetailChk1(dtlAddr:string) {
    const expText = /[?#$&\\+"]/gi;
    if (expText.test(dtlAddr) === true) {
      if(isMorpheus()){
        M.pop.instance('특수문자를 입력할 수 없습니다');
      }else{
        alert('특수문자를 입력할 수 없습니다')
      }
      return dtlAddr.replace(expText, '');
    }
  }
}