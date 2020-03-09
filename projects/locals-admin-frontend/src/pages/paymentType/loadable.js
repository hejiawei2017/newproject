import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PaymentType"*/'./index'),
    loading: LoadingComponent
})

export default class PaymentType extends React.Component {
    render () {
        return <LoadableComponent />
    }
}