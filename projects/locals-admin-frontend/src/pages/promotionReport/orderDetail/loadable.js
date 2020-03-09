import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "OrderQuery"*/'./index'),
    loading: LoadingComponent
})

export default class OrderQuery extends React.Component {
    render () {
        return <LoadableComponent />
    }
}