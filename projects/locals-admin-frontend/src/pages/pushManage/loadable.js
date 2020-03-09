import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PushManage"*/'./index'),
    loading: LoadingComponent
})

export default class PushManage extends React.Component {
    render () {
        return <LoadableComponent />
    }
}