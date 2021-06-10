<template>
  <div class="drag">
    <div
      class="drag-wrap"
      ref="drag-wrap"
      @mousedown="handleMousedown"
      @click="handleClick"
    >
      <div class="drag-icon">
        <i class="kefu-svg iconfont icon-kefu"></i>
      </div>
      在线咨询
    </div>

    <div v-show="showModel" class="drag-model animate__animated" :class="{ animate__fadeInBottomRight: showModel }">
      <template>
        <div class="my-modal-title">
          <div class="kefu-svg-box">
            <i class="kefu-svg iconfont icon-kefu" ></i>
          </div>
          <span class="my-modal-title-text">在线咨询</span>
          <div class="my-modal-title-close">
            <i class="my-modal-title-close-i" @click="hideModal"></i>
          </div>
        </div>
        <div ref="my-modal-body" class="my-modal-body">
          <div v-for="(item,index) in contentList" :key="index" class="content-item">
            <div class="my-modal-body-content" :class="{kefu: item.kefu, kehu: item.kehu}">
              <span>{{item.text}}</span>
            </div>
          </div>
        </div>
        <div class="my-modal-footer">
          <input
            ref="modal-input"
            type="text"
            v-model="value"
            class="my-modal-footer-input"
            placeholder=" 请输入消息"
            @keyup.enter="handleSendContent"
          />
          <button class="my-modal-footer-btn" @click="handleSendContent">发送</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "DragService",
  data() {
    return {
      current: 0,
      value: "",
      showModel: false,
      contentList: [
        { text: '你好',kefu: true},
      ]
    };
  },
  methods: {
    handleClick() {
      if (this.current > 5) {
        return;
      }
      this.showModel = !this.showModel;
      if (this.showModel) {
        this.$nextTick(()=>{
          this.$refs["modal-input"].focus();
        })
      }
      console.log("click");
    },
    handleMousedown(e) {
      this.current = 0;
      // 这个助手方法下面会用到，用来获取 css 相关属性值
      const getAttr = (obj, key) => {
        return obj.currentStyle
          ? obj.currentStyle[key]
          : window.getComputedStyle(obj, false)[key];
      };
      const target = e.target;
      target.style.transition = "";
      const currentX = e.clientX;
      const currentY = e.clientY;
      const left = parseInt(getAttr(target, "left"));
      const top = parseInt(getAttr(target, "top"));
      const w = document.documentElement.clientWidth - target.offsetWidth;
      const h = document.documentElement.clientHeight - target.offsetHeight;
      document.onmousemove = (event) => {
        this.current = this.current + 1;
        // 鼠标移动时计算每次移动的距离，并改变拖拽元素的定位
        const disX = event.clientX - currentX;
        const disY = event.clientY - currentY;
        let clientLeft = left + disX;
        let clientTop = top + disY;
        if (clientLeft <= 0) clientLeft = 0;
        if (clientTop <= 0) clientTop = 0;
        if (clientLeft >= w) clientLeft = w;
        if (clientTop >= h) clientTop = h;
        target.style.left = `${clientLeft}px`;
        target.style.top = `${clientTop}px`;
        // 阻止事件的默认行为，可以解决选中文本的时候拖不动
        return false;
      };
      // 鼠标松开时，拖拽结束
      window.onmouseup = () => {
        document.onmousemove = null;
        window.onmouseup = null;
        e.onmousemove = null;
        e.onmouseup = null;
        if (this.current < 5) {
          return;
        }
        target.style.transition = "all .2s";
        if (target.offsetLeft > w / 2) {
          target.style.left = `${w}px`;
        } else {
          target.style.left = `0`;
        }
      };
    },
    hideModal() {
      this.showModel = false;
    },
    handleSendContent() {
      if(!this.value) return
      this.contentList.push({ text: this.value,kehu: true})
      this.$nextTick(()=>{
        const h = this.$refs['my-modal-body'].scrollHeight
        this.$refs['my-modal-body'].scrollTo(0,h)
      })
      this.value = ''
    }
  },
};
</script>

<style scoped lang="scss">
@import "@/styles/_handle.scss";
.drag {
  .drag-model {
    position: fixed;
    bottom: 100px;
    right: 200px;
    width: 625px;
    font-weight: 400;
    background: #ffffff;
    box-shadow: 0px 25px 21px 0px rgba(90, 90, 90, 0.1);
    border-radius: 10px;
    overflow: hidden;
    z-index: 9999;
    .my-modal-title {
      display: flex;
      align-items: center;
      height: 60px;
      @include background_color("background_color1");
      .my-modal-title-text {
        font-size: 16px;
        color: #fefeff;
      }
      .my-modal-title-close {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 100%;
        padding-right: 30px;
        .my-modal-title-close-i {
          width: 12px;
          height: 3px;
          background: #fff;
          cursor: pointer;
          &::before {
            content: "";
            display: inline-block;
            padding: 6px;
          }
        }
      }
    }
    .my-modal-body {
      padding: 20px;
      height: 200px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
      }
      &::-webkit-scrollbar-button {
        display: none;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: #dddfe0;
      }
      &::-webkit-scrollbar-track {
        width: 7px;
        height: 7px;
      }
      &::-webkit-scrollbar-track-piece {
        background: transparent;
      }
      .content-item {
        overflow: hidden;
        margin-bottom: 10px;
      }
      .my-modal-body-content {
        display: flex;
        align-items: center;
      }
      .kefu,
      .kehu {
        border-radius: 8px;
        background: #fff;
        margin-right: 16px;
        padding: 8px 18px;
        width: 50%;
        word-break: break-all;
        border: 1px solid #fff;
        @include border_color("border_color1");
      }
      .kefu {
        justify-content: flex-start;
        float: left;
      }
      .kehu {
        justify-content: flex-end;
        float: right;
      }
    }
    .my-modal-footer {
      display: flex;
      align-items: center;
      height: 100px;
      padding-right: 30px;
      background: #fbfbfb;
      .my-modal-footer-input {
        flex: 1;
        height: 100%;
        padding-left: 30px;
        border: none;
        outline: none;
        background: #fbfbfb;
      }
      .my-modal-footer-btn {
        width: 76px;
        height: 28px;
        border: none;
        font-size: 16px;
        @include background_color("background_color1");
        border-radius: 4px;
        outline: none;
        color: #fff;
      }
    }
  }
  .kefu-svg-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
    .kefu-svg {
      font-size: 24px;
    }
  }
}
</style>