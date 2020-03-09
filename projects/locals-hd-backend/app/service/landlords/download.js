'use strict';

const Service = require('egg').Service;

class DownloadService extends Service {
  async download({ start_time, end_time, offset, limit, type_name, typeId }) {
    const { ctx, app } = this;
    const model = app.model_hd;
    let _typeId = typeId;
    if (type_name || typeId) {
      const where = {};

      if (type_name) {
        where.name = type_name;
      }

      if (typeId) {
        where.id = typeId;
      }

      const type = await model.LandlordsType.findOne({
        where,
      });
      if (!type) {
        ctx.throw(404, '类型未找到');
        return;
      }
      _typeId = type.id;
    }

    const result = await model.Landlords.findLandlords(
      {
        type_id: _typeId,
        start_time,
        end_time,
      },
      { limit, offset }
    );

    const ids = Array.from(new Set(result.map(v => v.type_id)));
    const types = await model.LandlordsType.findAll({
      where: { id: ids },
      raw: true,
    });

    return {
      landlords: result,
      types: types.reduce((pre, cur) => ({ ...pre, [cur.id]: cur }), {}),
    };
  }
}

module.exports = DownloadService;
