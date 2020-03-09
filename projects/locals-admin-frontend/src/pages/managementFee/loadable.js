import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ManagementFee"*/'./index'),
    loading: LoadingComponent
})

export default class ManagementFee extends React.Component {
    render () {
        return <LoadableComponent />
    }
}