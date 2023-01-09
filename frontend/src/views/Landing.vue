<template>
  <div>
    랜딩 페이지 (리소스 업데이트 진행)
  </div>
</template>

<script>
import CommonUtil from "@/utils/CommonUtil";

export default {
  name: "Landing",
  components: {},
  data() {
    return {
      
    };
  },
  async mounted() {
    if(isMorpheus()){
      if(!CommonUtil.isEmpty(M.data.storage("Vuex"))){
        this.$store.replaceState(M.data.storage("Vuex"));
      }
    }

    this.appStart();
  },
  methods : {
    async appStart(){
      console.log('appStart');

      if(isMorpheus()){
        if(M.info.app('manifest.resource.target') === 'doc'){
        //일단 에러 나서 주석
          //인터넷이 연결이 되어 있으면
          await this.resourceUpdate();
          this.$router.replace("/login");
        }else{
          this.$router.replace("/login");
        }
      }else{
        this.$router.replace("/login");
      }
    },
    resourceUpdate() {
      return new Promise((resolve, reject) => {
        // TODO: 리소스 업데이트 이후 정책 확인 필요
        M.net.res.check({
          callback: function (status, info) {
            if (status !== 'IS_RESOURCE_UPDATE') {
              if(status == "FORCED_APP_UPDATING"){
                M.pop.alert({
                  title: '알림',
                  message: '앱을 업데이트해야 합니다.',
                  buttons: ['취소', '확인'],
                  callback: function (index) {
                    if (index == 1) {
                      if(wnIf.device == DT_ANDROID){
                        M.apps.store('mcore.edu.sample');
                      }else{
                        M.apps.store('1111111111');
                      }
                    } else {
                      M.sys.exit();
                    }
                  }
                });
                reject();
              }else{
                if(info.errorCode == '905') {
                  // 리소스 배포 내역이 없는 경우 905 발생
                  // M.pop.alert('리소스 업데이트 내역이 존재하지 않습니다.');
                  resolve(true);
                  return;
                }else{
                  M.pop.alert({
                    title: '알림',
                    message: 'errorcode: ' + info.errorCode + '\n' + info.errorMessage,
                    buttons: ['취소', '확인'],
                    callback: function (index) {
                      if (index == 1) {
                        M.net.res.retry();
                      } else {
                        M.sys.exit();
                      }
                    }
                  });
                  reject();
                }
              }
            }
            if (info.update) {
              // 업데이트 가능한 경우
              M.net.res.update({
                finish: function (status, info, option) {
                  switch (status) {
                    // 리소스 업데이트 성공
                    // 리소스 업데이트 성공 And Refresh
                    case 'SUCCESS':
                    case 'SUCCESS_AND_REFRESH':
                      // 업데이트 시 페이지를 리로드해야한다.
                      location.reload();
                      break;
                      // 앱 강제 업데이트
                    case 'FORCED_APP_UPDATING':
                      M.pop.alert({
                        title: '알림',
                        message: '앱을 업데이트해야 합니다.',
                        buttons: ['취소', '확인'],
                        callback: function (index) {
                          if (index == 1) {
                            if(wnIf.device == DT_ANDROID){
                              M.apps.store('mcore.edu.sample');
                            }else{
                              M.apps.store('1111111111');
                            }
                          } else {
                            M.sys.exit();
                          }
                        }
                      });
                      break;
                      // 라이센스 체크 에러
                    case 'LICENSE_IS_NOT_EXISTENCE':
                      // 라이센스 무결성 회손
                    case 'BROKEN_INTEGRITY_OF_LICENSE':
                      // 라이센스 기간 만료
                    case 'EXPIRED_LICENSE':
                      M.pop.alert({
                        title: '알림',
                        message: '라이센스 에러입니다.',
                        buttons: ['취소', '확인'],
                        callback: function (index) {
                          if (index == 1) {
                            M.net.res.retry();
                          } else {
                            M.sys.exit();
                          }
                        }
                      });
                      break;
                      // 설치 메모리 부족
                    case 'INSUFFICIENT_MEMORY':
                      M.pop.alert({
                        title: '알림',
                        message: '설치 메모리가 부족합니다.',
                        buttons: ['취소', '확인'],
                        callback: function (index) {
                          if (index == 1) {
                            M.net.res.retry();
                          } else {
                            M.sys.exit();
                          }
                        }
                      });
                      break;
                      // 외장 메모리 카드 사용 오류
                    case 'EXT_MEM_NOT_AVAIL':
                      M.pop.alert({
                        title: '알림',
                        message: '외장 메모리 오류입니다.',
                        buttons: ['취소', '확인'],
                        callback: function (index) {
                          if (index == 1) {
                            M.net.res.retry();
                          } else {
                            M.sys.exit();
                          }
                        }
                      });
                      break;
                      // UNDEFINED ERROR
                    default:
                      M.pop.alert({
                        title: '알림',
                        message: '알 수 없는 오류입니다.',
                        buttons: ['취소', '확인'],
                        callback: function (index) {
                          if (index == 1) {
                            M.net.res.retry();
                          } else {
                            M.sys.exit();
                          }
                        }
                      });
                      break;
                  }
                },
                progress: function (total, read, remain, percentage, option) {
                  console.log('** progress', total, read, remain, percentage);
                  // var progressBarWidth = Math.max(Math.min(percentage, 100), 0) + "%";
                  // $(".progress-bar").css("width", progressBarWidth);
                  // $(".progress-percent").html(percentage + '%');
                },
                error: function (errCode, errMsg, option) {
                  var callback = M.response.on(() => {}).toString();
                  M.execute("addLog", "** error : "+ errCode+ errMsg, callback);
                  M.pop.alert({
                    title: '알림',
                    message: '알 수 없는 오류입니다.',
                    buttons: ['취소', '확인'],
                    callback: function (index) {
                      if (index == 1) {
                        M.net.res.retry();
                      } else {
                        M.sys.exit();
                      }
                    }
                  });
                }
              });
            } else {
              // 업데이트가 없는 경우 (최신버전인 경우)
              resolve(true)
            }
          }
        });

      })
    },
  }
};
</script>
