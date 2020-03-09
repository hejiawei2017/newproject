'use strict';

const Controller = require('egg').Controller;

const houseInfo = require('./queenHouse.json')

class QueenContraler extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = houseInfo;
    // console.log(this);
  }
}

module.exports = QueenContraler;