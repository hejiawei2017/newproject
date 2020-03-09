'use strict';
const BaseSerivce = require('../core/base-service');

module.exports = class extends BaseSerivce {
  async inviteStatisics(robot_name, robot_id, room_name, room_id, inviter_name, inviter_id, inviteeArr) {
    const { errno, model } = this;
    // 获取到的invitee是数组，需要循环处理
    const invitees = JSON.parse(inviteeArr);
    const create_time = Date.now();
    const invitee_idArr = await model.InviteStatisics.findAll({
      attributes: ['invitee_id'],
      raw: true,
    });
    const idArr = invitee_idArr.map(c => c.invitee_id);
    try {
      for (let i = 0; i < invitees.length; i++) {
        if (idArr.indexOf(invitees[i].invitee_id) === -1) {
          await model.InviteStatisics.create({
            id: 0,
            robot_name,
            robot_id,
            room_name,
            room_id,
            inviter_name,
            inviter_id,
            invitee_name: invitees[i].invitee_name,
            invitee_id: invitees[i].invitee_id,
            create_time,
          });
        } else {
          console.log(`${invitees[i].invitee_name}已被邀请过了！`);
          return errno.SERVER;
        }
      }
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
    return errno.SUCCESS;
  }

  // 记录formid
  async recordsFormid(openid, formid) {
    const { model, errno } = this;
    try {
      await model.RecordsFormid.create({
        id: 0,
        openid,
        formid,
        create_time: Date.now(),
      });
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
    return errno.SUCCESS;
  }

  // 获取formid，用于推送老用户获得奖励
  async getFormid(touser) {
    try {
      const formid = await this.model.RecordsFormid.findOne({
        where: {
          openid: touser,
          is_used: 0,
        },
        row: true,
      });
      if (formid === null) return false;
      return formid;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  // 更新formid状态
  async updateFormid(id) {
    try {
      const data = { is_used: 1 };
      await this.model.RecordsFormid.update(data, { where: { id } });
      return this.success(id);
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
  }
};
