import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "GoodsList"*/'./index'),
    loading: LoadingComponent
})

export default class ReportDboExcel extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
