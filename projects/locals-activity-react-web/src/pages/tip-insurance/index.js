import React from 'react'
import './index.css'
document.title = '保险告知'
class App extends React.Component {
  render() {
    return (
      <div className="page">
        <div className="title border-after">
          “安心宿”住客意外保障保险由“Locals
          路客”平台赠送给每一位入住旅客，由中国平安财产保险股份有限公司承保。
        </div>
        <div className="section border-after">
          <div className="section-title">保险产品</div>
          <div className="table">
            <div className="tr">
              <div className="td">保障项目</div>
              <div className="td">保障金额</div>
            </div>
            <div className="tr">
              <div className="td">住宿旅客意外伤害身故及伤残</div>
              <div className="td">50万</div>
            </div>
            <div className="tr">
              <div className="td">住宿旅客急性病身故及伤残</div>
              <div className="td">50万</div>
            </div>
            <div className="tr">
              <div className="td">住宿旅客意外、急性病伤害医疗补偿</div>
              <div className="td">2万</div>
            </div>
            <div className="tr">
              <div className="td">住宿旅客意外伤害、急性病住院津贴</div>
              <div className="td">50元／天</div>
            </div>
            <div className="tr">
              <div className="td">个人责任</div>
              <div className="td">2万</div>
            </div>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-title">特别约定</div>
          <div className="section-content">
            <span>
              1．每一被保险人最高限1份；<br/>2．本产品只承担0-75周岁被保险人的保险责任，不承担75周岁以上人员的保险责任；<br/>
              3．不满10周岁的被保险人的意外身故伤残保险金额以20万元为限，已满10周岁未满18周岁的被保险人的意外身故伤残保险金额以50万元为限；<br/>4．被保险人通过“Locals路客”平台租住的房屋仅限中华人民共和国境内（不包括香港、澳门及台湾地区）；<br/>5．在保险期间内，保险人仅对被保险人通过“Locals路客”平台租住的房屋地址内发生的保险事故承担保险责任；<br/>6．对于每次意外事故被保险人实际支出的、符合当地社会基本医疗保险规定的、必需且合理的医疗费用，保险人按照免赔100元后100%进行赔付；<br/>7．意外伤害及急性病住院津贴日津贴额为人民币50元，按实际住院日数给付，但累计给付日数不超过90天；<br/>8．本产品适用条款为《平安个人酒店住宿意外伤害保险条款》《平安旅行附加医疗费用补偿保险条款》
              《平安旅行附加住院津贴保险条款》
              《平安旅行附加急性病身故或全残保险条款》
              《平安个人责任保险条款》 ，未尽事宜以条款为准。
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-title">保险对象</div>
          <div className="section-content">
            凡年龄在零至七十五周岁（含），符合乙方承保条件的身体健康，可正常工作、生活及出行的自然人，均可向保险人投保本保险，成为本保险的被保险人。被保险人为未成年人的，须经其父母或监护人同意投保人为其投保。
          </div>
        </div>
        <div className="section border-after">
          <div className="section-title">保险期限</div>
          <div className="section-content">
            在Locals路客平台订单中约定的入住时间（必须为整点）起至约定的退房时间止。
          </div>
        </div>
        <div className="section border-after">
          <div className="section-title">保险责任</div>
          <div className="section-content">
            <span>住宿旅客意外伤害身故及伤残</span>
            <span>
              1、意外身故保险金在保险期间内，被保险人在通过“Locals路客”所租的房屋地址内遭遇意外伤害事故，且自意外伤害事故发生之日起一百八十天内，因该意外事故导致身故，保险公司按合同约定的保额金额给付意外身故保险金，保险责任终止。<br/>被保险人身故前保险人已给付意外残疾保险金的，身故保险金应扣除已给付的残疾保险金。<br/>2、意外伤残保险金<br/>在保险期间内，被保险人在通过“Locals路客”所租的房屋地址内遭遇意外伤害事故，并自该事故发生之日起180日内因该事故造成本保险合同所附《人身保险伤残评定标准（行业标准）》（简称《伤残评定标准》）所列伤残之一的，保险人按该表所列给付比例乘以意外伤害保险金额给付伤残保险金。如第180日治疗仍未结束的，按当日的身体情况进行伤残鉴定，并据此给付伤残保险金。<br/>1．当同一保险事故造成两处或两处以上伤残时，应首先对各处伤残程度分别进行评定，如果几处伤残等级不同，以最重的伤残等级作为最终的评定结论；如果两处或两处以上伤残等级相同，伤残等级在原评定基础上最多晋升一级，最高晋升至第一级。同一部位和性质的伤残，不应采用《伤残评定标准》条文两条以上或者同一条文两次以上进行评定。<br/>2．被保险人如在本次意外伤害事故之前已有伤残，保险人按合并后的伤残程度在《伤残评定标准》中所对应的给付比例给付伤残保险金，但应扣除原有伤残程度在《伤残评定标准》所对应的伤残保险金。<br/>
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-content">
            <span>住宿旅客急性病身故及伤残</span>
            <span>
              1.急性病身故保险金<br/>在本附加险保险期间内，被保险人在通过“Locals路客”所租的房屋地址内突发急性病，并在该疾病发生后一百八十日内因该急性病身故的，保险人按本附加险保险金额一次性给付身故保险金，对该被保险人的保险责任终止。<br/>2.急性病全残保险金<br/>在本附加险保险期间内，被保险人在通过“Locals路客”所租的房屋地址内突发急性病，并在该疾病发生后一百八十日内造成主保险合同所附《人身保险伤残评定标准（行业标准）》所列伤残程度第一级之一者，保险人按本附加险保险金额一次性给付全残保险金，对该被保险人的保险责任终止。
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-content">
            <span>住宿旅客意外、急性病伤害医疗补偿</span>
            <span>
              旅行（补充）医疗保险责任<br/>被保险人在通过“Locals路客”所租的房屋地址内遭遇意外伤害事故或突发严重急性病，并在符合本条款释义的医院进行治疗，自事故发生或诊断之日起180日内实际支出的必要、合理的医疗费用，保险人按保险单载明的免赔额和赔付比例给付旅行（补充）医疗费用保险金。<br/>被保险人无论一次或多次在“Locals路客”所租的房屋地址内遭受意外伤害事故或突发严重急性病，保险人均按上述规定分别给付旅行（补充）医疗费用保险金，但累计给付金额以被保险人的旅行（补充）医疗费用保险金额为限，累计给付金额达到旅行（补充）医疗费用保险金额时，对被保险人保险责任终止。<br/>
              <span className="main-text">
                上述旅行医疗保险责任、旅行补充医疗保险责任，被保险人如果已从其他途径（包括农村合作医疗保险、社会基本医疗保险、工作单位、或其他任何商业保险机构等）获得补偿，则保险人只承担合理医疗费用剩余部分的保险责任。
              </span>
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-content">
            <span>住宿旅客意外伤害、急性病住院津贴</span>
            <span>
              在保险期间内，被保险人在通过“Locals路客”所租的房屋地址内遭受意外伤害事故或突发严重急性病，并在医院（指经中华人民共和国卫生部门评审确定的二级或二级以上的公立医院，但不包括主要作为诊所、康复、护理、休养、静养、戒酒、戒毒等或类似的医疗机构）住院治疗，保险人就被保险人自事故发生或诊断之日起180日内的合理住院天数，按保险单载明的每日给付金额给付旅行住院津贴保险金。<br/>被保险人无论一次或多次在通过“Locals路客”所租的房屋地址内遭受意外伤害事故或突发严重急性病，保险人均按上述规定分别给付旅行住院津贴保险金，但保险期间内累计给付天数不超过90天，当累计给付天数达到90天时，对被保险人保险责任终止。
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-content">
            <span>个人责任</span>
            <span>
              在保险期间内，被保险人在通过“Locals路客”所租的房屋地址内因过失导致第三者人身伤亡或财产的直接损失，依照中华人民共和国法律（不包括港澳台地区法律）应由被保险人承担的经济赔偿责任，保险人按照本保险合同约定负责赔偿。<br/>在保险期间内，保险人在通过“Locals路客”所租的房屋地址内，由被保险人作为监护人的10周岁以下的未成年人造成第三者人身伤亡或财产的直接损失，依照中华人民共和国法律（不包括港澳台地区法律）应由被保险人承担的经济赔偿责任，保险人按照本保险合同约定负责赔偿。<br/>保险事故发生后，被保险人因保险事故而被提起仲裁或者诉讼的，对应由被保险人支付的仲裁或诉讼费用以及事先经保险人书面同意支付的其他必要的、合理的费用（以下简称“法律费用”），保险人按照本保险合同约定也负责赔偿。
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-title">主要责任免除</div>
          <div className="section-content">
            <span>
              一、被保险人因下列原因而导致身故或残疾的，保险人不承担给付保险金责任：<br/>1、投保人的故意行为；<br/>2、被保险人自致伤害或自杀，但被保险人自杀时为无民事行为能力人的除外；<br/>3、因被保险人挑衅或故意行为而导致的打斗、被袭击或被谋杀；<br/>4、被保险人妊娠、流产、分娩、疾病；<br/>5、被保险人接受整容手术及其他内、外科手术；<br/>6、被保险人未遵医嘱，私自服用、涂用、注射药物；<br/>7、核爆炸、核辐射或核污染；<br/>8、恐怖袭击；<br/>9、被保险人犯罪或拒捕；<br/>10、既往症、慢性病；<br/>11、遗传性疾病、先天性畸形、变形和染色体异常；<br/>12、被保险人从事高风险运动或参加职业或半职业体育运动。<br/>二、被保险人在下列期间遭受意外伤害导致身故或残疾的，保险人不承担给付保险金责任：<br/>1、战争、军事行动、暴动或武装叛乱期间；<br/>2、被保险人醉酒或毒品、管制药物的影响期间；<br/>3、不在“Locals路客”所租的房屋地址内期间发生的意外伤害；<br/>4、被保险人醉酒或毒品、管制药物的影响期间；<br/>5、被保险人酒后驾车、无有效驾驶证驾驶或驾驶无有效行驶证的机动车期间；<br/>6、被保险人患艾滋病（AIDS）或感染艾滋病病毒（HIV呈阳性）期间；<br/>7、被保险人违背医嘱而执意进行旅行，或被保险人旅行的目的就是寻求或接受治疗。<br/>
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-title">注意事项</div>
          <div className="section-content">
            <span>
              本保险产品摘要未尽事宜详见<br/>《平安个人酒店住宿意外伤害保险条款》<br/>《平安旅行附加医疗费用补偿保险条款》<br/>《平安旅行附加住院津贴保险条款》<br/>《平安旅行附加急性病身故或全残保险条款》<br/>《平安个人责任保险条款》
            </span>
          </div>
        </div>
        <div className="section border-after">
          <div className="section-content">
            疾保险金按《人身保险伤残评定标准》所列给付比例乘以残疾保险金额来确定，被保险人可登录中国保险行业协会官网查阅；
          </div>
        </div>
        <div className="section border-after">
          <div className="section-content">
            本保险产品的身故受益人为法定受益人；
          </div>
        </div>
        <div className="section">
          <div className="section-title">保单查询方式</div>
          <div className="section-content">
            <span>
              平安统一客服热线：95511<br/>个人网络查询：请访问http://one.pingan.com/，注册并登录一帐通<br/>平安官方网站查询：http://www.pingan.com/bdcy.shtml
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default App
  