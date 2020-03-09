import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "WeixinUserlist"*/'./index'),
    loading: LoadingComponent
})

export default class WeixinUserlist extends React.Component {
    render () {
        return <LoadableComponent />
    }
}