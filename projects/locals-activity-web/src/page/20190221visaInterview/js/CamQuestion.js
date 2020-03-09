import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import {myToast} from "../../../js/util"
import build from "./quest"

let _question = [
  {
    title:`提交的摄影照片分小图及大图两种规格，短边和长边需为多少像素？ [单选题] `,
    isMultiple:false,
    question:`a.小图800*1200px，大图1440*960px <span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.小图800*1280px，大图1440*960px<br>
    c.小图960*1280px，大图1440*960px<br>
    d.小图800*1200px，大图1280*960px
    `,
    score:5,
    answer:"a"
  },
  {
    title:`2. 提交的摄影照片分小图及大图两种规格，照片大小限定为多少？ [单选题] （5分）`,
    isMultiple:false,
    question:`a.小图100KB，大图800KB<br>
    b.小图200KB，大图1M—2M<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.小图300KB，大图2M—3M<br>
    d.小图200KB，大图5M    
    `,
    score:5,
    answer:"b"
  },
  {
    title:`3. 请问要求提交的摄影照片关于比例的规定限制是？[单选题] （5分）`,
    isMultiple:false,
    question:`a.3:1比例<br>
    b.3:2比例<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.3:5比例<br>
    d.5:7比例
    `,
    score:5,
    answer:"b"
  },
  {
    title:`4. 使用广角镜头拍摄时，广角端不得超过多少毫米？（等效35m相机焦距） [单选题] （5分）`,
    isMultiple:false,
    question:`a.16mm<br>
    b.18mm<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    C.20mm<br>
    d.24mm
    `,
    score:5,
    answer:"b"
  },
  {
    title:`5. 提交审核用的小尺寸图片的色彩空间应为？ [单选题] （5分）`,
    isMultiple:false,
    question:`a.sRGB<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.AdobeRGB<br>
    c.CMYK<br>
    d.Lab
    `,
    score:5,
    answer:"a"
  },
  {
    title:`6. 每套房源提交的横图或竖图数量不得少于？ [单选题] （5分）`,
    isMultiple:false,
    question:`a.一房10张，二房20，三房30，四房40<br>
    b.一房20张，二房30，三房40，四房50<br>
    c.一房20张，二房24，三房30，四房34<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.一房10张，二房15，三房20，四房25
    `,
    score:5,
    answer:"c"
  },
  {
    title:`7. 为了能满足各大平台对于房源照片的要求，需要提交的照片有 [单选题] （5分）`,
    isMultiple:false,
    question:`a.横竖图各一套<br>
    b.大横图一套<br>
    c.小横图一套，小竖图一套，大横图一套<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.小横图及大横图各一套
    `,
    score:5,
    answer:"c"
  },
  {
    title:`8. 摄影师通过何种途径提交房源摄影照片进行审核？ [单选题] （5分）`,
    isMultiple:false,
    question:`a.发电子邮件到路客总部摄影的邮箱<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.上传到百度网盘并分享给筹建BU<br>
    c.发邮件或上传网盘都可以<br>
    d.微信传给路客总部摄影
    `,
    score:5,
    answer:"a"
  },
  {
    title:`9. 在未得到Locals路客精品民宿方面允许的情况下，摄影师可以自行决定的操作有？ [单选题] （5分）`,
    isMultiple:false,
    question:`a.将拍摄图片传播给第三方<br>
    b. 将拍摄图片的版权卖给第三方<br>
    c. 将拍摄图片许可给第三方使用<br>
    d. 将拍摄的图片进行后期处理<span class="red" v-if="this.secordAnswer">[正确答案]</span>  
    `,
    score:5,
    answer:"d"
  },
  {
    title:`10. 摄影师在拍摄后多少小时内需要向Locals交付摄影成果？[单选题] （5分）`,
    isMultiple:false,
    question:`a. 24<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b. 36<br>
    c. 48<br>
    d. 72
    `,
    score:5,
    answer:"a"
  },
  {
    title:`11. 房源照片提交审核时，应当注意文件夹名称必须包含的内容有？[多选题] （5分）`,
    isMultiple:true,
    question:`a.邮件主题：房源编号+城市+摄影师姓名+摄影师微信号<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.邮件主题：房源编号+城市+照片审核<br>
    c.附件文件夹内容：横图、竖图、大横图<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.附件文件夹内容：不必分类
    `,
    score:5,
    answer:["a","c"]
  },
  {
    title:`12. 房源照片在进行后期调整时需要进行的处理项有？[多选题] （5分）`,
    isMultiple:true,
    question:`a.校正镜头畸变影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.去除图片暗角影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.去除紫边、绿边影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.还原室内真实色彩影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:5,
    answer:["a","b","c","d"]
  },
  {
    title:`13. 拍摄时需要注意的事项有？[多选题] （5分）`,
    isMultiple:true,
    question:`a.使用RAW格式拍摄影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.使用额外的闪光灯进行补光影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.使用三脚架，并且注意注意构图的横平竖直，保持画面干净整洁影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.使用广角镜头拍摄大环境空间影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:5,
    answer:["a","b","c","d"]
  },
  {
    title:`14. 房源拍摄时需要注意必须拍摄内容有哪些？[多选题] （5分）`,
    isMultiple:true,
    question:`a.每一个功能空间大场景、中景及局部特写影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.品牌指定必拍的VI物资影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.室外社区环境及人文影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.只需要拍摄房源内部照片
    `,
    score:5,
    answer:["a","b","c"]
  },
  {
    title:`15. 提交审核的摄影照片中不允许出现的有？[多选题] （5分）`,
    isMultiple:true,
    question:`a.高光区域过曝，色彩失真影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.画面模糊不清，画面全部在焦外影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.皱巴巴毫无品质感的床品影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.镜子中的摄影师影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    `,
    score:5,
    answer:["a","b","c","d"]
  },
  {
    title:`16. 在拍摄卧室床品时，符合拍摄要求的是？[多选题] （5分）`,
    isMultiple:true,
    question:`a.纯色床品+装饰抱枕影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.带有花色的床品+装饰抱枕<br>
    c.房源备有一条床尾搭巾，可以根据画面效果灵活运用影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.纯色床品，无配搭装饰抱枕
    `,
    score:5,
    answer:["a","c"]
  },
  {
    title:`17. 下列哪种情况摄影师可以拒绝拍摄？[多选题] （5分）`,
    isMultiple:true,
    question:`a.房源现场未打扫完毕影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.床品搭配不齐备，物资摆放不到位影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.房东特殊的拍摄需求（如江景、夜景）<br>
    d.房源摆场后落地验收不合格影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    
    `,
    score:5,
    answer:["a","b","d"]
  },
  {
    title:`18. 下列物品中哪些属于房源必拍内容？[多选题] （5分）`,
    isMultiple:true,
    question:`a. 路客品牌VI物资影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.茶具、零食影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.小米品牌电饭煲、热水壶、冰箱内配置物资影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.浴巾影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:5,
    answer:["a","b","c","d"]
  },
  {
    title:`19. 如果在拍摄房源时候遇到大光比情况，一般采取以下哪种措施？[多选题] （5分）`,
    isMultiple:true,
    question:`a. 使用HDR功能影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b. 使用包围曝光功能影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c. 使用慢门拍摄<br>
    d. 使用大光圈拍摄
    `,
    score:5,
    answer:["a","b"]
  },
  {
    title:`20. 如果房间内有投影仪的话，摄影师需要怎样处理以达到最好效果？[多选题] （5分）`,
    isMultiple:true,
    question:`a. 以客厅场景拍摄为主，不必要将投影仪调至投射状态<br>
    b.必须使投影仪处于向布幕投射工作状态影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c. 使用三脚架影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d. 关掉会影响投影效果的灯光影师线<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:5,
    answer:["b","c","d"]
  }
]

