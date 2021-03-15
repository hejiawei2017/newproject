window.onresize = function() {
  alert(1);
};

setTimeout(() => {
  let oldRresize = window.onresize;
  window.onresize = function() {
    oldRresize && oldRresize();
    alert(2);
  };
}, 0);
