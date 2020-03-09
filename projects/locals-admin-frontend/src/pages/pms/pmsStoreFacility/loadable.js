
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "PmsStoreFacility"*/'./index'),
    loading: LoadingComponent
})

export default class PmsStoreFacility extends React.Component {
    render () {
        return <LoadableComponent />
    }
}