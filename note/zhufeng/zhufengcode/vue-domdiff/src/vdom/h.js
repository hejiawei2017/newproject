import vnode from './vnode';
const hasOwnProperty = Object.prototype.hasOwnProperty;
const RESERVED_PROPS = { key: true };
function h(type, config, ...children) {
  const props = {};
  let key = null;
  if (config) {
    if (config.key) {
      key = config.key;
    }
    for (let propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS[propName]) {
        props[propName] = config[propName];
      }
    }
  }
  return vnode(type, key, props, children.map((child, index) => {
    return typeof child == 'number' || typeof child == 'string' ? vnode(undefined, undefined, undefined, undefined, child) : child;
  }));
}
export default h;