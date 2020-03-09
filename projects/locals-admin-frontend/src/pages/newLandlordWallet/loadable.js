import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "NewLandlordWallet"*/'./index'),
    loading: LoadingComponent
})

export default class MemberManager extends React.Component {
    render () {
        return <LoadableComponent />
    }
}