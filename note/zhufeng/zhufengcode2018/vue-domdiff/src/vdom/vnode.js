const VNODE_TYPE = 'VNODE_TYPE';
function vnode(type, key, props = {}, children, text, DOMElement) {
  return {
    _type: VNODE_TYPE,
    type, key, props, children, text, DOMElement
  }
}
//是否是一个虚拟DOM节点
export function isVnode(vnode) {
    return vnode && vnode._type === VNODE_TYPE;
}
//是否是相同的节点 类型相同并且key相同 key可能为null
export  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.key === newVnode.key && oldVnode.type === newVnode.type;
}
export default vnode;