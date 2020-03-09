'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('api/common/record', () => {
  // it('should assert', function* () {
  //   const pkg = require('../../../package.json');
  //   assert(app.config.keys.startsWith(pkg.name));
  // });

  const dataId = '123456';
  const category = 'hello';
  it('should POST', async () => {
    const response = await app
      .httpRequest()
      .post('/api/common/records')
      .send({
        data_id: dataId,
        data: JSON.stringify({ test: true }),
        category,
      });
    assert(response.body.success);
  });

  it('should GET', async () => {
    const response = await app
      .httpRequest()
      .get('/api/common/records/' + dataId + '?category=' + category)
      .send();
    assert(response.body.success);
  });

  it('should PATCH', async () => {
    const response = await app
      .httpRequest()
      .patch('/api/common/records/' + dataId)
      .send({ data: JSON.stringify({ test: false }) });
    assert(response.body.success);
  });

  it('should index', async () => {
    const response = await app
      .httpRequest()
      .get('/api/common/records/?category=' + category)
      .send();
    assert(response.body.success);
  });

  it('should DEL', async () => {
    const response = await app
      .httpRequest()
      .del('/api/common/records/' + dataId)
      .send();
    assert(response.body.success);
  });
});
