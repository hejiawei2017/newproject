import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "InvoiceManage"*/'./index'),
    loading: LoadingComponent
})

export default class InvoiceManage extends React.Component {
    render () {
        return <LoadableComponent />
    }
}