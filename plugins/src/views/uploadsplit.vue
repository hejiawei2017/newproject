<template>
  <div>
    <el-tooltip
      class="item"
      effect="dark"
      :content="`支持扩展名：${acceptFiles}`"
      placement="bottom-start"
    >
      <el-button id="browseButton" type="primary" icon="el-icon-upload2">请选择文件</el-button>
    </el-tooltip>
    <em>{{ basicForm.fileName }}</em>
    <div v-if="fileRawList.length">
      <el-table :data="fileRawList" class="d2-mt-10 d2-mb-10">
        <el-table-column label="文件名" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.status === -1">正在计算MD5</span>
            <span v-if="scope.row.status === 1 && scope.row.percent === 0">MD5计算完成，准备上传</span>
            <span v-if="scope.row.status === 4" style="color: brown">上传失败</span>
            <span v-if="scope.row.status === 5" style="color: chartreuse">已上传</span>
            <el-progress
              v-if="scope.row.percent || scope.row.percent === 0"
              :text-inside="true"
              :stroke-width="20"
              :percentage="scope.row.percent"
              :v-if="
                scope.row.status === 2 ||
                  (scope.row.status === 1 && scope.row.percent > 0)
              "
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button :disabled="uploading" type="danger" @click="uploadStart()">开始上传</el-button>
    </div>
  </div>
</template>
<script>
// plupload参数文档：http://www.phpin.net/tools/plupload/
import plupload from "plupload/js/plupload.full.min.js";
import FileMd5 from "@/common/file-md5.js";

let getGuid = function(len, radix) {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
};

export default {
  name: "Plupload",
  props: {
    // 文件上传类型限制
    acceptFiles: {
      type: String,
      default: ".png,.jpg,.bmp,.doc,.docx,.xls,.xlsx,.pdf,.rar,.zip,.mp4,.txt"
    },
    bizType: {
      type: String,
      default: ""
    },
    fileList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      basicForm: {},
      fileRawList: [],
      uploading: false
    };
  },
  watch: {},
  mounted() {
    this.pluploadInit();
  },
  methods: {
    pluploadInit() {
      var vm = this;
      var uploader = new plupload.Uploader({
        browse_button: "browseButton",
        url: "http://10.10.104.3/gtcommtool/do/commtoolvideo/fileup",
        chunk_size: "2MB",
        multipart: true, // 为true时将以multipart/form-data
        max_retries: 1, // 当发生plupload.HTTP_ERROR错误时的重试次数，为0时表示不重试
        multi_selection: false, // 是否可以在文件浏览对话框中选择多个文件
        filters: {
          mime_types: [{ extensions: vm.acceptFiles.replace(/\./g, "") }],
          prevent_duplicates: true, // 不允许选取重复文件
          max_file_size: "10240mb" // 最大只能上传400kb的文件
        },
        headers: {
          Accept: "application/json"
        },
        init: {
          BeforeUpload(up, file, arg) {
            // 上传时的附加参数，以键/值对的形式传入

            up.setOption("multipart_params", {
              type: file.type,
              guid: getGuid(16, 16),
              id: getGuid(8, 16),
              lastModifiedDate: file.lastModifiedDate,
              md5value: file.md5,
              size: file.size
            });
          },
          UploadProgress(uploader, file) {},
          FileFiltered(up, files) {
            // console.log('FileFiltered', up, files)
          },
          FilesAdded(up, files) {
            console.log("FilesAdded", files);
            vm.fileRawList.push(...files);
            if (vm.fileRawList.length > vm.limit) {
              vm.deleteFile(vm.fileRawList[0]);
            }
            files.forEach(f => {
              f.status = -1;
              FileMd5(f.getNative(), (e, md5) => {
                f["md5"] = md5;
                f.status = 1;
              });
            });
          },
          FilesRemoved(upp, files) {
            vm.uploading = false;
          },
          FileUploaded(up, file, info) {
            if (info.status === 200) {
              console.log("FileUploaded", info.response);
              const { path } = JSON.parse(info.response).data;
              file.url = path;
              vm.up.refresh();
              vm.$emit("onChange", vm.fileRawList);
            }
          },
          UploadComplete(up, files) {
            vm.uploading = false;
            console.log("UploadComplete");
          },
          Error(up, args) {
            vm.uploading = false;
          }
        }
      });
      uploader.init();
      this.up = uploader;
    },
    deleteFile(row) {
      console.log(this.fileRawList.indexOf(row));
      this.fileRawList.splice(this.fileRawList.indexOf(row), 1);
      // var file = this.up.getFile(row.id);
      row.url &&
        this.$emit(
          "onChange",
          this.fileRawList.filter(item => {
            return item.url;
          })
        );
    },
    uploadStart() {
      this.uploading = true;
      this.up.start();
    }
  }
};
</script>
