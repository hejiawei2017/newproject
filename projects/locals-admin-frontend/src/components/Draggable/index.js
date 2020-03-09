import React, { Component } from 'react';

/**
 * 参考地址 https://segmentfault.com/a/1190000015979373
 * 拷贝了这大神的源码进行了改造
 * 参数	       说明         	    类型	　        默认值
 value	       数据数组	        array	        []
 onChange	   释放拖拽时触发	    function(item)	－
 style	       样式	            object	        －
 render	       生成复杂数据的     function(item)	－
               渲染函数，
               参数为当前行数据
 isAcceptAdd   是否接受拖拽复制	boolean	        false
 sortKey	   设置根据排序的字段	    string	        －
 codeKey	   制定item中某个字段作为拖拽元素的key，必须唯一
 *
 * */
class Draggable extends Component {
    constructor (props) {
        super(props);
        this.state = {
            uId: this.guid()
        }
    }

    S4 () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    guid () {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    }
    // 拖动事件
    handleDomDrugStart = (sort, code, uId, item, ee) => {
        //在ie下第一个参数必须为 ‘text’, 谷歌和火狐则随意
        if(!!window.ActiveXObject || "ActiveXObject" in window) {
            ee.dataTransfer.setData('text', code);
        }
        ee.dataTransfer.setData("code", code);
        ee.dataTransfer.setData("uId", uId);
        ee.dataTransfer.setData("item", JSON.stringify(item));
        ee.dataTransfer.setData("sort", sort);
    }
    // 拖动后鼠标进入另一个可接受区域
    handleDragEnter = (ee) => {
        //可以在此设置一些样式之类的事情
        // if (ee.target.className.indexOf('droppedcontent') !== -1) {
        //     ee.target.className = styles.droppingContent;
        // }
    }
    // a拖到b，离开b的时候触发
    handleDragLeave = (ee) => {
        //可以在此设置一些样式之类的事情
        // if (ee.target.className.indexOf('droppingContent') !== -1) {
        //     ee.target.className = styles.droppedcontent;
        // }
    }
    // 对象排序
    compare (key) {
        return (obj1, obj2) => {
            if (obj1[key] < obj2[key]) {
                return -1;
            } else if (obj1[key] > obj2[key]) {
                return 1;
            }
            return 0
        }
    }
    // 当一个元素或是选中的文字被拖拽释放到一个有效的释放目标位置时
    handleDrop = (dropedSort, data, sortKey, dropedUid, codeKey, ee) => {
        // console.log('释放的时候ee', ee)
        ee.preventDefault();
        const code = ee.dataTransfer.getData("code");
        const uId = ee.dataTransfer.getData("uId");
        const dragedItem = ee.dataTransfer.getData("item");
        const sort = ee.dataTransfer.getData("sort");
        if (uId === dropedUid) {
            if (sort < dropedSort) {
                data.map(item => {
                    if (item[codeKey] === code) {
                        item[sortKey] = dropedSort;
                    } else if (item[sortKey] > sort && item[sortKey] < dropedSort + 1) {
                        item[sortKey]--;
                    }
                    return item;
                });
                // ee.target.before(document.getElementById(code))
            } else {
                data.map(item => {
                    if (item[codeKey] === code) {
                        item[sortKey] = dropedSort;
                    } else if (item[sortKey] > dropedSort - 1 && item[sortKey] < sort) {
                        item[sortKey]++;
                    }
                    return item;
                });
                // ee.target.after(document.getElementById(code))
            }
        } else if (this.props.isAcceptAdd) {
            let objDragedItem = JSON.parse(dragedItem);
            if (data.filter(item => item[codeKey] === objDragedItem[codeKey]).length === 0) {
                const maxSort = Math.max.apply(Math, data.map(citem => citem[sortKey]));
                data.map(item => {
                    if (dropedSort === maxSort) {
                        objDragedItem[sortKey] = dropedSort + 1;
                    } else {
                        if (item.sort > dropedSort) {
                            objDragedItem[sortKey] = dropedSort + 1;
                            item[sortKey]++
                        }
                    }
                    return item
                });
                data.push(objDragedItem)
            }
        }
        this.props.onChange(data)

        //可以在此设置一些移动后的目标元素样式
        // if (ee.target.className.indexOf('droppingContent') !== -1) {
        //     ee.target.className = styles.droppedcontent;
        // }
    }
    allowDrop = (ee) => {
        //防止拖拽时产生的阴影问题
        document.onmouseup = (e) => {
            document.onmousemove = null;
            document.onmouseup = null
        }
        ee.preventDefault();

    }
    // 生成拖拽组件
    createDraggleComponent (data, sortKey, style, uId, render, codeKey) {
        const that = this
        return data.sort(this.compare(sortKey)).map((item, index) => {
            return (
                <div
                    key={item[codeKey]}
                    draggable
                    onDragStart={function (event) { //控件开始被拖拽时触发的事件，它提供一个dataTransfer.setData()方法，将必要的数据存储在对象中便于在其它方法中调用
                        that.handleDomDrugStart(item[sortKey], item[codeKey], uId, item, event)
                    }}
                    onDragOver={function (event) { //规定当前控件可以接收拖拽的组件的方法，一般在此方法中阻止冒泡
                        that.allowDrop(event)
                    }}
                    onDragEnter={function (event) { //onDragEnter 拖动后鼠标进入另一个可接受区域时触发，通过它可以实现移入效果
                        that.handleDragEnter(event)
                    }}
                    onDragLeave={function (event) { //a拖到b，离开b的时候触发，可以用于监听消除移入效果的时机
                        that.handleDragLeave(event)
                    }}
                    onDrop={function (event) { //当控件被“释放”到一个有效的释放目标位置时触发，我在这个方法中处理数据，并通过它调用onChange方法，将value值暴露给父组件
                        that.handleDrop(item[sortKey], data, sortKey, uId, codeKey, event)
                    }}
                    style={{ ...style }}
                >{render(item, index)}</div>
            )
        })
    }
    render () {
        const { value, sortKey, codeKey, style, render } = this.props;
        const { uId } = this.state;
        return (
            <div>
                {this.createDraggleComponent(value, sortKey, style, uId, render, codeKey)}
            </div>
        )
    }
}
export default Draggable
