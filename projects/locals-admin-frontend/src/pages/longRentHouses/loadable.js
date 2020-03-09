
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "LongRentHouses"*/'./index'),
    loading: LoadingComponent
})

export default class LongRentLease extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
