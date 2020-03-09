import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'


const WxUserLabelCom = Loadable({
    loader: () => import(/* webpackChunkName: "wxUserLabel"*/'./index'),
    loading: LoadingComponent
})

export default class wxUserLabel extends React.Component {
    render () {
        return <WxUserLabelCom />
    }
}