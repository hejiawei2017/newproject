'use strict';

const { app } = require('egg-mock/bootstrap');
const assert = require('assert');

describe('/api/activity_admin/activity_versions', () => {
  let versionNo = '';
  before(() => {
    versionNo = '2019.999.' + (new Date().getTime() % 1000);
  });

  async function getActivityId() {
    const activityInfo = (await app
      .httpRequest()
      .get('/api/activity_admin/activity?offset=1&limit=10')).body;

    return activityInfo.data[0].id;
  }

  it('create', async () => {
    const activityId = await getActivityId();
    const response = await app
      .httpRequest()
      .post('/api/activity_admin/activity_versions')
      .send({
        version: versionNo,
        activity_id: activityId,
        resource: '1',
        online: true,
      });
    assert(response.body.success);
  });

  it('show', async () => {
    const activityId = await getActivityId();
    const response = await app
      .httpRequest()
      .get(`/v/${activityId}?v=${versionNo}`);

    assert(response.status === 200);
  });
});
