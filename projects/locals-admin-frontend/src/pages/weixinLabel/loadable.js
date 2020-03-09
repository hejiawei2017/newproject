import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "WeixinLabel"*/'./index'),
    loading: LoadingComponent
})

export default class WeixinLabel extends React.Component {
    render () {
        return <LoadableComponent />
    }
}