import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "RegisterDetail"*/'./index'),
    loading: LoadingComponent
})

export default class RegisterDetail extends React.Component {
    render () {
        return <LoadableComponent />
    }
}