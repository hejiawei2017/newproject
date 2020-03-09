'use strict';

module.exports = function() {
  return (query = '') => {
    const operator = query.split(' ')[0] || '';
    const allowOperators = ['SELECT'];
    if (!allowOperators.includes(operator.toUpperCase())) {
      return;
    }
    return this.app.model_hd.query(query).then(([results]) => results);
  };
};
