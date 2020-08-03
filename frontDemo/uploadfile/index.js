var express = require('express');

var app = express();
app.use(express.static('./public'));

var proxy = require("http-proxy-middleware");
var options = {
    target: 'http://14.23.157.98:8090', // target host
    changeOrigin: true,               // needed for virtual hosted sites
};
var exampleProxy = proxy.createProxyMiddleware('/uploadfromfront',options);
app.use(exampleProxy);
app.listen(3004,()=>{
	console.log("listen in 3004")
});