
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PmsUnderHouse"*/'./index'),
    loading: LoadingComponent
})

export default class PmsUnderHouse extends React.Component {
    render () {
        return <LoadableComponent />
    }
}