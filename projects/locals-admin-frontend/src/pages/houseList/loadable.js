import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "HouseList"*/'./index'),
    loading: LoadingComponent
})

export default class HouseList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}