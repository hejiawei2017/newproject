import { post } from "../common/request";
import EnvConfig from "../config/env-config";

const Host = EnvConfig.envConfig.apiBoost; // node host

export const receiveCoupon = (data, options) =>
  post(`${Host}/new_use_redpacket/index`, data, options);
