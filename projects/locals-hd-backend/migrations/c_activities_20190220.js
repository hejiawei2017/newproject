'use strict';

module.exports = {
  async up(q, s) {
    q.changeColumn('t_activities', 'version_id', { type: s.STRING(36) });
  },
};
