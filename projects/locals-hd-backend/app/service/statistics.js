'use strict';
const BaseSerivce = require('../core/base-service');

module.exports = class extends BaseSerivce {
  async share(ticket, user_id, app_id, type, page, desc) {
    const ticket_id = ticket || this.app.util.id.new;
    try {
      await this.model.StatisticsShare.create({
        ticket_id,
        user_id,
        app_id,
        type,
        page,
        desc,
        create_time: Date.now(),
      });
    } catch (error) {
      return this.errno.SERVER;
    }
    return this.success(ticket_id);
  }

  async joinShare(ticket_id, share_user_id, join_user_id) {
    const { model, errno } = this;
    try {
      const shareUserInfo = await model.StatisticsShareRelation.findOne({
        where: { join_user_id: share_user_id, ticket_id },
        row: true,
      });

      const level = shareUserInfo ? shareUserInfo.level + 1 : 1;
      await model.StatisticsShareRelation.create({
        ticket_id,
        share_user_id,
        join_user_id,
        level,
        create_time: Date.now(),
      });
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
    return errno.SUCCESS;
  }

  async event(user_id, event, share_user, activity_name, desc) {
    const { model, errno } = this;
    try {
      await model.StatisticsEvent.create({
        user_id,
        event,
        share_user,
        activity_name,
        desc,
      });
    } catch (error) {
      this.logger.error(error);
      return this.errno.SERVER;
    }
    return errno.SUCCESS;
  }
};
