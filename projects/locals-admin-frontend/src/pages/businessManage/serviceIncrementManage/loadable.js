import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ServiceIncrementManage"*/'./index'),
    loading: LoadingComponent
})

export default class ServiceIncrementManage extends React.Component {
    render () {
        return <LoadableComponent />
    }
}