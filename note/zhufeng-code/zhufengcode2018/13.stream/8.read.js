let fs = require('fs');
let path = require('path');
let rs = fs.createReadStream(path.join(__dirname, 'compute.js'));
rs.on('data', function (data) {
    console.log(data.toString());
})