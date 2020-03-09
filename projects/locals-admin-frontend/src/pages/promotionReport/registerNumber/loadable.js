import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "RegisterNumber"*/'./index'),
    loading: LoadingComponent
})

export default class RegisterNumber extends React.Component {
    render () {
        return <LoadableComponent />
    }
}