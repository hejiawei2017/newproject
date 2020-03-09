import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "CityList"*/'./index'),
    loading: LoadingComponent
})

export default class CityList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}