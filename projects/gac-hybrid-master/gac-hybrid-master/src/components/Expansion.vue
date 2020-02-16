<template>
    <div class="expansion">
        <div @click="changeState"  class="expansion-title" :class="{'no-ani':noAni}">
            <div :class="{'expansion-title-inner':true,active:isActive}">
                {{title||''}}
                <slot name="title"></slot>
            </div>
        </div>
        <div ref="outer" class="expansion-outer" :class="{'no-ani':noAni}">
            <div ref="content" class="expansion-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'expansion',
  props: {
    title: String,
    open: Boolean
  },
  mounted() {
    if (this.open) {
      this.noAni = true;
      this.changeState();
      setTimeout(_ => {
        this.noAni = false;
      }, 1)
    }
  },
  data() {
    return {
      noAni: false,
      isActive: false
    }
  },
  methods: {
    changeState() {
      if (this.isActive) {
        this.isActive = false;
        this.$refs.outer.style.height = '0';
      } else {
        this.isActive = true;
        this.$refs.outer.style.height = this.$refs.content.clientHeight+'px';
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    @import "~@/common/scss/base";
    .expansion {
        .expansion-title {
            padding: 0 rem(30);
            height: rem(100);
            line-height: rem(100);
            font-size: rem(32);
            font-family: PingFangSC;
            font-weight: 400;
            color: #051C2C;
            &.no-ani {
              .expansion-title-inner {
                &:before {
                  transition: none;
                }
              }
            }
            .expansion-title-inner {
                position: relative;
                border-bottom: 1px solid #EEEEEE;
                &:before {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    margin-top: rem(-8);
                    width: rem(16);
                    height: rem(16);
                    border-top: rem(3) solid rgba(116,122,134,1);
                    border-right: rem(3) solid rgba(116,122,134,1);
                    transform: rotate(135deg);
                    transition: .3s transform ease-in-out;
                }
                &.active:before {
                    transform: rotate(-45deg);
                }
            }
        }
        .expansion-outer {
            overflow: hidden;
            transition: .3s height ease-in-out;
            height: 0;
        }
        .expansion-outer.no-ani {
            transition: none;
        }
        .expansion-content {
            padding: rem(20) rem(25);
            background-color: #F7F8F9;
            font-size: rem(28);
            font-family: PingFangSC;
            font-weight: 400;
            color: #747A86;
            line-height: rem(60);
        }
    }
</style>
