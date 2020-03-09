import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent/index'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "CleanKeepingOrderList"*/'./index'),
    loading: LoadingComponent
})

export default class CleanKeepingOrderList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
