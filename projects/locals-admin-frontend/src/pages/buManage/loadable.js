import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "BuManage"*/'./index'),
    loading: LoadingComponent
})

export default class BuManage extends React.Component {
    render () {
        return <LoadableComponent />
    }
}