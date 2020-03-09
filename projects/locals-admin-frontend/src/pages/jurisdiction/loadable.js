import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "Jurisdiction"*/'./index'),
    loading: LoadingComponent
})

export default class Jurisdiction extends React.Component {
    render () {
        return <LoadableComponent />
    }
}