import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent/index'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "CleanKeepingCorporationList"*/'./index'),
    loading: LoadingComponent
})

export default class CleanKeepingCorporationList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
