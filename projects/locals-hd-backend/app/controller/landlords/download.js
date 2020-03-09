'use strict';

const moment = require('moment');
const Controller = require('../../core/base-controller');

class DownloadController extends Controller {
  async index() {
    const { ctx, service } = this;

    const body = this.filter({ type_name: { type: 'string' } }, ctx.query);
    if (!body) {
      return;
    }

    // 获取所有的房东数据
    const response = await service.record.findAll('LANDLORDS', 0, '', 'DESC');
    if (!response.success) {
      ctx.body = response;
      return;
    }
    // 获取所有的房东类型
    const landTypeResponse = await service.record.find('LANDLORDS_TYPE', 'landlords_type');
    if (!landTypeResponse.success) {
      ctx.body = landTypeResponse;
      return;
    }

    // 解析房东数据
    let landLordsInfos = response.data.map(v => {
      try {
        return JSON.parse(v.data);
      } catch (error) {
        console.info(v.data);
        return {};
      }
    });
    // 解析房东类型
    const landTypeInfos = JSON.parse(landTypeResponse.data);

    // 传入类型名称， 过滤房东数据
    if (body.type_name) {
      const typeIds = Object.keys(landTypeInfos).filter(v => landTypeInfos[v].name === body.type_name);

      if (!typeIds.length) {
        ctx.response.success(`找不到类型为${body.type_name}的数据`);
        return;
      }
      landLordsInfos = landLordsInfos.filter(v => v.type_id === typeIds[0]);
    }

    const fields = [
      ['name', '姓名'],
      ['typeName', '类型'],
      ['phone', '电话'],
      ['province', '省份'],
      ['city', '城市'],
      ['area', '区域'],
      ['create_time', '报名时间'],
    ];

    const buff = await service.excel.$export(
      fields.reduce((p, c) => ({ ...p, [c[0]]: { displayName: c[1] } }), {}),
      landLordsInfos.map(v => ({
        ...v,
        typeName: landTypeInfos[v.type_id] ? landTypeInfos[v.type_id].name : '',
        create_time: moment(v.create_time).format('YYYY-MM-DD HH:mm:ss'),
      }))
    );
    await service.excel.download('locals-' + moment(Date.now()).format('YYYY-MM-DD HH.mm.ss') + '.xls', buff);
    return;
  }
}

module.exports = DownloadController;
