<template>
  <script id="quill-editor" type="text/plain"></script>
</template>
<script>
import '../../../public/ueditor/ueditor.config.js';
import '../../../public/ueditor/ueditor.all.min.js';
import '../../../public/ueditor/lang/zh-cn/zh-cn.js';
import '../../../public/ueditor/ueditor.parse.js';
export default {
  name: 'ueditor',
  data() {
    return {
      editor: null
    };
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    config: {},
    maxLength: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    this.$nextTick(() => {
      let vm = this;
      this.editor = window.UE.getEditor('quill-editor', this.config);
      this.editor.addListener('ready', () => {
        //设置默认值
        console.log('ready');
        this.editor.setContent(this.value);
        //注册事件
        let doc = this.editor.body;
        let events = [('blur', 'keyup', 'mouseup', 'input')];
        events.forEach(function(type) {
          doc.addEventListener(type, function() {
            let content = vm.editor.getContent();
            console.log('doc.addEventListener', content);
            vm.$emit('input', content);
            vm.$emit('change', content);
          });
        });

        this.editor.addListener('contentchange', () => {
          let content = vm.editor.getContent();
          console.log('doc.addEventListener', content);
          vm.$emit('input', content);
          vm.$emit('change', content);
        });
      });
    });
  },
  methods: {
    getUEContent() {
      return this.editor.getContent();
    }
  },
  watch: {
    value() {
      // if (this.value.length > this.maxLength) {
      //   this.$nextTick(() => {
      //     var content = this.editor.getContentTxt();
      //     let subContent = content.substring(0, this.maxLength);
      //     this.editor.setContent(subContent);
      //     this.editor.focus(true);
      //     this.$emit('input', subContent);
      //     this.$emit('change', subContent);
      //     this.$message({
      //       message: '内容长度不能超过个字符' + this.maxLength,
      //       type: 'error',
      //       offset: 180,
      //     });
      //   });
      // }
    }
  },
  destroyed() {
    this.editor.destroy();
  }
};
</script>
