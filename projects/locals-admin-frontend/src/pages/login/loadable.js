import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "Login"*/'./index'),
    loading: LoadingComponent
})

export default class Login extends React.Component {
    render () {
        return <LoadableComponent />
    }
}