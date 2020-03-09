'use strict';

const path = require('path');

module.exports = app => {
  app.loader.loadToContext(path.join(app.config.baseDir, 'app/apis'), 'api');
  app.loader.loadToApp(path.join(app.config.baseDir, 'app/utils'), 'util');
  app.loader.loadToApp(path.join(app.config.baseDir, 'app/constants'), 'const');

  // @https://github.com/eggjs/egg-session
  // Implement a session store with redis
  const REDIS_NAMESPACE = 'hd/';
  const DEFAULT_SUBNAMESPACE = app.config.redis.namespace.server;
  app.sessionStore = {
    async getWithNamespace(key, namespace = DEFAULT_SUBNAMESPACE) {
      this.get(`${namespace}${key}`);
    },

    async get(key) {
      try {
        const res = await app.redis.get(REDIS_NAMESPACE + key);
        if (!res) return null;
        return JSON.parse(res);
      } catch (error) {
        app.logger.error(error);
        return null;
      }
    },

    async setWithNamespace({
      key,
      value,
      namespace = DEFAULT_SUBNAMESPACE,
      maxAge = 60 * 60 * 1000,
    }) {
      this.set(`${namespace}${key}`, value, maxAge);
    },

    async set(key, value, maxAge = 60 * 60 * 1000) {
      try {
        value = JSON.stringify(value);
        await app.redis.set(REDIS_NAMESPACE + key, value, 'PX', maxAge);
      } catch (error) {
        app.logger.error(error);
      }
    },

    async destroyWithNamespace(key, namespace = DEFAULT_SUBNAMESPACE) {
      this.destroy(`${namespace}${key}`);
    },

    async destroy(key) {
      await app.redis.del(key);
    },
  };
};
