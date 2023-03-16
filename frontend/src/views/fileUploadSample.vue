<template>
  <div class="content">
    <div class="scrollBox">
      <div class="ipt-wrap typeline">
        <label for="param1" class="require">param1</label>
        <input type="text" id="param1" v-model="param1" placeholder="param1 입력">
      </div>
      <div class="ipt-wrap typeline ipt-file-wr">
        <label for="linetxt1">첨부파일</label>
        <div class="file-add-btn" v-if="fileList.length < 5">
          <input v-if="!isMorpheus()" type="file" class="ipt-file-add" id="fileAddBtn" @change="onFileChange">
          <button v-else class="ipt-file-add" id="fileAddBtn" @click="selectFile"></button>
          <label for="fileAddBtn">첨부추가</label>
        </div>
        <div v-for="(file,idx) in fileList" :key="idx">
          <p class="ipt-file ellipsis">{{file.name}}</p>
          <button type="button" class="btn-icon delete block" @click="delFile(idx)">삭제</button>
        </div>
      </div>
      <div class="ipt-wrap typeline">
        <label for="">목록 썸네일 이미지</label>
        <div class="ipt-inline">
          <span>
            <input type="radio" id="writeRegist" v-model="writeRegist" name="writeRegist" value="Y">
            <label for="writeRegist">등록</label>
          </span>
          <span>
            <input type="radio" id="writeUnRegist" v-model="writeRegist" name="writeRegist" value="N">
            <label for="writeUnRegist">미등록</label>
          </span>
        </div>
        <!-- 썸네일 이미지 등록 체크하면 나오는 영역 노출 되는 요소 -->
        <div class="thumb-file" v-if="writeRegist == 'Y'">
          <div class="file-add-btn" v-if="photoPreview == null">
            <input v-if="!isMorpheus()" type="file" class="ipt-file-add" id="thumbAddBtn" capture="camera" @change="onPhotoChange($event, 'camera')">
            <button v-else class="ipt-file-add" id="thumbAddBtn" @click="selectImage"></button>
            <label for="thumbAddBtn">첨부추가</label>
          </div>
          <!-- 파일 추가 했을 경우에만 해당 영역 보임, 파일 없을 경우(썸네일 삭제 버튼(delete) 눌러도) 없앰 -->
          <div class="thumb-add">
            <div class="thumb-img-wr">
              <button type="button" class="btn-icon delete" @click="photoPreview = null"></button>
              <img :src="photoPreview">
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p class="btn-wrap">
        <button type="button" class="btn line" @click="$router.go(-1)">취소</button>
        <button type="button" class="btn" @click="writeBtn">등록</button>
      </p>
    </footer>
  </div>
