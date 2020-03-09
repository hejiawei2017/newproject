'use strict';

const { app } = require('egg-mock/bootstrap');
const assert = require('assert');

describe('api/activity_admin/signin', () => {
  it('signin', async () => {
    const response = await app
      .httpRequest()
      .post('/api/activity_admin/signin')
      .send({ username: '17666049233', password: '123456' });

    assert(!response.body.success);
  });

  it('signout', async () => {
    const response = await app
      .httpRequest()
      .post('/api/activity_admin/signout')
      .send();

    assert(!response.body.success);
  });
});
