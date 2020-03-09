import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "WalletDetails"*/'./index'),
    loading: LoadingComponent
})

export default class WalletDetails extends React.Component {
    render () {
        return <LoadableComponent />
    }
}