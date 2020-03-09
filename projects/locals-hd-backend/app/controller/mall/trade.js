'use strict';

const BaseController = require('../../core/base-controller');

class MallTradeController extends BaseController {

  /**
   * 获取商城交易记录
   * @param { number } [page=1] 页码
   * @param { number } [pageNum=10] 每页数量
   * @param { number } [start_time=''] 开始时间
   * @param { number } [end_time=Date.now()] 结束时间
   * @param { number } [user_real_name=''] 买家姓名
   * @param { mobile } [user_mobile=''] 买家手机号
   * @memberof ActivitiesController
   */
  async index() {
    const { ctx, service, app } = this;
    const data = this.ctx.filter(
      {
        page: { default: 1, type: 'number', convertType: 'number' },
        pageNum: { default: 10, type: 'number', convertType: 'number' },
        user_real_name: { default: '', type: 'string' },
        user_mobile: { default: '', type: 'string' },
        start_time: { default: '', type: 'string' },
        end_time: { default: new Date().toUTCString(), type: 'string' },
      },
      ctx.request.query
    );

    if (!data) {
      return;
    }

    const result = await service.mall.getTrade(data);
    ctx.response.auto(result);
  }
}

module.exports = MallTradeController;
