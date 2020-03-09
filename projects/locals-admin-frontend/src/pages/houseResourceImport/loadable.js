import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "HouseResourceImport"*/'./index'),
    loading: LoadingComponent
})

export default class HouseResourceImport extends React.Component {
    render () {
        return <LoadableComponent />
    }
}