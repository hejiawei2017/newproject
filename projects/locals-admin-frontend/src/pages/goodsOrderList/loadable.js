import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "GoodsOrderList"*/'./index'),
    loading: LoadingComponent
})

export default class GoodsOrderList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}