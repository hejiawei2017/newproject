/* eslint no-new-func: "off"*/
"use strict";

const BaseController = require("../base-controller");
const isPlainObject = require("lodash/isPlainObject");
const functions = require("./functions/index");

class CouldFunctionController extends BaseController {
  async call(options) {
    if (!isPlainObject(options)) {
      return;
    }

    const params = await require("./params")(options);
    const tasks = params.map(item => functions.call(this, item));
    const results = await Promise.all(tasks);

    if (tasks.length === 1) {
      return results[0];
    }
    return tasks;
  }

  async callCode(type, body) {
    const model = this.app.model_hd.ReportHandleCode;
    const row = await model.findOne({
      where: { activity_id: body.activity_id, type: type.toLowerCase() },
      raw: true
    });
    if (!row) {
      return this.errno.NOTFOUND;
    }

    const codeFactory = new Function(row.code);
    const closure = codeFactory();

    try {
      let payloadJSON = {};
      try {
        payloadJSON = JSON.parse(body.payload);
      } catch (error) {}

      return closure(
        options => this.call(options),
        body.payload,
        body.id,
        payloadJSON
      );
    } catch (error) {
      this.logger.error(body.activity_id, type, error);
      return this.errno.SERVER;
    }
  }
}

module.exports = CouldFunctionController;
