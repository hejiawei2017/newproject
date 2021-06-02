var express = require('express');

var app = express();
app.use(express.static('./public'));

var proxy = require("http-proxy-middleware");
var options = {
    target: 'http://10.10.104.3:80', // target host
    changeOrigin: true,               // needed for virtual hosted sites
};
var exampleProxy = proxy.createProxyMiddleware('/uploadfromfront', options);
app.use(exampleProxy);

app.use(proxy.createProxyMiddleware('/access', {
    target: 'http://10.10.104.3/ia/do/', // target host
    changeOrigin: true,               // needed for virtual hosted sites
}));

app.listen(3004, () => {
    console.log("listen in 3004")
});