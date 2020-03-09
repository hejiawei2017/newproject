import Loadable from 'react-loadable';
import React, {Component} from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "OrderList"*/'./index'),
    loading: LoadingComponent
})

export default class OrderList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}