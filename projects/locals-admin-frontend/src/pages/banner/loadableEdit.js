import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "BannerEdit"*/'./bannerEdit'),
    loading: LoadingComponent
})

export default class BannerEdit extends React.Component {
    render () {
        return <LoadableComponent />
    }
}