</template>
<script>
export default {
  name: "fileUploadSample",
  components: {},
  props: {
  },
  data() {
    return {
      param1:'', //제목
      writeRegist:'N', //썸네일 유무

      fileList : [], //등록할 파일 리스트
      thmbnlfileUpload : null, //썸네일 파일 객체
      photoPreview: null, //썸네일 미리보기 img 경로
    };
  },
  async mounted() {
  },
  watch: {
  },
  computed : {
  },
  methods: {
    async writeBtn(){
      //썸네일 등록한다 했으나 이미지가 없을 경우 return
      if(this.photoPreview == null && this.writeRegist == 'Y'){
        this.$alert('썸네일 이미지를 등록해주세요.');
        return
      }

      if(isMorpheus()){
        let body = [];

        let uploadParams = {
          param1 : this.param1,
        };

        if(this.fileList.length > 0){
          this.fileList.forEach(file=>{
            body.push({name: "fileUpload", content: wnIf.device == DT_ANDROID ? file.fullpath : file.path, type: "FILE"});
          });
        }

        //썸네일 등록 O
        if(this.writeRegist == 'Y'){
          body.push({name: "thmbnlfileUpload", content: wnIf.device == DT_ANDROID ? this.thmbnlfileUpload.fullpath : this.thmbnlfileUpload.path, type: "FILE"});
        }else{
          //썸네일 등록 X
        }

        M.net.http.upload({
          url: `${M.info.app('manifest.network.http')[this.Define.SERVER_NAME].address}upload/addFile`,
          header: {
            "Content-type" : "multipart/form-data"
          },
          params: uploadParams,
          indicator : false,
          body: body,
          encoding : "UTF-8",
          finish : async (status, header, body, setting) => {
            console.log(status, header, body, setting);
            if(typeof body == 'string'){
              body = JSON.parse(body);
            }
            
            let rst = body.body;

            if(rst.resultCode == '200'){
              await this.$alert(`정상 등록 되었습니다.`);
            }else{
              this.$alert(rst.resultMsg);
            }
          },
          progress : (total, current) => {
            console.log(total, current);
          }
        });
      }else{
        const formData = new FormData();
        formData.append('param1', this.param1);

        if(this.fileList.length > 0){
          this.fileList.forEach(file=>{
            formData.append("fileUpload", file);
          });
        }

        //썸네일 등록 O
        if(this.writeRegist == 'Y'){
          formData.append('thmbnlfileUpload', this.thmbnlfileUpload);
        }else{
          //썸네일 등록 X
          formData.append('thmbnlfileUpload', null);
        }

        for (var pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]);
        }

        let res = await this.$fetchData({
          url: 'upload/addFile',
          method: 'POST',
          isFormData: true,
          data: formData,
        });

        console.log(res);

        let rst = res.data.body;

        if(rst.resultCode == '200'){
          await this.$alert(`정상 등록 되었습니다.`);
        }else{
          this.$alert(rst.resultMsg);
        }
      }
    },
    selectFile(){
      if(isMorpheus()){
        M.file.picker({
          type: '*/*',
          iosType: 'data',
          callback: (status, result)=>{
            console.log(status,result);
            // result = [
            //   {
            //     "path": "/mcore_temp_file/첨부파일 테스트2.pdf",
            //     "alias": "doc:///mcore_temp_file/첨부파일 테스트2.pdf",
            //     "source": "/data/data/com.kolon.fnc.mpos/files/mcore_temp_file/첨부파일 테스트2.pdf",
            //     "fullpath": "/data/data/com.kolon.fnc.mpos/files/mcore_temp_file/첨부파일 테스트2.pdf"
            //   }
            // ]
            let obj = result[0];
            obj.name = obj.path.substring(obj.path.lastIndexOf('/')+1)
            this.fileList.push(obj);
          }
        });
      }
    },
    selectImage(){
      if(isMorpheus()){
        M.file.picker({
          type: 'image/*',
          iosType: 'image',
          callback: (status, result)=>{
            console.log(status,result);
            // result = [
            //   {
            //     "path": "/mcore_temp_file/첨부파일 테스트2.pdf",
            //     "alias": "doc:///mcore_temp_file/첨부파일 테스트2.pdf",
            //     "source": "/data/data/com.kolon.fnc.mpos/files/mcore_temp_file/첨부파일 테스트2.pdf",
            //     "fullpath": "/data/data/com.kolon.fnc.mpos/files/mcore_temp_file/첨부파일 테스트2.pdf"
            //   }
            // ]
            let obj = result[0];
            obj.name = obj.path.substring(obj.path.lastIndexOf('/')+1)
            this.thmbnlfileUpload = obj;
            this.photoPreview = wnIf.device == DT_ANDROID ? this.thmbnlfileUpload.fullpath : this.thmbnlfileUpload.path;
          }
        });
      }
    },
    async onFileChange(e) {
      const file = e.target.files[0];
      // file;
      console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
      console.log(file);
      this.fileList.push(file);
    },
    async onPhotoChange(e) {

      const imageFile = e.target.files[0];
      // imageFile;
      console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
      console.log(imageFile);
      this.thmbnlfileUpload = imageFile;

      this.createImage(imageFile, (image) => {
        this.photoPreview = image;
      });
    },
    createImage(file, cb) {
      var reader = new FileReader();

      reader.onload = (e) => {
        cb(e.target.result);
      };
      reader.readAsDataURL(file);
    },
    delFile(idx){
      this.fileList.splice(idx,1);
    },
  }
};
</script>