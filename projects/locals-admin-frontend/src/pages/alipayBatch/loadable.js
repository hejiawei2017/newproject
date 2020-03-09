import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "AlipayBatch"*/'./index'),
    loading: LoadingComponent
})

export default class AlipayBatch extends React.Component {
    render () {
        return <LoadableComponent />
    }
}