import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "Login404"*/'./index'),
    loading: LoadingComponent
})

export default class Login404 extends React.Component {
    render () {
        return <LoadableComponent />
    }
}