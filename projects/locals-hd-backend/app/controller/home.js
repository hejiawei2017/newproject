'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { app } = this;
    await app.redis.set('redis', 'hello redis' + new Date().toLocaleString());
    this.ctx.body = await app.redis.get('redis');
  }
}

module.exports = HomeController;
