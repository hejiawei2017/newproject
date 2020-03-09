'use strict';
const BaseSerivce = require('../core/base-service');
const ExcelExport = require('node-excel-export');
const defaults = require('lodash/defaults');
const Excel = require('excel').default;

const defaultStyle = {
  headerStyle: {
    fill: { fgColor: { rgb: '27754B00' } },
    font: { color: { rgb: 'FFFFFFFF' } },
    alignment: { horizontal: 'center' },
  },
  width: 120,
};

module.exports = class extends BaseSerivce {
  // 关键字加上前缀 $
  $export(specification, data) {
    return ExcelExport.buildExport([
      {
        name: '',
        heading: [],
        merges: [],
        specification: Object.keys(specification).reduce(
          (pre, field) => ({
            ...pre,
            [field]: defaults(specification[field], defaultStyle),
          }),
          {}
        ),
        /**
         * fieldName {
         *   displayName: query[key],
         *   headerStyle: {
         *     fill: { fgColor: { rgb: '27754B00' } },
         *     font: { color: { rgb: 'FFFFFFFF' } },
         *     alignment: { horizontal: 'center' },
         *   },
         *   width: 120,
         * }
         */
        data,
      },
    ]);
  }

  $import(stream) {
    return Excel(stream);
  }

  download(fileName, data) {
    this.ctx.response.set({
      'Content-Type': 'application/vnd.ms-execl',
      'Content-Disposition':
        'attachment;filename=' + encodeURIComponent(fileName),
      Pragma: 'no-cache',
      Expires: 0,
    });

    this.ctx.body = data;
  }
};
