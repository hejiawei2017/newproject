'use strict';

function clearBody(originalBody, fields) {
  return fields.reduce((preBody, field) => {
    preBody[field] = originalBody[field];
    return preBody;
  }, {});
}

module.exports = {
  filter(rules, type) {
    const data = type ? type : this.request.body;
    const ruleKeys = Object.keys(rules);

    ruleKeys.forEach(ruleKey => {
      const rule = rules[ruleKey];
      if (typeof rule === 'string') {
        return;
      }

      rule.convertType = rule.type;
      if (rule.required) {
        return;
      }

      // if ('default' in rule) {
      //   rule.required = false;
      //   return;
      // }

      rule.required = false;
    });

    try {
      this.validate(rules, data);
      return clearBody(data, ruleKeys);
    } catch (error) {
      this.logger.error(error);
      this.response.fail(this.response.errno.PARAMS);
      return;
    }
  },
};
