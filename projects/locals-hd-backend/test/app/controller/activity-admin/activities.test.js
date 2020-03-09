'use strict';

const { app } = require('egg-mock/bootstrap');
const assert = require('assert');
const moment = require('moment');

describe('api/activity_admin/activity', () => {
  function covertSeconds(date) {
    return Math.floor(date / 1000) * 1000;
  }

  let activityId = 0;
  it('index', async () => {
    const response = await app
      .httpRequest()
      .get('/api/activity_admin/activity?offset=1&limit=10&name=1');
    assert(response.body.success);
  });
  it('show', async () => {
    const response = await app
      .httpRequest()
      .get('/api/activity_admin/activity/9620953');
    assert(response.body.success);
  });

  it('create', async () => {
    const endTime = new Date();
    endTime.setFullYear(2999);
    const activityData = {
      name: '测试活动' + moment().format('YYYY-MM-DD hh:mm:ss'),
      start_time: covertSeconds(Date.now()),
      end_time: covertSeconds(endTime),
      state: 0,
      resource: '',
      version: '1.0.0',
    };

    const response = await app
      .httpRequest()
      .post('/api/activity_admin/activity')
      .type('json')
      .send(activityData);

    assert(response.body.success);
    activityId = response.body.data;
  });
  it('update', async () => {
    const endTime = new Date();
    endTime.setFullYear(2999);
    const activityData = {
      name: '测试活动修改' + moment().format('YYYY-MM-DD hh:mm:ss'),
      start_time: covertSeconds(Date.now()),
      end_time: covertSeconds(endTime),
      state: 0,
    };

    const response = await app
      .httpRequest()
      .patch('/api/activity_admin/activity/' + activityId)
      .type('json')
      .send(activityData);

    assert(response.body.success);
  });

  it('destroy', async () => {
    const response = await app
      .httpRequest()
      .delete('/api/activity_admin/activity/' + activityId);
    assert(response.body.success);
  });
});
