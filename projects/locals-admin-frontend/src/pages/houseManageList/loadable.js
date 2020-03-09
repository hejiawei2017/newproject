import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "HouseManageList"*/'./index'),
    loading: LoadingComponent
})

export default class HouseManageList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}
