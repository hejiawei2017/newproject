import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "WeixinMessageRecord"*/'./index'),
    loading: LoadingComponent
})

export default class WeixinMessageRecord extends React.Component {
    render () {
        return <LoadableComponent />
    }
}