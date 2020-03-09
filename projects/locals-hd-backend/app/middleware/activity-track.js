'use strict';

const txScript = `
<script>
  var _mtac = {};
  (function() {
    var mta = document.createElement("script");
    mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
    mta.setAttribute("name", "MTAH5");
    mta.setAttribute("sid", "500671728");
    mta.setAttribute("cid", "500678128");
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(mta, s);
  })();
</script>
`;

const funDebugScript = `
<script src="https://js.fundebug.cn/fundebug.1.7.3.min.js" apikey="af4e0a2ec16c936284ca3ac28a5f3a32faeee9805276dbfbb7dc490049ab57c3"></script>
`;

module.exports = () => {
  return async (ctx, next) => {

    await next();

    ctx.body = `${ctx.body}${txScript}${funDebugScript}`;
  };
};
