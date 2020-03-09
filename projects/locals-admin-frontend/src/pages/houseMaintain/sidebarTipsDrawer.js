import React, { Component } from 'react';
// import { AAIHouseManagementService } from '../../services';
import { Drawer,Icon,message } from 'antd';
import './tipsDrawerStyle.less';
class SidebarTipsDrawer extends Component {
    render (){
        return (
            <Drawer
                visible={this.props.visible || false}
                width={this.props.width || 800}
                onClose={this.props.onClose}
            >
                <div className="tg-wrap"><table className="tg">
                    <tbody>
                    <tr>
                        <td className="tg-baqh" colSpan="2">项目</td>
                        <td className="tg-baqh">预上线必填项</td>
                        <td className="tg-baqh">正式上线必填项</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" rowSpan="2">图片</td>
                        <td className="tg-0lax">路客竖图</td>
                        <td className="tg-baqh" rowSpan="2">主图必须有</td>
                        <td className="tg-baqh" rowSpan="2">每个模块都要有一张Airbnb要求图片总数不少于10张，途家不少于6张</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">横图</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" rowSpan="2">房源地址</td>
                        <td className="tg-0lax">中文地址</td>
                        <td className="tg-baqh" rowSpan="2">必填</td>
                        <td className="tg-baqh" rowSpan="2">必填，正式上线之后不能再进行修改</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">英文地址</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" colSpan="2">房源信息</td>
                        <td className="tg-baqh" colSpan="2">必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" colSpan="2">配套设施</td>
                        <td className="tg-baqh">必填，勾选设施数量大于1即可</td>
                        <td className="tg-baqh">必填上线airbnb（填写了Airbnb标题），房源设施不能少于8个</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" rowSpan="6">房源描述</td>
                        <td className="tg-0lax">路客标题</td>
                        <td className="tg-baqh" colSpan="2">中文标题必填，英文标题非必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">其他平台标题</td>
                        <td className="tg-baqh">非必填因为正式上线成功之后，才会推到API平台上线</td>
                        <td className="tg-baqh">1、有需要就填写，非必填2、上线airbnb，中文标题必填，且不能少于10字符3、上线booking，中文和英文标题必填4、上线途家，中文标题必填，英文非必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">摘要简介</td>
                        <td className="tg-baqh">必填</td>
                        <td className="tg-baqh">必填上线airbnb，简介不少于100字符</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">交通情况</td>
                        <td className="tg-baqh" colSpan="2" rowSpan="3">必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">开门方式</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">房源昵称</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" colSpan="2">房屋守则</td>
                        <td className="tg-baqh" colSpan="2">必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" rowSpan="5">价格及活动</td>
                        <td className="tg-0lax">周末价</td>
                        <td className="tg-baqh" colSpan="2" rowSpan="2">必填，且不能小于100元</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">日常价</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">清洁费</td>
                        <td className="tg-baqh">非必填</td>
                        <td className="tg-baqh">若上线airbnb（填写了Airbnb标题），则清洁费必填，且需大于35元，小于4218元</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">保证金</td>
                        <td className="tg-baqh" colSpan="2">非必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">活动</td>
                        <td className="tg-baqh" colSpan="2">非必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" rowSpan="3">人员设置</td>
                        <td className="tg-0lax">房东</td>
                        <td className="tg-baqh" colSpan="2" rowSpan="3">必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">设计师</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">保洁人员</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" rowSpan="2">预定设置</td>
                        <td className="tg-0lax">途家</td>
                        <td className="tg-baqh">非必填</td>
                        <td className="tg-baqh">若上线途家（填写了途家标题），则【儿童/老人】必须选择1个，【男性/女性】也是</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">airbnb</td>
                        <td className="tg-baqh" colSpan="2">非必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" rowSpan="2">其他</td>
                        <td className="tg-0lax">门锁信息</td>
                        <td className="tg-baqh" colSpan="2">非必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">airbnb账号</td>
                        <td className="tg-baqh">如果填写了airbnb标题，则必填</td>
                        <td className="tg-baqh">如果填写了airbnb标题，则必填</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax" colSpan="2">备注</td>
                        <td className="tg-baqh">【项目筹建】、【预上线审核】、【预上线已拒绝】这3个状态提交</td>
                        <td className="tg-baqh">【预上线成功】、【正式上线审核中】、【正式上线拒绝】、【正式上线成功】、【信息修改，待审核】、【信息修改，审核不通过】这6个状态提交</td>
                    </tr>
                    </tbody>
                </table></div>
            </Drawer>
        )
    }
}
export default SidebarTipsDrawer
