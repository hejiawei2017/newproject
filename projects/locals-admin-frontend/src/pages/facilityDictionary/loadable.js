import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "FacilityDictionary"*/'./index'),
    loading: LoadingComponent
})

export default class FacilityDictionary extends React.Component {
    render () {
        return <LoadableComponent />
    }
}