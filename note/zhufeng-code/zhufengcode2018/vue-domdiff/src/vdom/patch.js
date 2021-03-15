import vnode, {isVnode, isSameVnode} from './vnode';

//把虚拟DOM节点封装成一个真实DOM节点
function createDOMElementFromVnode(vnode) {
  let children = vnode.children;
  let type = vnode.type;
  let props = vnode.props;
  if (type) {
    let domElement = vnode.domElement = document.createElement(type);
    updateProperties(vnode);
    if (Array.isArray(children)) {
      children.forEach(childVnode => domElement.appendChild(createDOMElementFromVnode(childVnode)));
    }
  } else {
    vnode.domElement = document.createTextNode(vnode.text);
  }
  return vnode.domElement;
}

export function mount(vnode, root) {
  let newDOMElement = createDOMElementFromVnode(vnode);
  root.appendChild(newDOMElement);
}

export function patch(oldVnode, newVnode) {
  if (oldVnode.type != newVnode.type) {
    return oldVnode.domElement.parentNode.replaceChild(createDOMElementFromVnode(newVnode), oldVnode.domElement);
  }
}

function updateProperties(vnode, oldProps = {}) {
  let domElement = vnode.domElement;
  let newProps = vnode.props;

  let oldStyle = oldProps.style || {};
  let newStyle = newProps.style || {};
  for (let oldAttrName in oldStyle)
    if (!newStyle[oldAttrName])
      domElement.style[oldAttrName] = "";

  for (let oldPropName in oldProps)
    if (!newProps[oldPropName])
      delete domElement[oldPropName];

  for (let propName in newProps) {
    if (propName == 'style') {
      let styleObject = newProps[propName];
      for (let attr in styleObject)
        domElement.style[attr] = styleObject[attr];//更新行内样式
    } else {
      domElement[propName] = newProps[propName];
    }
  }
}