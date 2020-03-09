import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "WeixinCustomerMessage"*/'./index'),
    loading: LoadingComponent
})

export default class WeixinCustomerMessage extends React.Component {
    render () {
        return <LoadableComponent />
    }
}