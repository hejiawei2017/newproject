import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "Payments"*/'./index'),
    loading: LoadingComponent
})

export default class Payments extends React.Component {
    render () {
        return <LoadableComponent />
    }
}