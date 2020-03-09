import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PoiLabel"*/'./index'),
    loading: LoadingComponent
})
export default class PoiLabel extends React.Component {
    render () {
        return <LoadableComponent />
    }
}