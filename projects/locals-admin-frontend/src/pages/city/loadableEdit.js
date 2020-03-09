import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "CityEdit"*/'./cityEdit'),
    loading: LoadingComponent
})

export default class CityEdit extends React.Component {
    render () {
        return <LoadableComponent />
    }
}