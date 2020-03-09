'use strict';

module.exports = {
  async up(q, s) {
    await q.changeColumn('t_record_text', 'data', { type: s.TEXT });
  },
};
