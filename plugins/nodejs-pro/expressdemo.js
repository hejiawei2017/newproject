const express = require('express');
const app = express();

//允许跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//数据源
let datas = [
    { value: 0, label: "item0" },
    { value: 1, label: "item1" },
    { value: 2, label: "item2" },
    { value: 3, label: "item3" },
    { value: 4, label: "item4" },
    { value: 5, label: "item5" },
    { value: 6, label: "item6" },
    { value: 7, label: "item7" },
    { value: 8, label: "item8" },
    { value: 9, label: "item9" },
    { value: 10, label: "item10" },
    { value: 11, label: "item11" },
    { value: 12, label: "item12" },
    { value: 13, label: "item13" },
    { value: 14, label: "item14" },

]



//列表数据
app.get("/loadData", function (req, res, next) {
    let page_index = req.query.page_index;
    let page_size = req.query.page_size;
    let filterValue = req.query.filterValue;
    console.log(filterValue)
    let filterData = datas
    if (filterValue) {
        filterData = filterData.filter((item) => {
            if (item.label.indexOf(filterValue) != -1) {
                return true
            }
        })
    }

    let results = filterData.slice((page_index - 1) * page_size, page_index * page_size)
    res.json({
        resp_code: '00000000',
        resp_message: 'SUCC',
        page_total: 100,
        result: results
    })

})
app.listen(3007, function () {
    console.log("listen in 3007")
})
