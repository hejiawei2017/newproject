import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "Promotion"*/'./index'),
    loading: LoadingComponent
})

export default class Promotion extends React.Component {
    render () {
        return <LoadableComponent />
    }
}