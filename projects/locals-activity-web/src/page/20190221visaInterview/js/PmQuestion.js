import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import {myToast} from "../../../js/util"
import build from "./quest"

let _question = [
  {
    title:`1. Locals精品民宿速优项目硬装筹建时长为多少天？ [单选题] `,
    isMultiple:false,
    question:`a.14天<br>
    b.15天<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.16天<br>
    d.17天
    `,
    score:6,
    answer:"b"
  },
  {
    title:`2. 项目筹建阶段软装物资到货时，项目经理应（）？ [单选题] `,
    isMultiple:false,
    question:`a.根据软装物资到货情况，及时更新软装物资到货清单<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.软装物资到货，快递不上楼时拒收<br>
    c.软装物资到货，发现货物破损时，置之不理<br>
    d.软装物资到货，发现货物与软装清单不符时，置之不理
    `,
    score:6,
    answer:"a"
  },
  {
    title:`3. 项目交底后，施工单位项目经理需要在多久内上传报价清单？ [单选题] `,
    isMultiple:false,
    question:`a.42小时内<br>
    b.36小时内<br>
    c.24小时内<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.12小时内
    `,
    score:6,
    answer:"c"
  },
  {
    title:`4. 厨房橱柜上方插座位最少几位？[单选题] `,
    isMultiple:false,
    question:`a.5位<br>
    b.4位<br>
    c.3位 <br>
    d.2位<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:6,
    answer:"d"
  },
  {
    title:`5. 烟雾传感器安装部位应该在？ [单选题] `,
    isMultiple:false,
    question:`a.客厅<br>
    b.厨房<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.餐厅<br>
    d.卧室
    `,
    score:6,
    answer:"b"
  },
  {
    title:`6.关于项目安装果加智能门锁时间 ，下面说法正确的是？[单选题] `,
    isMultiple:false,
    question:`a.项目进场后，应第一时间下单采购及安装果加门锁<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.项目施工周期内预约安装均可，不超筹建时长即可<br>
    c.项目摆场验收前安装即可<br>
    d.项目上线运营前安装即可
    `,
    score:6,
    answer:"a"
  },
  {
    title:`7. 若发现房间门锁为球型锁，则应该？ [单选题]`,
    isMultiple:false,
    question:`a.检查是否可以正常使用，若可正常使用则留用<br>
    b.球型锁不美观，更换成执手锁<br>
    c.破坏球型锁的反锁功能，然后在内部加装插销锁<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.不用处理
    `,
    score:6,
    answer:"c"
  },
  {
    title:`8. 安防系统安装，说法错误的是？ [单选题] `,
    isMultiple:false,
    question:`a.烟雾报警器须安装在厨房<br>
    b.燃气报警器安装位置与灶具水平距离不得大于4米<br>
    c.人体传感器在卧室应优先安装在床沿边<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.空调伴侣安装于空调插座上
    `,
    score:6,
    answer:"c"
  },
  {
    title:`9. 遇到房间门陈旧且局部凹陷，应采用下面哪种办法修复？ [单选题] `,
    isMultiple:false,
    question:`a.直接更换<br>
    b.房门贴纸<br>
    c.使用原子灰修补，再油漆翻新<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.不处理，直接沿用
    `,
    score:6,
    answer:"c"
  },
  {
    title:`10. 关于卫生间洗手盆的使用，描述正确的是？ [单选题] `,
    isMultiple:false,
    question:`a.柱盆一定不能使用<br>
    b.柱盆根据新旧、外观，可选择性使用<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.必须使用带柜体的台下盆<br>
    d.必须使用带柜体的台上盆
    `,
    score:6,
    answer:"b"
  },
  {
    title:`11. 项目经理在摆场验收前应做好哪些准备工作 `,
    isMultiple:true,
    question:`a.项目硬装质量进行自检，不符合产品标准的部分需整改到位<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.清点软装到货物品，确保物资到货齐全<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c. 开荒保洁完成，达到入住标准<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.填写四方验收单
    `,
    score:8,
    answer:["a","b","c"]
  },
  {
    title:`12. 现场交底时，项目经理应该做好下面哪些工作 `,
    isMultiple:true,
    question:`a.确认项目筹建起止时间及各关键节点时间<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.确认并签署《 Locals筹建项目施工交底》<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.与设计师确认灯位距离，需注意相关物品尺寸，如餐厅餐桌摆放位置及尺寸<br>
    d.现场确认保留家具，联系房东确认非保留家具处理方式<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:8,
    answer:["a","b","d"]
  },
  {
    title:`13. 墙面施工应注意哪些？`,
    isMultiple:true,
    question:`a.原来的旧漆表面是光面，则须用砂纸稍加摩擦，以加强新漆膜的附着力<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.刷颜色漆时，为节省时长，只刷一遍即可<br>
    c.油漆一次不能刷得太厚，不然会造成油漆流淌，看起来表来不平整<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.刷第二遍油漆一定要等第一遍油漆完全干透，不然易出现漆膜起皱的现象<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:8,
    answer:["a","c","d"]
  },
  {
    title:`14. 下面施工项目一定涉及到隐蔽工程的有哪些？`,
    isMultiple:true,
    question:`a.暗敷线缆<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.轻钢龙骨隔墙<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.卫生间蹲便器改座便器(<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.墙面翻新
    `,
    score:8,
    answer:["a","b","c"]
  },
  {
    title:`15. 项目预算出现超出原定预算时，项目经理应该如何处理？ `,
    isMultiple:true,
    question:`a.重新核对工程量清单，确认工程量数量准确<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.联系设计师，在不影响效果的情况下，尽量减少工程量<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.联系设计师，部分材料在不影响效果的情况下，是否可以变更材料<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.向上级领导反应，申请增加预算
    `,
    score:8,
    answer:["a","b","c"]
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
                      <h1>LOCALS签约项目经理考核</h1>
                      <h2>提示：加油呦！达到90分你才能成为一名LOCALS的合格签约项目经理。</h2>
                      ${build(_question,"html")}
                    </div>
                    <div class="vue-dialog-buttons">
                      <button type="button" @click="clickChild" class="vue-dialog-button" style="flex: 1 1 100%;">提交</button>
                    </div>
                  </div>
                  `;

export default {
    name : "PmQuestion",
    components: {
      "vue-form-generator": VueFormGenerator.component
    },
    methods: {
      clickChild(){
        let score = build(_question,"data",this.model)
        if(score){
          this.secordAnswer = true;
          (score >= 90) ? this.$emit("click-child",score) : myToast(`当前分数${score}，需要到90分才通过。麻烦调整一下，再提交`)
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
