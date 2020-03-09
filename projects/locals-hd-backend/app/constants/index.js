'use strict';

exports.ACTIVITY_STATE = {
  NORMAL: 0,
  START: 1,
  END: 2,
};

exports.ACTIVITY_PAGE_STATE = {
  NORMAL: 0,
  NO_START: 1,
  ENDED: 2,
  NOT_FOUND_ACTIVITY: 3,
  NOT_FOUND_VERSION: 4,
};

exports.COUPON_CODE = {
  price_50_0: { code: 'NUHHJRVF', price: 50 },
  price_50_1: { code: 'JHUTRFGF', price: 50 },
  price_100_0: { code: '7F1F2DE80', price: 100 }, // 'WKVHYHSF'
  price_200_0: { code: 'KIYHFBCE', price: 200 },
  price_200_1: { code: 'TYGHFVCD', price: 200 },
  price_300_0: { code: '4E9DDAA59', price: 300 },
  price_400_0: { code: 'YUJGTGRT', price: 400 },
  price_800_0: { code: 'TFGMZSWO', price: 800 },
};

exports.ACTIVITY_PAGE_PREVIEW_NO = 'preview';
exports.ACTIVITY_PAGE_FORMAL_NO = 'formal';
