import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "Authority"*/'./index'),
    loading: LoadingComponent
})

export default class PmsRoomMaintain extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
