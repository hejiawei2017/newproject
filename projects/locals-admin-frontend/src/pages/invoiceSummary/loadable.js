import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "InvoiceSummary"*/'./index'),
    loading: LoadingComponent
})

export default class InvoiceSummary extends React.Component {
    render () {
        return <LoadableComponent />
    }
}