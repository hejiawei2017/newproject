import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "HouseMaintain"*/'./index'),
    loading: LoadingComponent
})

export default class HouseMaintain extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
