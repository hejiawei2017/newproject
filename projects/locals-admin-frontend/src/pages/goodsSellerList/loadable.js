import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "GoodsSellerList"*/'./index'),
    loading: LoadingComponent
})

export default class GoodsSellerList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}