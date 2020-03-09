import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "HouseChecking"*/'./index'),
    loading: LoadingComponent
})

export default class HouseContract extends React.Component {
    render () {
        return <LoadableComponent />
    }
}