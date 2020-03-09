import Loadable from 'react-loadable';
import React from 'react'
import LoadingComponent from '../../components/LoadingComponent'

const LoadableComponent = Loadable({
    loader: () => import(/* webpackChunkName: "AummerActivityApplication"*/'./index'),
    loading: LoadingComponent
})

export default class AummerActivityApplication extends React.Component {
    render () {
        return <LoadableComponent />
    }
}