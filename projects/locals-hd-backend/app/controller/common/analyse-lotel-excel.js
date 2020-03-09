'use strict';
const BaseController = require('../../core/base-controller');
const Excel = require('excel').default;
const ExcelExport = require('node-excel-export');
const oss = require('ali-oss');
const moment = require('moment');

// 创建OSS上传的实例
const client = new oss({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI51rz55fhjUzU',
  accessKeySecret: 'QETpJ124TfYfP801ZA5Mco0djKvXtx',
  bucket: 'locals-house-prod', // locals-house-prod(生产)
  secure: true, // https访问
});

module.exports = class extends BaseController {
  async options() {
    const { ctx } = this;
    ctx.response.set('Access-Control-Allow-Origin', '*');
  }

  async create() {
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    // console.log('TCL: extends -> create -> stream', stream.filename);
    const data = await Excel(stream);
    const header = data.splice(0, 1)[0];
    data.splice(0, 1);

    const shopDatas = data
      .filter(shopData => shopData.some(v => /逾期/.test(v)))
      .reduce(
        (pretable, shopData) => {
          shopData.forEach((shopItem, index) => {
            if (!/逾期/.test(shopItem)) {
              return;
            }
            const days = Number(shopItem.match(/\d+/)[0]);
            Object.keys(pretable).forEach(key => {
              const range = key.split(',');
              const accord = days >= range[0] && days <= range[1];
              if (!accord) {
                return;
              }
              if (shopData[2] === '李政泽') {
                console.log('TCL: extends -> create -> days', days, range);
              }

              const onwer = pretable[key].data.filter(
                v => v.shopname === shopData[1]
              )[0];

              const project = header[index - 1].replace(/\d-/, '');
              if (onwer) {
                onwer.projects.push(project);
                return;
              }

              pretable[key].data.push({
                shopname: shopData[1],
                shopowner: shopData[2],
                starttime: shopData[3],
                projects: [project],
              });
            });
          });
          return pretable;
        },
        {
          '106, 99999': { label: '逾期十五周以上', data: [], level: 'urgent' },
          '91,105': {
            label: '逾期十三周以上(91 - 105天)',
            data: [],
            level: 'urgent',
          },
          '76,90': {
            label: '逾期十一周以上(76 - 90天)',
            data: [],
            level: 'urgent',
          },
          '61,75': {
            label: '逾期九周以上(61 - 75天)',
            data: [],
            level: 'urgent',
          },
          '46,60': {
            label: '逾期七周以上(46 - 60天)',
            data: [],
            level: 'warning',
          },
          '31,45': {
            label: '逾期五周以上(31 - 45天)',
            data: [],
            level: 'accelerate',
          },
          '16,30': { label: '16 - 30 天', data: [], level: 'accelerate' },
          '1,15': { label: '1 - 15天', data: [], level: 'accelerate' },
        }
      );

    const style = {
      header: {
        fill: { fgColor: { rgb: 'FF000000' } },
        font: { color: { rgb: 'FFFFFFFF' } },
        alignment: { horizontal: 'center' },
      },
      project: {
        alignment: {
          wrapText: true,
        },
      },
      urgent: {
        fill: { fgColor: { rgb: 'FFFF1F1F' } },
        font: { color: { rgb: 'FFFFFFFF' } },
      },
      warning: {
        fill: { fgColor: { rgb: 'FF3274B2' } },
        font: { color: { rgb: 'FFFFFFFF' } },
      },
      accelerate: {
        fill: { fgColor: { rgb: 'FF8497AF' } },
        font: { color: { rgb: 'FFFFFFFF' } },
      },
    };

    const specification = {
      shopowner: {
        displayName: '警告店长',
        headerStyle: style.header,
        width: 120,
        cellStyle: (_, row) => style[row.level],
      },
      shopname: {
        displayName: '分店名称',
        headerStyle: style.header,
        width: 150,
        cellStyle: (_, row) => style[row.level],
      },
      project: {
        displayName: '逾期整改项目',
        headerStyle: style.header,
        width: 350,
        cellStyle: (_, row) => style[row.level],
      },
      time: {
        displayName: '逾期整改时长(天)',
        headerStyle: style.header,
        width: 180,
        cellStyle: (_, row) => style[row.level],
      },
      required: {
        displayName: '整改要求',
        headerStyle: style.header,
        width: 150,
        cellStyle: (_, row) => style[row.level],
      },
    };

    const dataset = Object.keys(shopDatas).map(key => {
      const { data, label, level } = shopDatas[key];
      if (!data.length) {
        return false;
      }
      return data.map(item => ({
        shopowner: item.shopowner,
        shopname: item.shopname,
        project: item.projects.join('、'),
        level,
        time: label,
        required: '必须七天完成',
      }));
    });

    const merageData = [].concat.apply([], dataset.filter(v => v));

    const report = ExcelExport.buildExport([
      {
        name: '逾期整改项目报告',
        heading: [],
        merges: [],
        specification,
        data: merageData,
      },
    ]);
    const result = await client.put(
      `1902020845832/${moment().format('YYYYMMDDhhmmss')}_${stream.filename}`,
      report
    );
    ctx.body = result;
  }
};
