<template>
  <div class="view-images" v-loading="loading">
    <el-row style="display: none">
      <el-col :span="18">
        <el-row v-for="item in fileList" :key="item.name" class="url-item">
          <el-input
            type="input"
            :rows="2"
            placeholder="上传后地址"
            v-model="item.downLoadUrl"
          >
          </el-input>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-upload
          ref="uploadfile"
          style="margin-left: 10px"
          class="upload-demo"
          action="/uploadfromfront"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-success="onSuccess"
          multiple
          :limit="limit"
          :with-credentials="true"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PBG"
        >
          <el-button size="small" type="primary">点击上传图片</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <div id="threesixty"></div>
  </div>
</template>

<script>
import ThreeSixty from '@mladenilic/threesixty.js';

export default {
  data() {
    return {
      loading: false,
      limit: 100,
      downLoadUrl: 'http://10.10.104.3:80/downloadfromfront/',
      fileList: [
        { name: '1.png' },
        { name: '2.png' },
        { name: '3.png' },
        { name: '4.png' },
        { name: '5.png' },
        { name: '6.png' },
        { name: '7.png' },
        { name: '7.png' },
        { name: '9.png' },
        { name: '10.png' },
        { name: '11.png' },
        { name: '12.png' },
        { name: '13.png' },
        { name: '14.png' },
        { name: '15.png' },
        { name: '16.png' },
        { name: '17.png' },
        { name: '18.png' },
        { name: '19.png' },
        { name: '20.png' },
        { name: '21.png' },
        { name: '22.png' },
        { name: '23.png' },
        { name: '24.png' },
        { name: '25.png' },
        { name: '26.png' },
        { name: '27.png' },
        { name: '28.png' },
        { name: '29.png' },
        { name: '30.png' },
        { name: '31.png' },
        { name: '32.png' },
        { name: '33.png' },
        { name: '34.png' },
        { name: '35.png' },
        { name: '36.png' },
        { name: '37.png' },
        { name: '38.png' },
        { name: '39.png' },
        { name: '40.png' },
        { name: '41.png' },
        { name: '42.png' },
        { name: '43.png' },
        { name: '44.png' },
        { name: '45.png' },
        { name: '46.png' },
        { name: '47.png' },
        { name: '48.png' },
        { name: '50.png' },
        { name: '51.png' },
        { name: '52.png' },
      ],
      threesixty: null,
    };
  },
  methods: {
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeUpload() {
      this.loading = true;
    },
    onSuccess(response, file, fileList) {
      this.fileList = fileList.filter((item) => {
        item.downLoadUrl = this.downLoadUrl + item.name;
        return item.name != 'testitem157';
      });
      this.initThreesixty();
    },
    initThreesixty() {
      let arrImg = [];
      let index = 0;
      let vm = this;
      function loadImage() {
        let image = new Image();
        image.src = vm.fileList[index].downLoadUrl;
        image.onload = function () {
          arrImg.push(image.src);
          if (index < vm.fileList.length - 1) {
            index++;
            loadImage();
          } else {
            vm.threesixty = new ThreeSixty(
              document.getElementById('threesixty'),
              {
                image: arrImg,
                prev: document.getElementById('prev'),
                next: document.getElementById('next'),
              }
            );
            vm.loading = false;
          }
        };
      }
      loadImage();
    },
  },

  mounted() {
    // this.threesixty.play();
    this.onSuccess(null, null, this.fileList);
  },
};
</script>

<style>
.url-item + .url-item {
  margin-top: 10px;
}
.el-upload-list {
  display: none;
}
.view-images {
  width: 1000px;
  margin: 0 auto;
}
#threesixty {
  border: 1px solid #ccc;
  margin-top: 30px;
  width: 1200px !important;
  height: 500px !important;
}
</style>
