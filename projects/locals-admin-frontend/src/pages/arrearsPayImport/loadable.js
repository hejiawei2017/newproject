import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "ArrearsPayImport"*/'./index'),
    loading: LoadingComponent
})

export default class ArrearsPayImport extends React.Component {
    render () {
        return <LoadableComponent />
    }
}