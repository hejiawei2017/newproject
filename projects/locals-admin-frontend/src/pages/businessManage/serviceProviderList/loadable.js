import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ServiceProviderList"*/'./index'),
    loading: LoadingComponent
})

export default class ServiceProviderList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}