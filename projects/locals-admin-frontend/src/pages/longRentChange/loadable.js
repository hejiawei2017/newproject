
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "LongRentChange"*/'./index'),
    loading: LoadingComponent
})

export default class LongRentChange extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
