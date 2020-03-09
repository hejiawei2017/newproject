import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "SignManager"*/'./index'),
    loading: LoadingComponent
})

export default class SignManager extends React.Component {
    render () {
        return <LoadableComponent />
    }
}