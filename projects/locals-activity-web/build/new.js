const fs = require('fs');
const path = require('path');
const files = process.argv.slice(2)
const pagePath = path.resolve(__dirname, '../src/page')
const htmlTemplate = `<!DOCTYPE html>
<html lang="ch">
<head>
    <meta charset="UTF-8">
    <title>活动页</title>
</head>
<body>
    
</body>
</html>`

files.forEach(function (filename, i) {
    let dir = path.join(pagePath, filename)
    let css = path.join(dir, 'css')
    let fonts = path.join(dir, 'fonts')
    let js = path.join(dir, 'js')
    let components = path.join(js, 'components')
    let images = path.join(dir, 'images')
    
    // 生成文件夹
    fs.mkdirSync(dir, 0755, callback);
    fs.mkdirSync(css, 0755, callback);
    fs.mkdirSync(js, 0755, callback);
    fs.mkdirSync(components, 0755, callback);
    fs.mkdirSync(images, 0755, callback);
    
    // 生成默认文件
    fs.open(path.join(dir, 'index.html'), "w", 0644, function(e,fd){
        if(e) throw e;
        fs.write(fd, htmlTemplate, 0, 'utf8', function(e){
            if(e) throw e;
            fs.closeSync(fd);
        })
    });

    fs.open(path.join(js, 'index.js'), "w", 0644, function(e,fd){
        if(e) throw e;
        fs.write(fd, "// do Something!", 0, 'utf8', function(e){
            if(e) throw e;
            fs.closeSync(fd);
        })
    });
})

console.log('文件生成成功，开始加班吧~')

function callback(e){
    if(e){
        console.log('出错了');
    }else{
        console.log("创建成功")
    }
}

function mkdirSync(url, mode, cb){
    var path = require("path"), arr = url.split("/");
    mode = mode || 0755;
    cb = cb || function(){};
    if(arr[0]==="."){//处理 ./aaa
        arr.shift();
    }
    if(arr[0] == ".."){//处理 ../ddd/d
        arr.splice(0,2,arr[0]+"/"+arr[1])
    }
    function inner(cur){
        if(!path.existsSync(cur)){//不存在就创建一个
            fs.mkdirSync(cur, mode)
        }
        if(arr.length){
            inner(cur + "/"+arr.shift());
        }else{
            cb();
        }
    }
    arr.length && inner(arr.shift());
}