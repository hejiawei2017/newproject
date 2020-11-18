import { h } from './vdom';
const root = document.getElementById('root');
const oldVnode = h('div', { id: 'container' },
  h('span', { style: { color: 'red' } }, 'hello'),
  'world'
);
console.log(oldVnode);
mount(oldVnode, root);
//const newVnode = vnode(undefined, undefined, undefined, undefined, '新的文本');
const newVnode = h('div', { id: 'container' }, '新的文本');
setTimeout(() => {
  patch(oldVnode, newVnode);
}, 1000)