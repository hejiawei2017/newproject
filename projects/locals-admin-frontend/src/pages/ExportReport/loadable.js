import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ExportReport"*/'./index'),
    loading: LoadingComponent
})

export default class ExportReport extends React.Component {
    render () {
        return <LoadableComponent />
    }
}