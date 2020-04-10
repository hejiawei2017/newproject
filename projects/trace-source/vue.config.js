 module.exports = {
    publicPath: './',
    productionSourceMap: false,
    devServer: {


      proxy: {
        "/api": {
            target: "http://127.0.0.1:3001", 
            changOrigin: true
         }
       }
      
    }
}