//拼接数据格式
// s1: {
//   fields: [
//     {
//       type: 'select',
      // label: '1. Locals精品民宿应符合什么样的审美方向？ [单选题] *(2分)',
      // model: 'q1',
      // values: _option
//     }
//   ],
// },


let _template = `<div class="question-modal ">
                    <div class="p-1rem">
                      <h1>Locals签约摄影师线上考核</h1>
                      <h2>提示：加油呦！达到100分你才能成为一名LOCALS的合格摄影师。</h2>
                      ${build(_question,"html")}
                    </div>
                    <div class="vue-dialog-buttons">
                      <button type="button" @click="clickChild" class="vue-dialog-button" style="flex: 1 1 100%;">提交</button>
                    </div>
                  </div>
                  `;

export default {
    name : "CamQuestion",
    components: {
      "vue-form-generator": VueFormGenerator.component
    },
    methods: {
      clickChild(){
        let score = build(_question,"data",this.model)
        if(score){
          this.secordAnswer = true;
          (score >= 100) ? this.$emit("click-child",score) : myToast(`当前分数${score}，需要到100分才通过。麻烦调整一下，再提交`)
        }
      }
    },
    data () {
      let _schema = build(_question,"schema")
      return Object.assign({
        model: {},
        secordAnswer: false,
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true
        }
      },_schema)
    },
    template: _template
}
