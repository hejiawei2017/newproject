import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "DoorLockManageList"*/'./index'),
    loading: LoadingComponent
})

export default class DoorLockManageList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
