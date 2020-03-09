
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PmsStoreHome"*/'./index'),
    loading: LoadingComponent
})

export default class PmsStoreHome extends React.Component {
    render () {
        return <LoadableComponent />
    }
}