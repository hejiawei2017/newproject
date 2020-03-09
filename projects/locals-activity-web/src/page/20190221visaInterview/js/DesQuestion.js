import Vue from 'vue'
import VueFormGenerator from 'vue-form-generator'
import 'vue-form-generator/dist/vfg.css'
import {myToast} from "../../../js/util"
import build from "./quest"

let _question = [
  {
    title:`1. Locals精品民宿应符合什么样的审美方向？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.符合现代审美、受年轻人欢迎和喜爱的风格。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
              b.中年人是消费主力，应该做沉稳一点的风格。<br>
              c.奢华风格，才显得有档次。<br>
              d.男孩子游客居多，应该只做男孩子喜爱的风格
    `,
    score:2,
    answer:"a"
  },
  {
    title:`2. 符合基本审美方向的要求是？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.奢华、造型复杂<br>
            b.精选、简洁、有品味<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
            c.追求潮流元素，做时尚的设计<br>
            d.重装修轻装饰
    `,
    score:2,
    answer:"b"
  },
  {
    title:`3. 一间好的民宿应该是让人住起来：舒适及有家的温暖，所以不倡导怎么样的设计？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.“样板房”式的设计方向。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
            b.墙面不做太多装饰。<br>
            c.有品质的家具，搭配简单的饰品。<br>
            d.突显空间特点，做有特色的空间。
    `,
    score:2,
    answer:"a"
  },
  {
    title:`4. 一间好的民宿也应当考虑房东需要合理的投资回报，所以不倡导怎么样的设计？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.在预算内做出好设计。<br>
    b.“过度设计”的设计方向。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.设计理念新颖能吸引游客。<br>
    d.项目周期内完成设计到落地。
    `,
    score:2,
    answer:"b"
  },
  {
    title:`5. 一间好的民宿也应当考虑后期运营及维护的问题，所以不倡导使用什么样的软装物品？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.要求整体效果精简，舒适，有品质。<br>
    b.搭配地毯能让整体氛围更好，所以设计师可以根据效果，搭配各种颜色各种材质的地毯。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.不使用易碎伤人、易脏不耐用、不便清洁维护的产品。<br>
    d.减少挂画的使用，尤其卧室床头位置。
    `,
    score:2,
    answer:"b"
  },
  {
    title:`6.对于床品的统一标配2019年有进行优化更新，目前新的标准是？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.纯色床品（非纯白）+装饰抱枕（1到3个）+搭毯／盖被（每个卧室一条）<br>
    b.纯色床品 (非纯白)+ 装饰抱枕 （1到2个）+搭毯／盖被 （每房源可配一条，建议主卧，次卧不必配）<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.纯色床品 (非纯白)+ 装饰抱枕 （1到2个）+搭毯／盖被（每个卧室一条）<br>
    d.纯色床品（非纯白）+装饰抱枕（1到3个）+搭毯／盖被（每房源可配一条，建议只在次卧配置）
    `,
    score:2,
    answer:"b"
  },
  {
    title:`7. Locals专注打造精英房东的家，注重独特的品牌魅力，与其他民宿平台的主要差异点在于？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.不计成本，只求设计效果好。<br>
    b.以设计师想法为主，打造有创意、有特色的家。<br>
    c.围绕房东的背景故事及职业，打造具有房东影子及有温度、情怀的家。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.以风格特点为主导
    `,
    score:2,
    answer:"c"
  },
  {
    title:`8. Locals提倡什么样的民宿才是有吸引力和受欢迎的民宿？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.提炼房子的“亮点”和“卖点”，打造具有特别体验、独具特色及亮点的精品民宿。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.追求设计效果，可以忽略品质。<br>
    c.用饰品，渲染出气氛，达到很好的视觉效果。<br>
    d.常规布局，客厅、餐厅、卧室等等都具备。
    `,
    score:2,
    answer:"a"
  },
  {
    title:`9. 一间让人眼前一亮的民宿，突破常规设计的关键核心是？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.遵循常规布局，满足基本需求。<br>
    b.客厅是会客区域，应该满足多人座位需求。<br>
    c.格局上进行创新，忘掉“客厅”这个概念，突出公共交流的“核心区”。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.更多体现在风格搭配上。
    `,
    score:2,
    answer:"c"
  },
  {
    title:`10. 什么样的民宿才是一间既美观又实用性强的民宿？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.符合整体设计风格并站在消费者的角度，考虑将厨房、卫生间的收纳功能设计考虑完备；<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.只要具备休息娱乐的区域就行。<br>
    c.装饰品多，视觉效果好。<br>
    d.家具品质可以一般，当是装饰品一定要好看
    `,
    score:2,
    answer:"a"
  },
  {
    title:`11. 1.5M规格的床，被芯与被套的标准尺寸是(单位：mm)？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.被芯：2000*2230、被套：2000*2300<br>
    b.被芯：1950*2250、被套：2000*2300<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.被芯：1500*2000、被套：2000*2300<br>
    d.被芯：1550*2050、被套：2000*2300
    `,
    score:2,
    answer:"b"
  },
  {
    title:`12. 1.8M规格的床，被芯与被套的标准尺寸是(单位：mm)？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.被芯：1850*2350、被套：2200*2400<br>
    b.被芯：2050*2350、被套：2200*2400<br>
    c.被芯：1800*2350、被套：2200*2400<br>
    d.被芯：2150*2350、被套：2200*2400<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:2,
    answer:"d"
  },
  {
    title:`13. 速优设计项目占路客2019年度总开发量的70% ，下列对速优项目理解有误的是？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.速优设计项目定位为常规精品类型民宿<br>
    b. 快速设计、优质落地、舒适大方、标准化精品设计民宿<br>
    c. 公共区域标准化范围内自由搭配+卧室标准化模块方案，注重细节，强化100%标准化<br>
    d. 软装不必要按照100%来源于路客生活馆选购，可其他渠道自由选配<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:2,
    answer:"d"
  },
  {
    title:`14. 新锐设计项目占路客2019年度总开发量的30% ，下列对新锐项目理解有误的是？[单选题] *(2分)`,
    isMultiple:false,
    question:`a.新锐设计项目定位为高端超精品类型民宿，允许20%个性化物资在路客生活馆以外渠道采购。<br>
    b.设计创意极佳、个性魅力独特、城市名片、标杆型精品民宿<br>
    c.体现精选之“家”的情怀，具有独特的创意个性设计，高水准的呈现设计方案及优质落地效果<br>
    d.方案与落地对比达到70%，为了更好的设计效果可以舍去一些标准化必采物资。<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:2,
    answer:"d"
  },
  {
    title:`15.验收标准分为三部分设计成果、硬装验收、软装验收，这三部分的验收要求理解错误的是？[单选题] *(2分)`,
    isMultiple:false,
    question:`a.排版及内容符合要求、详情达标、预算合理、方案与实际落地对比<br>
    b.按设计要求完成 与设计符合、质量及手工安装灯具需完成 。<br>
    c.方案与落地符合80% ，标准化物资执行100% ，软装清单与现场符合100 %<br>
    d.落地效果好，可以忽略一些验收要求<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:2,
    answer:"d"
  },
  {
    title:`16. 新锐项目软装设计概念部分，哪些是不必体现的内容？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.房源原始状况及呈现沟通保留的家具<br>
    b.围绕房东的职业和生活的需求，“核心区”和“亮点”表达清晰<br>
    c.展示各个功能空间的软装搭配方案<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.改造前后平面格局的呈现
    `,
    score:2,
    answer:"c"
  },
  {
    title:`17.新锐项目中完整的软装设计正式方案，包含的内容有？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.概念部分+各个空间软装搭配展示+厨房卫生间收纳呈现<br>
    b.概念部分+硬装改造建议+各个空间软装搭配展示<br>
    c.硬装改造建议+各功能空间软装搭配方案<br>
    d.概念部分+硬装改造建议+各个空间软装搭配展示+厨房卫生间收纳呈现<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:2,
    answer:"d"
  },
  {
    title:`18. 以下概括设计师的职能范围正确的有？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a.只需要做软装设计和跟进订制的物品部分<br>
    b.对项目软、硬装整体的设计效果及采购、改造进度负责<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.可用详细的摆场指引文件替代现场摆场<br>
    d.只负责软装部分从设计到落地，硬装不参与监管，全权由工程项目经理负责
    `,
    score:2,
    answer:"b"
  },
  {
    title:`19. Locals精品民宿项目主要分三类，分别是速优设计、新锐设计个性化、IP/行政会所。下列项目筹建时长正确的是？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a. 速优设计20天，新锐设计个性化25天，IP/行政会所30天<br>
    b. 速优设计25天，新锐设计个性化30天，IP/行政会所43天<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c. 速优设计30天，新锐设计个性化30天，IP/行政会所43天<br>
    d. 速优设计25天，新锐设计个性化30天，IP/行政会所35天
    `,
    score:2,
    answer:"b"
  },
  {
    title:`20. 项目设计费管理费需划扣或返还比例是多少？ [单选题] *(2分)`,
    isMultiple:false,
    question:`a. 2%<br>
    b. 3%<br>
    c. 4%<br>
    d. 5%<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:2,
    answer:"d"
  },
  {
    title:`21. 项目设计方案的封面要求具备的内容，有哪些？ *（4分）`,
    isMultiple:true,
    question:`a.没有门牌号、仅仅有随意的简单项目名称<br>
    b. 具体项目名称：新锐/速优+城市+小区名+具体房<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c. 故事标签：根据设计特点而定<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.Locals房源编码及方案日期<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["b","c","d"]
  },
  {
    title:`22. 餐厅作为Locals精品民宿的必备区域，满足最大接待人数用餐是最基本的要求，下列对餐厅配套规范理解正确的是？ *（4分）`,
    isMultiple:true,
    question:`a.接待人数6人的民宿：长桌长度不小于160cm，圆桌长度不小于120cm。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.餐椅必须满足最多接待人数，禁止浅色不耐脏及不易打理的材质。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.餐厅灯具选款及安装方式要结合餐桌款式而定 ，大小根据餐厅尺寸而定，亮度满足基本用餐使用，吊装高度离地1800MM左右。<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.餐具应按照最多接待人数配备米饭碗、碟、刀叉勺、酒杯、水杯、咖啡杯。<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","b","c","d"]
  },
  {
    title:`23. Locals精品民宿要求房源精简、舒适、有品质，同时考虑到设计改造的实用性及消费者的体验需求。下列对物资配备数量理解正确的是？*（4分）`,
    isMultiple:true,
    question:`a.每个卧室需要配备2套床品四件套<br>
    b.浴巾配备的数量是最大接待人数的3倍<br>
    c.3房共配置6个头枕厚枕芯，2个备用薄枕芯，共计8个<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.双人沙发配备1个装饰抱枕，三人沙发配备2个装饰抱枕，L型沙发配备4个装饰抱枕<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["c","d"]
  },
  {
    title:`24. 地毯一直是房源运营维护的难题，对此Locals精品民宿在地毯的配置规范上有严格的要求。以下理解有误的是？*（4分）`,
    isMultiple:true,
    question:`a.具有品质感，避免颜色过浅及长毛不易打理，过薄品质档次低及不适合室内的地毯<br>
    b.颜色视设计效果需要而定，可自由选择，仅要求材质易打理便可<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.地毯可配空间：客厅，主卧，特殊情境空间<br>
    d.地毯尺寸根据项目预算选择尺寸大小。<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["b","d"]
  },
  {
    title:`25. 以下哪种设计方式是Locals精品民宿不倡导的？ *（4分）`,
    isMultiple:true,
    question:`a.设计以人为本，结合房源现状进行改造设计<br>
    b.每个空间都具备地毯，才能使空间效果更好<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.为了使空间更加美观，效果更突出，使用大量墙纸提升改造效果<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.以精选、简洁、有品质为目的，结合维护管理等问题进行思考
    `,
    score:4,
    answer:["b","c"]
  },
  {
    title:`26. 方案中：硬件设施的整改建议，需要指引的内容有哪些？ *（4分）`,
    isMultiple:true,
    question:`a.墙面翻新刷漆或贴墙纸<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.拆除物件后期的修缮参考<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.现场水管设备的施工维修<br>
    d.根据软装需求，必要电位更改的指引<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","b","d"]
  },
  {
    title:`27. 设计师最终提交的设计成果包含？ *（4分）`,
    isMultiple:true,
    question:`a.意向参考图片<br>
    b.软装采购清单XLS<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.完整的正式设计方案PPT及PDF格式<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.项目落地验收报告PDF格式<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["b","c","d"]
  },
  {
    title:`28. 从接受新锐项目设计委托开始，关于设计进度的时间节点正确的有哪三项？ *（4分）`,
    isMultiple:true,
    question:`a.概念设计方案阶段2天（包含量尺、提案、审核调整）<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.正式设计方案阶段3天（包含提案、审核调整）<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.采购清单2天<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.项目总设计筹建完成时间目标20天
    `,
    score:4,
    answer:["a","b","c"]
  },
  {
    title:`29. 在项目采购阶段，需要跟紧的部分有哪些？ *（4分）`,
    isMultiple:true,
    question:`a.抓紧确认在合理货期范围内的家具和窗帘、挂画、地毯、布草等<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.采购的成本等控制好在商定好的预算范围内<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.临近摆场前需要确认物品的到货或安装情况<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.配合硬装方面相关配件的款式确认<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","b","c","d"]
  },
  {
    title:`30. 以下哪种情况符合项目落地验收要求？ *（4分）`,
    isMultiple:true,
    question:`a.方案落地呈现房东背景故事、工作及爱好<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.床品四件套及搭配方式符合Locals全国统一标准<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.呈现各个空间方案与落地对比，匹配度达到80%<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.根据设计标准化物资采购要求，选购指定供应链品牌产品并落地<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","b","c","d"]
  },
  {
    title:`31. 路客2019年新的两种类型的设计项目占比分别是多少？ *（4分）`,
    isMultiple:true,
    question:`a.30%新锐设计项目（20%个性化+10%IP/行政会所）<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.20%新锐设计项目（15%个性化+5%行政会所）<br>
    c.70%速优设计项目<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.80%速优设计项目
    `,
    score:4,
    answer:["a","c"]
  },
  {
    title:`32. 速优设计项目有哪些特点？ *（4分）`,
    isMultiple:true,
    question:`a.速优设计项目软装物资100%都需要在生活馆采购<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.公共区域标准化范围内自由搭配+卧室标准化模块方案<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.进行全新的个性化创意设计<br>
    d.项目筹建时间规划为25天<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","b","d"]
  },
  {
    title:`33.新锐设计项目有哪些特点？ *（4分）`,
    isMultiple:true,
    question:`a.高端超精品类型民宿<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.设计创意极佳、个性魅力独特、城市名片、标杆型精品民宿<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.快速设计及落地、不需要创意的民宿设计品质<br>
    d.包含20%个性化民宿和10%行政会所<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","b","d"]
  },
  {
    title:`34. 项目设计评估管理机制包括以下哪些内容？ *（4分）`,
    isMultiple:true,
    question:`a.设计及落地效果佳，还原度达80%<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.各个成果阶段不逾期，工作效率高<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    c.服务质量佳，及时解决项目问题<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.综合测评<3星，取消接单资格<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","b","c","d"]
  },
  {
    title:`35.结合项目现场情况，设计师下列做法正确的是？ *（4分）`,
    isMultiple:true,
    question:`a.在保障设计效果的前提下，保留部分原有的软装和家具<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    b.量尺当天不需要与施工队交流及评估房源基础情况<br>
    c.多角度拍照纪录，同时留意电位和灯位的合理性<span class="red" v-if="this.secordAnswer">[正确答案]</span><br>
    d.确认楼层电梯能否装载大件家具。<span class="red" v-if="this.secordAnswer">[正确答案]</span>
    `,
    score:4,
    answer:["a","c","d"]
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
                      <h1>LOCALS签约设计师考核</h1>
                      <h2>提示：加油呦！达到90分你才能成为一名LOCALS的合格签约设计师。</h2>
                      ${build(_question,"html")}
                    </div>
                    <div class="vue-dialog-buttons">
                      <button type="button" @click="clickChild" class="vue-dialog-button" style="flex: 1 1 100%;">提交</button>
                    </div>
                  </div>
                  `;

export default {
    name : "DesQuestion",
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
