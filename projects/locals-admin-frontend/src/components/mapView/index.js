import React, { Component } from 'react'
import { Map, Marker } from 'react-amap'
import Axios from 'axios'
class MapView extends Component {

    constructor () {
        super()
        this.state = {
            aMapkey: 'd95a5a18adfc4e134c0ce8bc101439b4',
            aMapUrl: 'http://restapi.amap.com/v3/geocode/geo',
            position: {
                longitude: 0,
                latitude: 0
            },
            pluginConfig: [{name: 'ToolBar', visible: true}]
        }
    }
    componentDidMount () {
        this.props.onRef(this)
    }
    //父组件主动调用当前函数进行地图处理
    //入参如下@handleType 处理类型，@params 需要处理的参数
    touchMapHandle = (handleType, params) => {
        if(!!params) {
            if(handleType === 'getAddress') {//根据经纬度，获取地址
                //TODO
                // this.getMapAddress()
            }else if(handleType === 'getPosition') { //根据地址，获取经纬度
                this.getMapPosition(params)
            }else if(handleType === 'showPosition') {
                this.setState({
                    position: params
                })
            }
        }
    }

    //根据地址，获取经纬度
    getMapPosition = (address) => {
        const self = this
        let _url = this.state.aMapUrl + '?key=' + this.state.aMapkey + '&address=' + address
        Axios(_url).then(response => {
            return response.data;
        }).then(function (data) {
            let arr = data.geocodes[0].location.split(',')
            if(data.status === '1') {
                let position = {
                    longitude: arr[0] || 0,
                    latitude: arr[1] || 0
                }
                self.setState({
                    position
                }, () => {
                    //回调到父组件
                    self.props.handleMapCallback(position)
                })
                console.log(data)
            }
        })
    }
    //根据经纬度，获取地址
    getMapAddress = (location) => {
        console.log('TODO')
    }

    render () {
        const { aMapkey, position, pluginConfig } = this.state
        return (
            <div style={{
                width:'100%',
                height:500,
                border:'1px solid #ccc'
            }}
            >
                <Map amapkey={aMapkey}
                     center={position}
                     plugins={pluginConfig}
                     zoom={14}
                >
                    <Marker position={position}></Marker>
                </Map>
            </div>
        )
    }
}
export default MapView
