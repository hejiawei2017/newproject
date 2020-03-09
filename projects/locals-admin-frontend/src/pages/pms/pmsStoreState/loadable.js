
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PmsStoreState"*/'./index'),
    loading: LoadingComponent
})

export default class PmsStoreState extends React.Component {
    render () {
        return <LoadableComponent />
    }
}