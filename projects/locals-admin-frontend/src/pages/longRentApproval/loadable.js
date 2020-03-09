
import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "LongRentApproval"*/'./index'),
    loading: LoadingComponent
})

export default class LongRentApproval extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
