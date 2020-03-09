import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "WalletPayImport"*/'./index'),
    loading: LoadingComponent
})

export default class WalletPayImport extends React.Component {
    render () {
        return <LoadableComponent />
    }
}