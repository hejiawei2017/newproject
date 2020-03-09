import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PingAnInsure"*/'./index'),
    loading: LoadingComponent
})

export default class PingAnInsure extends React.Component {
    render () {
        return <LoadableComponent />
    }
}