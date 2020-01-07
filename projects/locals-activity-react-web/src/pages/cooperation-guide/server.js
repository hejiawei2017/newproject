import { post } from "../../common/request";
import EnvConfig from "../../config/env-config";

const Host = EnvConfig.envConfig.apiBoost; // node host

export const postJoin = (data, options) =>
  post(`${Host}/report/index`, data, options);