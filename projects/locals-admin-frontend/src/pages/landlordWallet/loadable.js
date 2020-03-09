import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "LandlordWallet"*/'./index'),
    loading: LoadingComponent
})

export default class LandlordWallet extends React.Component {
    render () {
        return <LoadableComponent />
    }
}