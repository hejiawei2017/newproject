
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "LongRentLease"*/'./index'),
    loading: LoadingComponent
})

export default class PmsStoreList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}