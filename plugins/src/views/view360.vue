<template>
  <div class="view-images" v-loading="loading">
    <el-row>
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
          style="margin-left:10px"
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
import ThreeSixty from "@mladenilic/threesixty.js";

export default {
  data() {
    return {
      loading: false,
      limit: 100,
      downLoadUrl: "http://14.23.157.98:8090/downloadfromfront/",
      fileList: [{ name: "testitem157" }],
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
        return item.name != "testitem157";
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
        image.onload = function() {
          arrImg.push(image.src);
          if (index < vm.fileList.length - 1) {
            index++;
            loadImage();
          } else {
            vm.threesixty = new ThreeSixty(
              document.getElementById("threesixty"),
              {
                image: arrImg,
                prev: document.getElementById("prev"),
                next: document.getElementById("next"),
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
