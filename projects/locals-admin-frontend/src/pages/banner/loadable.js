import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "BannerList"*/'./index'),
    loading: LoadingComponent
})

export default class BannerList extends React.Component {
    render () {
        return <LoadableComponent />
    }
}